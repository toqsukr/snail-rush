import LobbyUnit from '@modules/lobby/lobby-unit/LobbyUnit'
import { FC } from 'react'
import Menu from 'src/shared-old/menu/Menu'
import { DisconnectType } from './Disconnect.type'

const Disconnect: FC<DisconnectType> = ({ handleDisconnect }) => {
  return (
    <>
      <LobbyUnit />
      <Menu.Button onClick={handleDisconnect}>DISCONNECT</Menu.Button>
    </>
  )
}

export default Disconnect
