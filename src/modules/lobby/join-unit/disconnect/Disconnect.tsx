import LobbyUnit from '@modules/lobby/lobby-unit/LobbyUnit'
import Menu from '@shared/menu/Menu'
import { FC } from 'react'
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
