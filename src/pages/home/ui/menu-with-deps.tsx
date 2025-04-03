import { useIsHost } from '@features/auth/use-is-host'
import { useLobbyEventsContext } from '@features/lobby-events'
import { Menu, menuDepsContext } from '@features/menu'
import { Html } from '@react-three/drei'
import { queryClient } from '@shared/api/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { useGameStore } from '../model/store'

const MenuWithDeps = () => {
  const checkHost = useIsHost()
  const { sendStartGame } = useLobbyEventsContext()
  const { pauseGame, resumeGame, updatePlayerStatus } = useGameStore()

  return (
    <Html
      position={[0, 35, -10]}
      rotation={[0, Math.PI, 0]}
      portal={{ current: document.body }}
      occlude='raycast'
      transform>
      <menuDepsContext.Provider
        value={{
          isHost: checkHost,
          onPlay: sendStartGame,
          onPause: pauseGame,
          onContinue: resumeGame,
          onCreateLobby: () => updatePlayerStatus('host'),
          onConnectLobby: () => updatePlayerStatus('joined'),
          onDeleteLobby: () => updatePlayerStatus(null),
          onDisconnectLobby: () => updatePlayerStatus(null),
        }}>
        <QueryClientProvider client={queryClient}>
          <Menu />
        </QueryClientProvider>
      </menuDepsContext.Provider>
    </Html>
  )
}

export default MenuWithDeps
