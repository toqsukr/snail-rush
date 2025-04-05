import { useIsHost } from '@features/auth/use-is-host'
import { useLobbyEventsContext } from '@features/lobby-events'
import { Menu, menuDepsContext, PauseButton } from '@features/menu'
import { useTrackCameraContext } from '@features/tracking-camera'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'
import { Vector3 } from 'three'
import { getPlayerPosition, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

const menuStartRotation = [0, Math.PI, 0] satisfies [number, number, number]

const MenuWithDeps: FC<{ startTimer: () => void }> = ({ startTimer }) => {
  const checkHost = useIsHost()
  const { sendStartGame } = useLobbyEventsContext()
  const {
    pauseGame,
    resumeGame,
    updatePlayerStatus,
    playerStatus,
    menuPosition,
    resetMenuPosition,
  } = useGameStore()

  const { followTarget } = useTrackCameraContext()

  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus ?? 'host'))

  return (
    <Html
      position={menuPosition}
      rotation={menuStartRotation}
      portal={{ current: document.body }}
      occlude='raycast'
      transform>
      <menuDepsContext.Provider
        value={{
          isHost: checkHost,
          onPause: pauseGame,
          onContinue: resumeGame,
          onBackToLobby: resetMenuPosition,
          onConnectLobby: () => updatePlayerStatus('joined'),
          onDisconnectLobby: () => updatePlayerStatus(null),
          onCreateLobby: () => {
            updatePlayerStatus('host')
          },
          onDeleteLobby: () => {
            updatePlayerStatus(null)
          },
          onPlay: async () => {
            sendStartGame()
            await followTarget(new Vector3(...playerStartPosition))
            startTimer()
          },
        }}>
        <QueryClientProvider client={queryClient}>
          <Menu />
          <PauseButton />
        </QueryClientProvider>
      </menuDepsContext.Provider>
    </Html>
  )
}

export default MenuWithDeps
