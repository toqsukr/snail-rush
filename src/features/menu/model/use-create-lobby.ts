import { invalidateSession, useSession, useSessionCode } from '@entities/session'
import { useUser } from '@entities/user'
import { useCreateSession } from '../api/create-session'
import { useMainMenuDeps } from '../deps'
import { useMenu } from './store'

export const useCreateLobby = () => {
  const createSession = useCreateSession()
  const connectLobby = useMenu(s => s.connectLobby)
  const { data: user } = useUser()
  const { data: session } = useSession()
  const updateSession = useSessionCode(s => s.updateSession)
  const { onCreateLobby } = useMainMenuDeps()

  return async () => {
    if (!user) return

    if (session) {
      connectLobby()
    } else {
      const createdSession = await createSession.mutateAsync(user.id)
      connectLobby()

      invalidateSession()
      onCreateLobby(user.id, createdSession.session_id)
      updateSession(createdSession.session_id)
    }
  }
}
