import { usePlayers } from '@entities/players'
import { TUser } from '@entities/user'
import { countdownDepsContext, CountdownRenderLayout } from '@features/countdown'
import type {
  MessageType,
  OpponentPositionType,
  OpponentRotationType,
} from '@features/lobby-events'
import { LobbyEventsProvider } from '@features/lobby-events'
import { useAppendLog, useClearLogs } from '@features/logflow'
import { pushOpponentPosition, pushOpponentRotation } from '@features/opponent-control'
import {
  TrackCameraProvider,
  TrackingCamera,
  trackingCameraDepsContext,
  useTrackCameraContext,
} from '@features/tracking-camera'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
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

const cameraStartPosition = [16.1, 35, 5]
const cameraStartRotation = [0, 0, 0]

const HomeContent = () => {
  const gameStore = useGameStore()
  const appendLog = useAppendLog()
  const clearLogs = useClearLogs()
  const { players, updatePlayers } = usePlayers()

  const { followTarget } = useTrackCameraContext()

  const playerStartPosition = getStartPosition(getPlayerPosition(gameStore.playerStatus ?? 'host'))

  const onFinishGame = async ({ actor_id }: MessageType) => {
    gameStore.updateMoveable(false)
    await followTarget(FINISH_POSITION)
    gameStore.finishGame()
    const winner = players.find(({ id }) => id === actor_id)
    winner && gameStore.updateWinner(winner)
  }

  const onGameStart = async (startTimer: () => void) => {
    gameStore.startGame()
    await followTarget(new Vector3(...playerStartPosition))
    startTimer()
  }

  const onPlayerConnected = (updatedPlayers: TUser[]) => {
    const connected = updatedPlayers.find(({ id }) => players.every(player => id !== player.id))
    if (connected) {
      updatePlayers(updatedPlayers)
      appendLog(`Player ${connected.username} was connected!`)
    }
  }

  const onPlayerKicked = (updatedPlayers: TUser[]) => {
    const kicked = players.find(({ id }) => updatedPlayers.every(player => id !== player.id))
    if (kicked) {
      updatePlayers(updatedPlayers)
      appendLog(`Player ${kicked.username} was kicked!`)
    }
  }

  const onGameStop = async () => {
    // resetTimer()
    // toMainMenu()
    // await moveTo([
    //   MAIN_MENU_POSITION[0],
    //   MAIN_MENU_POSITION[1],
    //   MAIN_MENU_POSITION[2] + 10,
    // ])
    // const tempStatus = playerStatus
    // updatePlayerStatus(null)
    // await focusTo(new Vector3(...MAIN_MENU_POSITION))
    // updatePlayerStatus(tempStatus)
  }

  const onStartJump = () => {}

  const onKickMe = () => {
    gameStore.updatePlayerStatus(null)
    clearLogs()
  }

  const onChangeOpponentRotation = ({ rotation }: OpponentRotationType) => {
    pushOpponentRotation(rotation)
  }
  const onChangeOpponentPosition = ({ position: { hold_time, ...rest } }: OpponentPositionType) => {
    pushOpponentPosition({ ...rest, holdTime: hold_time })
  }

  const countdownDepsValue = {
    onAlarm: gameStore.allowMoving,
    startValue: START_TIMER_VALUE,
    playerPosition: playerStartPosition,
  }

  return (
    <countdownDepsContext.Provider value={countdownDepsValue}>
      <CountdownRenderLayout
        renderChildren={(startTimer, resetTimer) => (
          <LobbyEventsProvider
            onKickMe={onKickMe}
            onGameStop={onGameStop}
            onStartJump={onStartJump}
            onGameFinish={onFinishGame}
            onPlayerKicked={onPlayerKicked}
            onPlayerConnected={onPlayerConnected}
            onGameStart={() => onGameStart(startTimer)}
            onChangeOpponentRotation={onChangeOpponentRotation}
            onChangeOpponentPosition={onChangeOpponentPosition}>
            <TrackingCamera />
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

const HomePage = () => {
  const cameraDepsValue = {
    initPosition: cameraStartPosition,
    initRotation: cameraStartRotation,
  }

  return (
    <Canvas>
      {/* <OrbitControls/> */}
      <Perf position='top-left' />
      <Physics gravity={[0, -20, 0]} timeStep={1 / 60}>
        <trackingCameraDepsContext.Provider value={cameraDepsValue}>
          <TrackCameraProvider>
            <HomeContent />
          </TrackCameraProvider>
        </trackingCameraDepsContext.Provider>
      </Physics>
    </Canvas>
  )
}

export default HomePage
