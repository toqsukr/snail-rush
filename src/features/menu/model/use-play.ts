import { useSession } from '@entities/session'
import { useMenuDeps } from '../deps'
import { useMenu } from './store'

export const usePlay = () => {
  const playGame = useMenu(s => s.playGame)
  const { onPlay } = useMenuDeps()
  const session = useSession(s => s.session)

  const playAction = () => {
    playGame()
    onPlay()
  }

  const disabled = !!session && session.players.length < 2

  return { playAction, disabled }
}
