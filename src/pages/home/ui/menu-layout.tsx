import { useIsHost } from '@features/auth/use-is-host'
import { useLobbyEventsContext } from '@features/lobby-events'
import { menuDepsContext } from '@features/menu'
import { useTrackCameraContext } from '@features/tracking-camera'
import { FC, PropsWithChildren } from 'react'
import { Vector3 } from 'three'
import { getPlayerPosition, getStartPosition } from '../lib/status'
import { useGameStore } from '../model/store'

export type MenuWithDepsProp = {
  startTimer: () => void
  resetTimer: () => void
  mainMenuPosition: [number, number, number]
}

const MenuLayout: FC<PropsWithChildren<MenuWithDepsProp>> = ({
  children,
  startTimer,
  resetTimer,
  mainMenuPosition,
}) => {
  const checkHost = useIsHost()
  const { sendStartGame } = useLobbyEventsContext()
  const { startGame, pauseGame, resumeGame, updatePlayerStatus, playerStatus, toMainMenu } =
    useGameStore()

  const { followTarget, focusTo, moveTo } = useTrackCameraContext()

  const playerStartPosition = getStartPosition(getPlayerPosition(playerStatus ?? 'host'))

  return (
    <menuDepsContext.Provider
      value={{
        isHost: checkHost,
        onPause: pauseGame,
        onContinue: resumeGame,
        onBackToLobby: async () => {
          resetTimer()
          toMainMenu()
          await moveTo([mainMenuPosition[0], mainMenuPosition[1], mainMenuPosition[2] + 10])
          focusTo(new Vector3(...mainMenuPosition))
        },
        onConnectLobby: () => updatePlayerStatus('joined'),
        onDisconnectLobby: () => updatePlayerStatus(null),
        onCreateLobby: () => {
          updatePlayerStatus('host')
        },
        onDeleteLobby: () => {
          updatePlayerStatus(null)
        },
        onPlay: async () => {
          sendStartGame()
          startGame()
          await followTarget(new Vector3(...playerStartPosition))
          startTimer()
        },
      }}>
      {children}
    </menuDepsContext.Provider>
  )
}

export default MenuLayout
