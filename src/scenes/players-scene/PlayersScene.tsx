import Opponent from '@modules/gameplay/opponent/Opponent'
import Player from '@modules/gameplay/player/Player'
import { useLobby } from '@modules/lobby/store'
import { usePlayerData } from '@modules/player/store'
import { Suspense } from 'react'

const PlayersScene = () => {
  const { status } = useLobby()
  const { player_id } = usePlayerData()

  if (!status || !player_id) return

  return (
    <Suspense fallback={null}>
      <Player mode={status} playerID={player_id} />
      <Opponent mode={status === 'host' ? 'joined' : 'host'} />
    </Suspense>
  )
}

export default PlayersScene
