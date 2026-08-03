# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Snail Rush is a real-time two-player racing game (Three.js/react-three-fiber + Rapier physics) built with React + TypeScript + Vite. Players race snails around a track, dodging obstacles, synced live over WebSocket. This repo is the frontend only; the game server lives in a separate repo (`snail-backend`, deployed via Docker Compose on the same host).

## Commands

```bash
yarn dev                  # start dev server (vite)
yarn dev:host             # dev server bound to LAN, mode=devhost (see .env.devhost)
yarn build                # tsc typecheck + vite build
yarn build:tailscale      # build with mode=tailscale (see .env.tailscale)
yarn start                # build + vite preview
yarn lint                 # eslint ./src
yarn type-check           # tsc --noEmit
yarn test                 # type-check + lint + vitest (full CI-equivalent gate)
yarn test:vitest          # vitest only
yarn test:coverage        # vitest --coverage
```

Run a single test file: `yarn vitest run src/features/snail/model/__test__/use-collision.test.ts`
Run tests matching a name: `yarn vitest run -t "some test name"`

Tests live next to the code they cover, in `__test__/` folders (currently only under `src/features/snail/model/`). Test environment is jsdom (see `vitest.config.ts`); coverage excludes barrel/type/store/router-ish files (`index.ts`, `types.ts`, `store.ts`, `routes.tsx`, `app.tsx`, etc.) — see the `coverage.exclude` list before assuming a file should have direct tests.

There is no separate `.env` for prod secrets in git — `.env`, `.env.development`, `.env.devhost`, `.env.tailscale` only carry `VITE_CLIENT_IP` / `VITE_CLIENT_PORT` / `VITE_SERVER_PORT`, used to build the API/WS base URLs and the vite dev proxy target.

## Architecture

### Feature-Sliced Design (FSD)

Code under `src/` is organized in FSD layers, each importable only via its path alias (never deep-import another slice's internals):

```
app/       @app       — router, layouts (route-level providers), i18n bootstrap
pages/     @pages     — route screens, composed from widgets/features
widgets/   @widgets   — composite UI blocks (game map, pause menu, game-over, player snail)
features/  @features  — one user-facing capability each (snail control, opponent sync, lobby events, countdown, menu, auth, tracking-camera, logflow)
entities/  @entities  — domain data + queries (session, players, user, skin)
shared/    @shared     — framework-agnostic libs, api clients, uikit, config
```

Aliases are declared in three places that must stay in sync: `tsconfig.json` (`paths`), `vite.config.ts` (`resolve.alias`), `vitest.config.ts` (`resolve.alias`), and mirrored again for eslint's import resolver in `eslint.config.js`.

Within a slice, code is grouped by intent, not by type: `model/` (hooks, stores, business logic), `ui/` (components), `lib/` (pure helpers), `api/` (network calls). Each slice re-exports its public surface through `index.ts` — that's the only thing other layers should import.

### Routing and layout nesting

`src/app/router.tsx` composes routes as deeply nested layout wrappers rather than route-level loaders — e.g. the `/lobby` route is wrapped by `LobbyRedirectLayout → CountdownLayout → TrackCameraLayout → MainMenuLayout → AuthLayout → WebSocketLayout → LobbyMenuLayout`. Each layout owns one cross-cutting concern (auth gate, websocket connection, camera following, countdown timer, menu mode) and typically reads/writes a zustand store or a react-query cache rather than passing props down. When touching routing behavior, check `src/app/layouts/*` for the layout that owns the concern before adding new state elsewhere.

`Routes.SINGLE` and `Routes.EDITOR` (single-player debug mode, map editor) are only registered when `NODE_ENV === 'development'` — they don't exist in production builds.

### Real-time multiplayer sync

- `WebSocketProvider` (`src/shared/lib/websocket.tsx`) opens one WebSocket per lobby session at `${WS_HOST_URL}/api/v1/gameplay/session/{sessionId}/player/{userId}/start/` and dispatches all inbound messages through a single `handleMessage` callback.
- `src/features/lobby-events/model/use-events-handler.ts` is the message router: it switches on `MessageType` and calls into the handler map wired up in `WebSocketLayout` (game start/finish, player connect/kick, opponent position/rotation/shrink).
- Outbound state changes (local player moves, jumps, rotates) are sent via the `use-send-*` hooks in `features/lobby-events/model/`.
- Locally-driven physics (this player) lives in `features/player-control` + `features/snail`; remote opponent state is replayed (not simulated) via `features/opponent-control`'s position/rotation/shrink "emitters", fed by the WebSocket handlers rather than physics input.
- Game state (running/paused/finished, winner, moveable flag) is centralized in `features/game/store.ts` (zustand), separate from the session/lobby data which comes from react-query (`entities/session`).

### Physics & 3D

Built on `@react-three/fiber` + `@react-three/rapier` + `@react-three/drei`. Track geometry/obstacles live in `shared/lib/game/*.tsx` (map, obstacle, start, finish, primitive) and `widgets/game-map`. Snail movement/collision tuning constants are in `shared/config/game.ts` (e.g. `STUN_TIMEOUT`, `MAX_SPACE_HOLD_TIME`) and `features/player-control/model/constants.ts` — check these before hardcoding a magic number elsewhere. `features/snail/model/use-collision.ts`, `use-jump.ts`, and `impulse.ts` have direct unit tests; treat them as the reference for how collision/jump/impulse math is expected to behave.

A runtime devtools panel (`shared/lib/devtools/`) lets features register debug controls via `useRegisterTools(tools)` — grep existing `useRegisterTools` call sites before adding a new physics-tuning UI, since the todo list explicitly wants more physics params exposed this way rather than as new ad-hoc UI.

### Data layer

- HTTP clients: `shared/api/base-template.ts` (plain axios instance) and `shared/api/auth-template.ts` (adds Bearer token from `shared/config/token.ts`, clears token on 401). Per-domain API modules (`shared/api/session.ts`, `player.ts`, `skin.ts`, `auth.ts`) wrap these and define the raw DTO shapes.
- Each entity has a `query.ts` (react-query hooks, returns app-shaped types via `select`) and a `lib/parse-*-dto.ts` (DTO → domain type mapping, snake_case → camelCase). Follow this DTO-parse-select pattern for new entities rather than consuming raw API shapes in components.
- Local persisted UI/session state (e.g. session code, auth token) uses zustand's `persist` middleware against `sessionStorage`/`localStorage` — see `entities/session/model/store.ts` for the pattern.

### i18n

`react-i18next`, bootstrapped in `src/app/i18n.ts`. Translations are split per-slice: app-level strings in `src/app/lib/locales/i18n-{en,ru}.json`, feature-specific strings colocated in that feature (e.g. `src/features/logflow/lib/locales/`). Russian is the primary/source language for UI copy (see README).
