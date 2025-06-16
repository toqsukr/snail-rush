import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const usePause = () => {
  const pauseGame = useMenu(s => s.pauseGame)
  const { onPause } = useLobbyMenuDeps()

  return () => {
    pauseGame()
    onPause()
  }
}
