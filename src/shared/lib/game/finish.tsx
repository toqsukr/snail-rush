import { PrimitiveProps } from '@react-three/fiber'
import { CuboidCollider, RapierRigidBody, RigidBody, RigidBodyProps } from '@react-three/rapier'
import { FC, useRef } from 'react'
import { ModelPrimitive } from './primitive'

type FinishControlProp = {
  onFinish: (userData: unknown) => void
} & RigidBodyProps

const FINISH_MODEL_PATH = 'models/compressed_finish-line.glb'

export const FinishControl: FC<FinishControlProp> = ({ onFinish, ...props }) => {
  const timerRef = useRef<NodeJS.Timeout>()

  const handleIntersectionEnter = (rigidBody?: RapierRigidBody) => {
    if (!timerRef.current) {
      onFinish(rigidBody?.userData)
      timerRef.current = setTimeout(() => {
        timerRef.current = undefined
      }, 1000)
    }
  }

  return (
    <RigidBody
      {...props}
      sensor
      type='fixed'
      colliders={false}
      onIntersectionEnter={({ rigidBody }) => handleIntersectionEnter(rigidBody)}>
      <CuboidCollider args={[1, 0.01, 10]} position={[-6, 0, 0]} sensor />
      <FinishModel />
    </RigidBody>
  )
}

const FinishModel: FC<Omit<PrimitiveProps, 'object'>> = props => {
  return <ModelPrimitive {...props} modelPath={FINISH_MODEL_PATH} />
}
