import { FC } from 'react'
import Input from 'src/shared-old/input/Input'
import Menu from 'src/shared-old/menu/Menu'
import { ConnectType } from './Connect.type'

const Connect: FC<ConnectType> = ({ connectDisabled, handleConnect, handleBack, inputProps }) => {
  return (
    <>
      <Input {...inputProps} placeholder='Lobby code' />
      <Menu.Button disabled={connectDisabled} onClick={handleConnect}>
        CONNECT
      </Menu.Button>
      <Menu.Button onClick={handleBack}>BACK</Menu.Button>
    </>
  )
}

export default Connect
