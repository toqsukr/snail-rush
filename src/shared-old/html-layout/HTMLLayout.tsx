import { queryClient } from '@modules/app/api'
import WebSocketProvider from '@modules/app/websocket-provider/WebSocketProvider'
import { Html } from '@react-three/drei'
import { HtmlProps } from '@react-three/drei/web/Html'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'

const HTMLLayout: FC<PropsWithChildren<HtmlProps>> = ({ children, ...props }) => {
  return (
    <Html {...props} portal={{ current: document.body }} occlude='raycast' transform>
      <WebSocketProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WebSocketProvider>
    </Html>
  )
}

export default HTMLLayout
