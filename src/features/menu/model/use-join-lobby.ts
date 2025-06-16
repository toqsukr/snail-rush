import { useMenu } from './store'
import { useCreateUser } from './use-create-user'

export const useJoinLobby = () => {
  const joinLobby = useMenu(s => s.joinLobby)
  const createUser = useCreateUser()

  return async (username: string) => {
    joinLobby()
    createUser(username)
  }
}
