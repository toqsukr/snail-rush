import { useMenuDeps } from '../deps'
import { useMenu } from './store'

export const useContinue = () => {
  const resumeGame = useMenu(s => s.resumeGame)
  const { onContinue } = useMenuDeps()

  return () => {
    resumeGame()
    onContinue()
  }
}
