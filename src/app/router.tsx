import HomePage from '@pages/home'
import GameMap from '@pages/home/ui/game-map'
import GameOver from '@pages/home/ui/game-over'
import LobbyMenu from '@pages/home/ui/lobby-menu'
import PauseMenu from '@pages/home/ui/pause-menu-with-deps'
import PlayerSuspense from '@pages/home/ui/player-snail'
import { queryClient } from '@shared/api/query-client'
import { Routes } from '@shared/model/routes'
import { QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import AppLayout from './layouts/app-layout'
import CountdownLayout from './layouts/countdown-layout'
import LobbyMenuLayout from './layouts/lobby-menu-layout'
import MainMenuLayout from './layouts/main-menu-layout'
import TrackCameraLayout from './layouts/track-camera-layout'
import WebSocketLayout from './layouts/websocket-layout'

export const router = createBrowserRouter([
  {
    path: Routes.HOME,
    element: (
      <QueryClientProvider client={queryClient}>
        <AppLayout>
          <TrackCameraLayout>
            <CountdownLayout>
              <MainMenuLayout>
                <HomePage />
                <Outlet />
              </MainMenuLayout>
            </CountdownLayout>
          </TrackCameraLayout>
        </AppLayout>
      </QueryClientProvider>
    ),
    children: [
      {
        path: Routes.LOBBY,
        element: (
          <WebSocketLayout>
            <LobbyMenuLayout>
              <LobbyMenu />
              <GameMap />
              <PauseMenu />
              <GameOver />
              <PlayerSuspense />
            </LobbyMenuLayout>
          </WebSocketLayout>
        ),
      },
    ],
  },
])
