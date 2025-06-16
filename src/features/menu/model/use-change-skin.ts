import { useMenu } from './store'

export const useChangeSkin = () => {
  const { toSkins } = useMenu()

  return () => {
    toSkins()
  }
}
