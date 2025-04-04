import { usePlayers } from '@entities/players'
import { LobbyEventsProvider } from '@features/lobby-events'
import { pushOpponentPosition, pushOpponentRotation } from '@features/opponent-control'
import { OrbitControls } from '@react-three/drei'
import { useGameStore } from './model/store'
import CountdownWithDeps from './ui/countdown-with-deps'
import GameMapWithDeps from './ui/game-map-with-deps'
import MenuWithDeps from './ui/menu-with-deps'
import OpponentSuspense from './ui/opponent-snail'
import PlayerSuspense from './ui/player-snail'

const HomePage = () => {
  const { startGame, updatePlayerStatus } = useGameStore()
  const updatePlayers = usePlayers(s => s.updatePlayers)

  return (
    <LobbyEventsProvider
      onGameStart={() => {
        startGame()
        // startTimer()
      }}
      onKickMe={() => updatePlayerStatus(null)}
      onChangeLobbyPlayers={updatePlayers}
      onChangeOpponentRotation={({ rotation }) => {
        console.log('opponent recieved rotate log')
        pushOpponentRotation(rotation)
      }}
      onChangeOpponentPosition={({ position: { hold_time, ...rest } }) =>
        pushOpponentPosition({ ...rest, holdTime: hold_time })
      }>
      <ambientLight position={[5, 1, 0]} intensity={1} />
      <OrbitControls makeDefault />
      <MenuWithDeps />
      <GameMapWithDeps />
      <CountdownWithDeps />
      <OpponentSuspense />
      <PlayerSuspense />
    </LobbyEventsProvider>
  )
}

export default HomePage
