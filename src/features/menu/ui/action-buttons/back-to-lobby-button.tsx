import Button from '@shared/uikit/button/Button'
import { useBackToLobby } from '../../model/use-back-to-lobby'

const BackToLobbyButton = () => {
  const backToLobby = useBackToLobby()

  return <Button onClick={backToLobby}>BACK TO LOBBY</Button>
}

export default BackToLobbyButton
