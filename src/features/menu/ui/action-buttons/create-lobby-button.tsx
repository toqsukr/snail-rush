import Button from '@shared/uikit/button/Button'
import { FC } from 'react'
import { useCreateLobby } from '../../model/use-create-lobby'

const CreateLobbyButton: FC<{ username: string }> = ({ username }) => {
  const createLobby = useCreateLobby()

  return (
    <Button onClick={() => createLobby(username)} disabled={!username.length}>
      CREATE LOBBY
    </Button>
  )
}

export default CreateLobbyButton
