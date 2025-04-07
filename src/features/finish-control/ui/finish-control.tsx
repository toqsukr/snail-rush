import { RigidBody, RigidBodyProps } from '@react-three/rapier'
import { FC, PropsWithChildren } from 'react'
import { useFinishControl } from '../deps'

export const FinishControl: FC<PropsWithChildren<RigidBodyProps>> = ({ children, ...props }) => {
  const { onFinish } = useFinishControl()
  return (
    <RigidBody
      {...props}
      type='fixed'
      colliders='hull'
      onCollisionEnter={({ rigidBody }) => onFinish(rigidBody?.userData)}>
      {children}
    </RigidBody>
  )
}
