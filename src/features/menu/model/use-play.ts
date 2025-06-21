import { useSession } from '@entities/session'
import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const usePlay = () => {
  const { onPlay } = useLobbyMenuDeps()
  const playGame = useMenu(s => s.playGame)
  const { data: session } = useSession()

  const playAction = () => {
    playGame()
    onPlay()
  }

  const disabled = (session?.players.length ?? 0) < 2

  return { playAction, disabled }
}
