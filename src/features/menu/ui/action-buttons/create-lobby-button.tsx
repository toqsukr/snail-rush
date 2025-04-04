import { useSession } from '@entities/session'
import Button from '@shared/uikit/button/Button'
import { FC } from 'react'
import { useCreateLobby } from '../../model/use-create-lobby'

const CreateLobbyButton: FC<{ username: string }> = ({ username }) => {
  const createLobby = useCreateLobby()
  const session = useSession(s => s.session)

  return (
    <Button onClick={() => createLobby(username)} disabled={!username.length}>
      {session ? 'LOBBY' : 'CREATE LOBBY'}
    </Button>
  )
}

export default CreateLobbyButton
