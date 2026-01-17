import { createBrowserRouter, Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { AuthPage } from '@pages/auth'
import HomePage from '@pages/home'
import { GameOver } from '@widgets/game-over'
import { LobbyMenu } from '@pages/home/ui/lobby-menu'
import EditorMap from '@pages/editor'
import SinglePlayerPage from '@pages/single-player'
import { PauseMenu } from '@widgets/pause-menu'
import { PlayerSuspense } from '@widgets/player-snail'
import { GrassGameMap } from '@widgets/game-map'
import { TrackingCamera } from '@features/tracking-camera'
import { queryClient } from '@shared/api/query-client'
import { Routes } from '@shared/model/routes'

import AppLayout from './layouts/app-layout'
import AuthLayout from './layouts/auth-layout'
import CountdownLayout from './layouts/countdown-layout'
import LobbyMenuLayout from './layouts/lobby-menu-layout'
import LobbyRedirectLayout from './layouts/lobby-redirect-layout'
import MainMenuLayout from './layouts/main-menu-layout'
import NonAuthLayout from './layouts/non-auth-layout'
import TrackCameraLayout from './layouts/track-camera-layout'
import WebSocketLayout from './layouts/websocket-layout'

const devRoutes =
  process.env.NODE_ENV === 'development'
    ? [
        {
          path: Routes.SINGLE,
          element: (
            <AuthLayout>
              <SinglePlayerPage />
            </AuthLayout>
          ),
        },
        {
          path: Routes.EDITOR,
          element: (
            <AuthLayout>
              <EditorMap />
            </AuthLayout>
          ),
        },
      ]
    : []

export const router = createBrowserRouter([
  {
    element: (
      <QueryClientProvider client={queryClient}>
        <AppLayout>
          <Outlet />
          {/* <OrbitControls /> */}
          {/* <Perf position='top-left' /> */}
        </AppLayout>
      </QueryClientProvider>
    ),
    children: [
      {
        path: Routes.HOME,
        element: (
          <LobbyRedirectLayout>
            <CountdownLayout>
              <TrackCameraLayout>
                <MainMenuLayout>
                  <AuthLayout>
                    <HomePage />
                    <Outlet />
                  </AuthLayout>
                </MainMenuLayout>
              </TrackCameraLayout>
            </CountdownLayout>
          </LobbyRedirectLayout>
        ),
        children: [
          {
            path: Routes.LOBBY,
            element: (
              <WebSocketLayout>
                <LobbyMenuLayout>
                  <LobbyMenu />
                  <GrassGameMap />
                  <PauseMenu />
                  <GameOver />
                  <PlayerSuspense />
                </LobbyMenuLayout>
              </WebSocketLayout>
            ),
          },
        ],
      },
      {
        path: Routes.AUTH,
        element: (
          <LobbyRedirectLayout>
            <CountdownLayout>
              <TrackCameraLayout>
                <MainMenuLayout>
                  <NonAuthLayout>
                    <AuthPage />
                    <TrackingCamera />
                  </NonAuthLayout>
                </MainMenuLayout>
              </TrackCameraLayout>
            </CountdownLayout>
          </LobbyRedirectLayout>
        ),
      },
      ...devRoutes,
    ],
  },
])
