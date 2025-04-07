import { Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { FC, useMemo, useRef } from 'react'
import { useCollision } from '../model/use-collision'
import { useJump } from '../model/use-jump'

export const Snail: FC<{ username: string; userID?: string }> = ({ username, userID }) => {
  const { rigidBodyRef, model } = useJump()
  const handleCollision = useCollision()
  const { camera } = useThree()

  const textRef = useRef<any>(null)

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })

  const userData = useMemo(() => ({ userID }), [])

  return (
    <RigidBody
      type='dynamic'
      friction={0.5}
      colliders='cuboid'
      ref={rigidBodyRef}
      userData={userData}
      linearDamping={1.5}
      onCollisionEnter={handleCollision}
      enabledRotations={[false, false, false]}>
      <Text ref={textRef} fontSize={0.8} fontWeight={800} fillOpacity={0.8} position={[0, 4, 0]}>
        {username}
      </Text>
      <primitive object={model.scene} />
    </RigidBody>
  )
}
