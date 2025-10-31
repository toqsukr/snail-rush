import { RapierRigidBody } from '@react-three/rapier'
import { useEffect } from 'react'
import { Quaternion, Vector3 } from 'three'
import { useSnailContext } from '@features/snail/ui/snail-provider'
import { useSnailDeps } from '@features/snail/deps'
import { PositionType, RotationType } from './types'

export const useJump = (
  getRigidBody: () => RapierRigidBody | null,
  animateJump: (duration: number) => void
) => {
  const { position, rotation, updatePosition, updateRotation } = useSnailContext()
  const { positionEmitter, rotationEmitter } = useSnailDeps()

  const triggerRotate = (rotation: RotationType) => {
    const { rotation: targetRotation } = rotation
    const rigidBody = getRigidBody()
    if (rigidBody) {
      const quaternion = new Quaternion().setFromEuler(targetRotation)
      rigidBody.setRotation(quaternion, true)
    }
    updateRotation(targetRotation)
  }

  const triggerJump = (position: PositionType) => {
    console.log(position)
    const { duration, impulse } = position
    animateJump(duration)
    const rigidBody = getRigidBody()

    if (rigidBody) {
      rigidBody.applyImpulse(impulse, true)
    }

    updatePosition(impulse)
  }

  useEffect(() => {
    const rigidBody = getRigidBody()
    if (rigidBody) {
      rigidBody.setTranslation(new Vector3(...position), true)
      const quaternion = new Quaternion().setFromEuler(rotation)
      rigidBody.setRotation(quaternion, true)
    }
  }, [])

  useEffect(() => {
    const unsubscribePosition = positionEmitter.subscribe(position => {
      triggerJump(position)
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
