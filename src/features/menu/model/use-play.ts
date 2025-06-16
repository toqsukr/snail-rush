import { usePlayers } from '@entities/players'
import { useLobbyMenuDeps } from '../deps'
import { useMenu } from './store'

export const usePlay = () => {
  const { onPlay } = useLobbyMenuDeps()
  const playGame = useMenu(s => s.playGame)
  const players = usePlayers(s => s.players)

  const playAction = () => {
    playGame()
    onPlay()
  }

  const disabled = players.length < 2

  return { playAction, disabled }
}
