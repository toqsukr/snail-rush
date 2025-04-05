import { useMenuDeps } from '../deps'
import { useMenu } from './store'

export const useBackToLobby = () => {
  const backToLobby = useMenu(s => s.backToLobby)
  const { onBackToLobby } = useMenuDeps()

  return () => {
    backToLobby()
    onBackToLobby()
  }
}
