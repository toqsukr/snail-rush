import { queryClient } from '@modules/app/api'
import { webSocketContext } from '@modules/app/websocket-provider/WebSocketProvider'
import { useAppState } from '@modules/gameplay/store'
import { usePlayerData } from '@modules/player/store'
import { Html } from '@react-three/drei'
import LoadingLayout from '@shared/loading-layout/LoadingLayout'
import { QueryClientProvider } from '@tanstack/react-query'
import { useContext } from 'react'
import MainMenu from '../main-menu/MainMenu'

const MenuWrapper = () => {
  const webSocketActions = useContext(webSocketContext)
  const { player_id } = usePlayerData()
  const { onGameStart } = useAppState()
  const handleClickPlay = () => {
    onGameStart()
    player_id && webSocketActions?.sendStartGame(player_id)
  }

  return (
    <Html position={[0, 28, -4]} rotation={[0, Math.PI, 0]} occlude='raycast' transform>
      <QueryClientProvider client={queryClient}>
        <LoadingLayout>
          <MainMenu handleClickPlay={handleClickPlay} />
        </LoadingLayout>
      </QueryClientProvider>
    </Html>
  )
}

export default MenuWrapper
