import { RefObject, useEffect } from 'react'
import { Quaternion, Vector3 } from 'three'
import { RapierRigidBody } from '@react-three/rapier'
import { useSnailContext } from '@features/snail/ui/snail-provider'
import { useSnailDeps } from '@features/snail/deps'
import { PositionWithoutCorrectType, RotationType } from './types'

export const useJump = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  animateJump: (duration: number) => void
) => {
  const { getPosition, rotation, updatePosition, updateRotation } = useSnailContext()
  const { positionEmitter, rotationEmitter } = useSnailDeps()

  const triggerRotate = (rotation: RotationType) => {
    const { rotation: targetRotation } = rotation
    if (rigidBodyRef.current) {
      const quaternion = new Quaternion().setFromEuler(targetRotation)
      rigidBodyRef.current.setRotation(quaternion, true)
    }
    updateRotation(targetRotation)
  }

  const triggerJump = (position: PositionWithoutCorrectType) => {
    const { duration, impulse } = position
    animateJump(duration)

    if (rigidBodyRef.current) {
      rigidBodyRef.current.applyImpulse(impulse, true)
      const { x, y, z } = rigidBodyRef.current.translation()
      updatePosition(new Vector3(x, y, z))
    }
  }

  useEffect(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation(new Vector3(...getPosition()), true)
      const quaternion = new Quaternion().setFromEuler(rotation)
      rigidBodyRef.current.setRotation(quaternion, true)
    }
  }, [])

  const getRigidBody = () => rigidBodyRef.current

  useEffect(() => {
    const unsubscribePosition = positionEmitter.subscribe(position => {
      const { duration, holdTime, impulse, ...rest } = position
      if (rest.correctStartPosition) {
        getRigidBody()?.setTranslation(rest.startPosition, true)
      }
      triggerJump({ duration, holdTime, impulse })
    })

    const unsubscribeRotation = rotationEmitter.subscribe(rotation => {
      triggerRotate(rotation)
    })

    return () => {
      unsubscribePosition?.()
      unsubscribeRotation?.()
    }
  }, [])
}
