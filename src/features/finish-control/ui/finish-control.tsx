import { CuboidCollider, RigidBody, RigidBodyProps } from '@react-three/rapier'
import { FC, PropsWithChildren, useRef } from 'react'
import { useFinishControl } from '../deps'

export const FinishControl: FC<PropsWithChildren<RigidBodyProps>> = ({ children, ...props }) => {
  const timerRef = useRef<NodeJS.Timeout>()
  const { onFinish } = useFinishControl()
  return (
    <RigidBody
      {...props}
      colliders={false}
      type='fixed'
      sensor
      onIntersectionEnter={({ rigidBody }) => {
        if (!timerRef.current) {
          onFinish(rigidBody?.userData)
          timerRef.current = setTimeout(() => {
            timerRef.current = undefined
          }, 1000)
        }
      }}>
      <CuboidCollider args={[1, 0.01, 10]} position={[-6, 0, 0]} sensor />
      {children}
    </RigidBody>
  )
}
