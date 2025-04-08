import { Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, RigidBody, RoundCuboidCollider } from '@react-three/rapier'
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
      mass={10}
      colliders={false}
      ref={rigidBodyRef}
      userData={userData}
      linearDamping={1.2}
      onCollisionEnter={handleCollision}
      enabledRotations={[false, false, false]}>
      <RoundCuboidCollider
        name='neck'
        args={[0.05, 0.05, 0.5, 0.2]}
        position={[0, 0.85, 0.7]}
        rotation={[-Math.PI / 2.5, 0, 0]}
      />
      <CuboidCollider name='leg' args={[0.27, 0.2, 0.8]} position={[0, 0.22, -0.2]} />
      <RoundCuboidCollider name='shell' args={[0.08, 0.15, 0.15, 0.5]} position={[0, 0.85, -0.4]} />
      <Text ref={textRef} fontSize={0.8} fontWeight={800} fillOpacity={0.8} position={[0, 4, 0]}>
        {username}
      </Text>
      <primitive object={model.scene} />
    </RigidBody>
  )
}
