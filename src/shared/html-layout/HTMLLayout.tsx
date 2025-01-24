import { queryClient } from '@modules/app/api'
import WebSocketProvider from '@modules/app/websocket-provider/WebSocketProvider'
import { Html } from '@react-three/drei'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'

const HTMLLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Html
      portal={{ current: document.body }}
      position={[0, 28, -4]}
      rotation={[0, Math.PI, 0]}
      occlude='raycast'
      transform>
      <WebSocketProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WebSocketProvider>
    </Html>
  )
}

export default HTMLLayout
