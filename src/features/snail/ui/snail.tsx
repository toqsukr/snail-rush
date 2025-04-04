import { Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { useSnailDeps } from '../deps'
import { useCollision } from '../model/use-collision'
import { useJump } from '../model/use-jump'

export const Snail = () => {
  const { rigidBodyRef, model } = useJump()
  const handleCollision = useCollision()
  const { username } = useSnailDeps()
  const { camera } = useThree()

  const textRef = useRef<any>(null)

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      type='dynamic'
      enabledRotations={[false, false, false]}
      linearDamping={1.5}
      friction={0.5}
      onCollisionEnter={handleCollision}
      colliders='cuboid'>
      <Text ref={textRef} fontSize={0.8} fontWeight={800} fillOpacity={0.8} position={[0, 4, 0]}>
        {username}
      </Text>
      <primitive object={model.scene} />
    </RigidBody>
  )
}
