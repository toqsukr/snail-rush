import { LobbyEventsProvider } from '@features/lobby-events'
import { useUpdateLobbyPlayers } from '@features/menu'
import { isObstacle } from '@features/obstacle'
import { pushOpponentPosition, pushOpponentRotation } from '@features/opponent-control'
import { snailDepsContext, SnailOrientationProvider } from '@features/snail'
import { OrbitControls } from '@react-three/drei'
import { useGameStore } from './model/store'
import GameMapWithDeps from './ui/game-map-with-deps'
import MenuWithDeps from './ui/menu-with-deps'
import OpponentSnail from './ui/opponent-snail'
import PlayerSnail from './ui/player-snail'

export const PLAYER_START_POSITION = [0, 0, 0] satisfies [number, number, number]

const STUN_TIMEOUT = 1500

const HomePage = () => {
  const { startGame, updateMoveable } = useGameStore()
  const updatePlayers = useUpdateLobbyPlayers()

  return (
    <LobbyEventsProvider
      onGameStart={startGame}
      onChangeLobbyPlayers={updatePlayers}
      onChangeOpponentPosition={({ position: { hold_time, ...rest } }) =>
        pushOpponentPosition({ ...rest, holdTime: hold_time })
      }
      onChangeOpponentRotation={({ rotation }) => pushOpponentRotation(rotation)}>
      <ambientLight position={[5, 1, 0]} intensity={1} />

      {/* <PerspectiveCamera makeDefault position={[0, 35, -21]} rotation={[-Math.PI, 0, -Math.PI]} /> */}
      <OrbitControls />

      <MenuWithDeps />

      <GameMapWithDeps />

      <snailDepsContext.Provider
        value={{
          modelPath: '/animations/full-jump-static-light.glb',
          shouldHandleCollision: isObstacle,
          startPosition: PLAYER_START_POSITION,
          onCollision: () => {
            updateMoveable(false)
            setTimeout(() => updateMoveable(true), STUN_TIMEOUT)
          },
        }}>
        <SnailOrientationProvider>
          <PlayerSnail />
        </SnailOrientationProvider>
      </snailDepsContext.Provider>

      <SnailOrientationProvider>
        <OpponentSnail />
      </SnailOrientationProvider>
    </LobbyEventsProvider>
  )
}

export default HomePage
