import { CollisionEnterPayload, RigidBody } from '@react-three/rapier'
import { mainSceneContext } from '@scenes/main-scene/MainScene'
import { FC, useContext } from 'react'
import { Vector3 } from 'three'
import { STUN_TIMEOUT } from '../constant'
import { useAppState } from '../store'
import { PlayerProp } from './Player.type'
import { usePlayer } from './usePlayer'

const Player: FC<PlayerProp> = ({ playerID, mode }) => {
  const mainSceneActions = useContext(mainSceneContext)

  const { setMoveable } = useAppState()

  const onJump = (position: Vector3) => {
    mainSceneActions?.updateCameraPosition(position)
  }

  const { rigidBodyRef, model } = usePlayer(mode, playerID, onJump)

  const handleCollision = (event: CollisionEnterPayload) => {
    const { other } = event
    const targetUserData = other.rigidBody?.userData
    if (
      targetUserData &&
      typeof targetUserData === 'object' &&
      'isObstacle' in targetUserData &&
      targetUserData?.isObstacle
    ) {
      console.log('Столкновение с препятствием!')
      setMoveable(false)
      setTimeout(() => setMoveable(true), STUN_TIMEOUT)
    }
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      type='dynamic'
      enabledRotations={[false, false, false]}
      linearDamping={1.5}
      friction={0.5}
      onCollisionEnter={handleCollision}
      colliders='cuboid'>
      <primitive object={model.scene} />
    </RigidBody>
  )
}

export default Player
