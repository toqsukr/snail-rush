import Button from '@shared/uikit/button/Button'
import { useDisconnectLobby } from '../../model/use-disconnect-lobby'

const DisconnectButton = () => {
  const disconnectYourself = useDisconnectLobby()

  return <Button onClick={disconnectYourself}>DISCONNECT</Button>
}

export default DisconnectButton
