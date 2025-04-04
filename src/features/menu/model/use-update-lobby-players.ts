import { usePlayers } from '@entities/players'
import { TUser } from '@entities/user'

export const useUpdateLobbyPlayers = () => {
  const updatePlayers = usePlayers(s => s.updatePlayers)

  return (players: TUser[]) => updatePlayers(players)
}
