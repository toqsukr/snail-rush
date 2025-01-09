import { forwardRef } from 'react'
import { Object3D, Object3DEventMap, Vector3 } from 'three'
import JumpAnimation from '../jump-animation/PositionAnimation'
import { PlayerProp } from './Player.type'
import { usePlayer } from './usePlayer'

const Player = forwardRef<Object3D<Object3DEventMap>, PlayerProp>(
  ({ updateCameraPosition, playerID, mode }, ref) => {
    const onJump = (position: Vector3) => {
      updateCameraPosition(position)
    }

    const { model, position, rotation } = usePlayer(mode, playerID, onJump)

    return (
      <JumpAnimation
        ref={ref}
        position={position as any}
        rotation={rotation as any}
        object={model.scene}
      />
    )
  }
)

export default Player
