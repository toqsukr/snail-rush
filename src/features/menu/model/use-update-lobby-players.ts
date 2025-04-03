import { TUser } from '@entities/user'
import { useLobbyPlayersStore } from './store'

export const useUpdateLobbyPlayers = () => {
  const updatePlayers = useLobbyPlayersStore(s => s.updatePlayers)

  return (players: TUser[]) => updatePlayers(players)
}
