import { MenuMode, useMenu } from './store'

export const useMenuMode = () => {
  const updateMenuMode = useMenu(s => s.updateMenuMode)
  return (value: MenuMode) => {
    updateMenuMode(value)
  }
}
