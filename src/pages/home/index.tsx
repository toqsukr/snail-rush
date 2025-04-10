import { usePlayers } from '@entities/players'
import { countdownDepsContext, CountdownRenderLayout } from '@features/countdown'
import { LobbyEventsProvider } from '@features/lobby-events'
import { pushOpponentPosition, pushOpponentRotation } from '@features/opponent-control'
import { TrackingCamera, useTrackCameraContext } from '@features/tracking-camera'
import { Vector3 } from 'three'
import { getPlayerPosition, getStartPosition } from './lib/status'
import { FINISH_POSITION, LIGHT_POSITION, START_TIMER_VALUE } from './model/constants'
import { useGameStore } from './model/store'
import CountdownWithDeps from './ui/countdown-with-deps'
import GameMap from './ui/game-map'
import GameOver from './ui/game-over'
import MainMenu from './ui/main-menu'
import MenuLayout from './ui/menu-layout'
import OpponentSuspense from './ui/opponent-snail'
import PauseMenu from './ui/pause-menu-with-deps'
import PlayerSuspense from './ui/player-snail'

const HomePage = () => {
  const {
    startGame,
    updatePlayerStatus,
    allowMoving,
    updateMoveable,
    playerStatus,
    finishGame,
    updateWinner,
  } = useGameStore()
  const { players, updatePlayers } = usePlayers()

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
        renderChildren={(startTimer, resetTimer) => (
          <LobbyEventsProvider
            onChangeLobbyPlayers={updatePlayers}
            onKickMe={() => updatePlayerStatus(null)}
            onGameStart={async () => {
              startGame()
              await followTarget(new Vector3(...playerStartPosition))
              startTimer()
            }}
            onGameFinish={async ({ actor_id }) => {
              updateMoveable(false)
              await followTarget(FINISH_POSITION)
              finishGame()
              const winner = players.find(({ id }) => id === actor_id)
              winner && updateWinner(winner)
            }}
            onChangeOpponentRotation={({ rotation }) => {
              pushOpponentRotation(rotation)
            }}
            onChangeOpponentPosition={({ position: { hold_time, ...rest } }) => {
              pushOpponentPosition({ ...rest, holdTime: hold_time })
            }}>
            <TrackingCamera />
            {/* <OrbitControls/> */}
            <PlayerSuspense />
            <OpponentSuspense />
            <GameMap />
            <CountdownWithDeps />
            <MenuLayout startTimer={startTimer} resetTimer={resetTimer}>
              <MainMenu />
              <PauseMenu />
              <GameOver />
            </MenuLayout>
            <ambientLight position={LIGHT_POSITION} intensity={1} />
          </LobbyEventsProvider>
        )}
      />
    </countdownDepsContext.Provider>
  )
}

export default HomePage
