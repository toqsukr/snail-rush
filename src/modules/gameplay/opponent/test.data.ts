import { useEffect } from 'react'
import { Vector3 } from 'three'
import { MAX_ANIMATION_DURATION } from '../constant'
import { appendOpponentData } from '../model/append-opponent-data'
import { useAppState } from '../store'
import { OpponentStreamType } from '../type.d'

export const testPositions: OpponentStreamType[] = [
  {
    holdTime: 1000,
    duration: MAX_ANIMATION_DURATION,
    position: new Vector3(0, 0, 7),
    rotationY: 0,
  },
  {
    holdTime: 1000,
    duration: MAX_ANIMATION_DURATION,
    position: new Vector3(0, 0, 14),
    rotationY: 0,
  },
  {
    holdTime: 1000,
    duration: MAX_ANIMATION_DURATION,
    position: new Vector3(0, 0, 21),
    rotationY: 0,
  },
  {
    holdTime: 1000,
    duration: MAX_ANIMATION_DURATION,
    position: new Vector3(0, 0, 28),
    rotationY: 0,
  },
  {
    holdTime: 1000,
    duration: MAX_ANIMATION_DURATION,
    position: new Vector3(0, 0, 35),
    rotationY: 0,
  },
  {
    holdTime: 1000,
    duration: MAX_ANIMATION_DURATION,
    position: new Vector3(0, 0, 42),
    rotationY: 0,
  },
  {
    holdTime: 1000,
    duration: MAX_ANIMATION_DURATION,
    position: new Vector3(0, 0, 49),
    rotationY: 0,
  },
]

export const useGetPosition = () => {
  const { started } = useAppState()
  useEffect(() => {
    let index = 0
    if (started) {
      const interval = setInterval(() => {
        index < testPositions.length - 1 && appendOpponentData(testPositions[index])
        index++
      }, 100)

      return () => clearInterval(interval)
    }
  }, [started])
}
