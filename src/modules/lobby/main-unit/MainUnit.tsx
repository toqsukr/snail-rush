import { MutationKeys } from '@modules/app/type.d'
import { useCreatePlayer } from '@modules/player/model/hooks/useCreatePlayer'
import { usePlayerData } from '@modules/player/store'
import { useCreateSession } from '@modules/session/model/hooks/useCreateSession'
import { useSession } from '@modules/session/store'
import { useIsMutating } from '@tanstack/react-query'
import { useLobby } from '../store'

const MainUnit = () => {
  const { username, id, setPlayerData } = usePlayerData()
  const { onCreateLobby, onJoinLobby } = useLobby()
  const { session, setSession } = useSession()
  const { createSession } = useCreateSession()
  const { createPlayer } = useCreatePlayer()

  const handleCreation = async () => {
    let playerID = id
    if (!id) {
      const playerData = await createPlayer({ username })
      setPlayerData(playerData)
      playerID = playerData.id
    }
    if (!session) {
      const sessionData = await createSession(playerID ?? '')
      setSession(sessionData)
    }
    onCreateLobby()
  }

  const handleJoin = async () => {
    onJoinLobby()
    if (!id) {
      const playerData = await createPlayer({ username })
      setPlayerData(playerData)
    }
  }

  const isPlayerCreating = useIsMutating({ mutationKey: [MutationKeys.CREATE_PLAYER] })
  const isSessionCreating = useIsMutating({ mutationKey: [MutationKeys.CREATE_SESSION] })

  if (!!isPlayerCreating || !!isSessionCreating) return <div>Loading...</div>

  return (
    <>
      <button disabled={!username} onClick={handleCreation}>
        CREATE LOBBY
      </button>
      <button disabled={!username} onClick={handleJoin}>
        JOIN
      </button>
    </>
  )
}

export default MainUnit
