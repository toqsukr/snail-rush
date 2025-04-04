import { useMenu } from './store'

export const useBack = () => {
  const backToMainMenu = useMenu(s => s.backToMainMenu)

  return () => {
    backToMainMenu()
  }
}
