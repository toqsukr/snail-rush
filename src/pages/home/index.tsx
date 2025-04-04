import { usePlayers } from '@entities/players'
import { countdownDepsContext, CountdownRenderLayout } from '@features/countdown'
import { LobbyEventsProvider } from '@features/lobby-events'
import { pushOpponentPosition, pushOpponentRotation } from '@features/opponent-control'
import { TrackingCamera, useTrackCameraContext } from '@features/tracking-camera'
import { Vector3 } from 'three'
import { getPlayerPosition, getStartPosition } from './lib/status'
import { useGameStore } from './model/store'
import CountdownWithDeps from './ui/countdown-with-deps'
import GameMapWithDeps from './ui/game-map-with-deps'
import MenuWithDeps from './ui/menu-with-deps'
import OpponentSuspense from './ui/opponent-snail'
import PlayerSuspense from './ui/player-snail'

const START_TIMER_VALUE = 3

const HomePage = () => {
  const { startGame, updatePlayerStatus, allowMoving, playerStatus } = useGameStore()
  const updatePlayers = usePlayers(s => s.updatePlayers)

  const { followTarget } = useTrackCameraContext()

  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus ?? 'host'))

  return (
    <countdownDepsContext.Provider
      value={{
        onAlarm: allowMoving,
        startValue: START_TIMER_VALUE,
        playerPosition: playerStartPosition,
      }}>
      <CountdownRenderLayout
        renderChildren={startTimer => (
          <LobbyEventsProvider
            onChangeLobbyPlayers={updatePlayers}
            onKickMe={() => updatePlayerStatus(null)}
            onGameStart={async () => {
              startGame()
              await followTarget(new Vector3(...playerStartPosition))
              startTimer()
            }}
            onChangeOpponentRotation={({ rotation }) => {
              pushOpponentRotation(rotation)
            }}
            onChangeOpponentPosition={({ position: { hold_time, ...rest } }) => {
              pushOpponentPosition({ ...rest, holdTime: hold_time })
            }}>
            <TrackingCamera />
            <PlayerSuspense />
            <GameMapWithDeps />
            <OpponentSuspense />
            <CountdownWithDeps />
            <MenuWithDeps startTimer={startTimer} />
            <ambientLight position={[5, 1, 0]} intensity={1} />
          </LobbyEventsProvider>
        )}
      />
    </countdownDepsContext.Provider>
  )
}

export default HomePage
