import { useMenu } from './store'

export const useJoinLobby = () => {
  const joinLobby = useMenu(s => s.joinLobby)

  return async () => {
    joinLobby()
  }
}
