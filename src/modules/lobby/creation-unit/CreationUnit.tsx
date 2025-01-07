import { usePlayerData } from '@modules/player/store'
import { useSession } from '@modules/session/store'
import { FC } from 'react'
import { useLobby } from '../store'

const CreationUnit: FC<{ handleStart: () => void }> = ({ handleStart }) => {
  const { username } = usePlayerData()
  const { session } = useSession()
  const { onClickBack } = useLobby()

  return (
    <>
      <h1>Let connect your friend by code: {session?.session_id}</h1>
      <button disabled={!username} onClick={onClickBack}>
        BACK
      </button>
    </>
  )
}

export default CreationUnit
