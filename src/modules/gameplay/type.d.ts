import { Vector3 } from 'three'

export type AppState = {
  started: boolean
  onGameStart: () => void
  onGameOver: () => void
  onWin: () => void
}

export type OpponentStreamType = {
  position: Vector3
  rotationY: number
  holdTime: number
  duration: number
}
