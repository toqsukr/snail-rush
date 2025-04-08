import { CuboidCollider, RigidBody, RigidBodyProps } from '@react-three/rapier'
import { FC, PropsWithChildren } from 'react'
import { useFinishControl } from '../deps'

export const FinishControl: FC<PropsWithChildren<RigidBodyProps>> = ({ children, ...props }) => {
  const { onFinish } = useFinishControl()
  return (
    <RigidBody
      {...props}
      colliders={false}
      type='fixed'
      onCollisionEnter={({ rigidBody }) => onFinish(rigidBody?.userData)}>
      <CuboidCollider args={[1, 0.01, 10]} position={[-6, -0.1, 0]} />
      {children}
    </RigidBody>
  )
}
