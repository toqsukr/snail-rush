import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const useContinue = () => {
  const resumeGame = useMenu(s => s.resumeGame)
  const { onContinue } = useLobbyMenuDeps()

  return () => {
    resumeGame()
    onContinue()
  }
}
