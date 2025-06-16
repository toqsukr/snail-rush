import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const useBackToLobby = () => {
  const backToLobby = useMenu(s => s.backToLobby)
  const { onBackToLobby } = useLobbyMenuDeps()

  return () => {
    backToLobby()
    onBackToLobby()
  }
}
