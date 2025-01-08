import {
  MAX_ANIMATION_DURATION,
  MAX_JUMP_LENGTH,
  MIN_ANIMATION_DURATION,
  MIN_JUMP_LENGTH,
} from './constant'

export const calcTargetPosition = (position: number[], koef: number) => {
  const delta = Math.max(MIN_JUMP_LENGTH, koef * MAX_JUMP_LENGTH)
  return [position[0], position[1], position[2] + delta]
}

export const calcIntermediatePosition = (start: number[], end: number[]) => {
  const deltaZ = end[2] - start[2]
  return [end[0], end[1] + 1.5, end[2] - deltaZ / 2]
}

export const calcAnimationDuration = (duration: number, koef: number) => {
  return Math.min(Math.max(MIN_ANIMATION_DURATION, koef * duration), MAX_ANIMATION_DURATION)
}
