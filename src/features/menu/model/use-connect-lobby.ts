import { useSessionCode } from '@entities/session'
import { useUser } from '@entities/user'
import { useConnectSession } from '../api/connect-session'
import { useMainMenuDeps } from '../deps'
import { useMenu } from './store'

export const useConnectLobby = () => {
  const updateSession = useSessionCode(s => s.updateSession)
  const { data: user } = useUser()
  const connectSession = useConnectSession()
  const connectLobby = useMenu(s => s.connectLobby)
  const { onConnectLobby } = useMainMenuDeps()

  return async (sessionID: string) => {
    if (!user?.id) return

    const session = await connectSession.mutateAsync({ sessionID, playerID: user.id })
    connectLobby()
    onConnectLobby(user.id, session.session_id)
    updateSession(session.session_id)
  }
}
