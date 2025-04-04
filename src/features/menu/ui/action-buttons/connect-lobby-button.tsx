import Button from '@shared/uikit/button/Button'
import React, { FC } from 'react'
import { useConnectLobby } from '../../model/use-connect-lobby'

type ConnectLobbyButtonProp = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  lobbyCode: string
}

const ConnectLobbyButton: FC<ConnectLobbyButtonProp> = ({ lobbyCode, disabled }) => {
  const connectLobby = useConnectLobby()

  return (
    <Button disabled={disabled} onClick={() => connectLobby(lobbyCode)}>
      CONNECT
    </Button>
  )
}

export default ConnectLobbyButton
