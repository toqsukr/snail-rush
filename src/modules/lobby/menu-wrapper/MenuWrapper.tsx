import { queryClient } from '@modules/app/api'
import { webSocketContext } from '@modules/app/websocket-provider/WebsocketProvider'
import { Html } from '@react-three/drei'
import LoadingLayout from '@shared/loading-layout/LoadingLayout'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, useContext } from 'react'
import Menu from '../menu/Menu'
import css from './MenuWrapper.module.scss'

const MenuWrapper: FC<{ handleStart: () => void }> = ({ handleStart }) => {
  const webSocketActions = useContext(webSocketContext)
  const handleClickPlay = () => {
    handleStart()
    webSocketActions?.sendStartGame()
  }

  return (
    <Html position={[0, 28, -4]} rotation={[0, Math.PI, 0]} occlude='raycast' transform>
      <QueryClientProvider client={queryClient}>
        <div className={css.menu}>
          <LoadingLayout>
            <Menu handleClickPlay={handleClickPlay} />
          </LoadingLayout>
        </div>
      </QueryClientProvider>
    </Html>
  )
}

export default MenuWrapper
