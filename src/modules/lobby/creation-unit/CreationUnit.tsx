import { usePlayerData } from '@modules/player/store'
import { useDeleteSession } from '@modules/session/model/hooks/useDeleteSession'
import { useSession } from '@modules/session/store'
import { FC } from 'react'
import LobbyUnit from '../lobby-unit/LobbyUnit'
import { useLobby } from '../store'

const CreationUnit: FC<{ handleStart: () => void }> = ({ handleStart }) => {
  const { username } = usePlayerData()
  const { session } = useSession()
  const { onClickBack } = useLobby()
  const { deleteSession } = useDeleteSession()

  if (!session) return

  const handleBack = () => {
    deleteSession(session.session_id)
    onClickBack()
  }

  return (
    <>
      <h1>Let your friend connect by code: {session?.session_id}</h1>
      <LobbyUnit />
      <button disabled={session.count_players - 2 < 0} onClick={handleStart}>
        PLAY
      </button>
      <button disabled={!username} onClick={handleBack}>
        DELETE LOBBY
      </button>
      <button onClick={onClickBack}>BACK</button>
    </>
  )
}

export default CreationUnit
