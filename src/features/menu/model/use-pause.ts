import { useMenuDeps } from '../deps'
import { useMenu } from './store'

export const usePause = () => {
  const pauseGame = useMenu(s => s.pauseGame)
  const { onPause } = useMenuDeps()

  return () => {
    pauseGame()
    onPause()
  }
}
