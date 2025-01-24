import { RigidBody } from '@react-three/rapier'
import { mainSceneContext } from '@scenes/main-scene/MainScene'
import { FC, useContext } from 'react'
import { Vector3 } from 'three'
import { PlayerProp } from './Player.type'
import { usePlayer } from './usePlayer'

const Player: FC<PlayerProp> = ({ playerID, mode }) => {
  const mainSceneActions = useContext(mainSceneContext)

  const onJump = (position: Vector3) => {
    mainSceneActions?.updateCameraPosition(position)
  }

  const { rigidBodyRef, model } = usePlayer(mode, playerID, onJump)

  return (
    <RigidBody
      ref={rigidBodyRef}
      type='dynamic'
      enabledRotations={[false, false, false]}
      linearDamping={1.5}
      friction={0.5}
      colliders='cuboid'>
      <primitive object={model.scene} />
    </RigidBody>
  )
}

export default Player
