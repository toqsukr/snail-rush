import Button from '@shared/uikit/button/Button'
import { FC } from 'react'
import { useJoinLobby } from '../../model/use-join-lobby'

const JoinLobbyButton: FC<{ username: string }> = ({ username }) => {
  const joinLobby = useJoinLobby()

  return (
    <Button onClick={() => joinLobby(username)} disabled={!username.length}>
      JOIN
    </Button>
  )
}

export default JoinLobbyButton
