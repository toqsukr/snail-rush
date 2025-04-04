import Button from '@shared/uikit/button/Button'
import { useDeleteLobby } from '../../model/use-delete-lobby'

const DeleteLobbyButton = () => {
  const deleteLobby = useDeleteLobby()

  return <Button onClick={deleteLobby}>DELETE LOBBY</Button>
}

export default DeleteLobbyButton
