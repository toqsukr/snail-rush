import { useSession } from '@entities/session'
import Button from '@shared/uikit/button/Button'
import { FC } from 'react'
import { useJoinLobby } from '../../model/use-join-lobby'

const JoinLobbyButton: FC<{ username: string }> = ({ username }) => {
  const joinLobby = useJoinLobby()
  const session = useSession(s => s.session)

  return (
    <Button onClick={() => joinLobby(username)} disabled={!username.length || !!session}>
      JOIN
    </Button>
  )
}

export default JoinLobbyButton
