import { usePlayers } from '@entities/players'
import { useMenuDeps } from '../deps'
import { useMenu } from './store'

export const usePlay = () => {
  const { onPlay } = useMenuDeps()
  const playGame = useMenu(s => s.playGame)
  const players = usePlayers(s => s.players)

  const playAction = () => {
    playGame()
    onPlay()
  }

  const disabled = players.length < 2

  return { playAction, disabled }
}
