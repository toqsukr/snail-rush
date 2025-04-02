import { useMenu } from './store'
import { useCreateUser, useIsUserCreating } from './use-create-user'

export const useJoinLobby = () => {
  const connectLobby = useMenu(s => s.connectLobby)
  const createUser = useCreateUser()

  return async (username: string) => {
    connectLobby()
    createUser(username)
  }
}

export const useIsLobbyJoining = () => {
  const isUserCreating = useIsUserCreating()
  return isUserCreating
}
