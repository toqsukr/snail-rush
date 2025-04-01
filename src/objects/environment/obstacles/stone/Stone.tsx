import { useGLTF } from '@react-three/drei'
import { RigidBody, RigidBodyProps } from '@react-three/rapier'
import { FC, useMemo, useRef } from 'react'
import { Object3D } from 'three'

const Stone: FC<RigidBodyProps> = props => {
  const { scene } = useGLTF('models/stone/stone.glb')
  const modelRef = useRef<Object3D>(null)

  const clonedScene = useMemo(() => scene.clone(), [scene])

  // const randomRotationY = useMemo(() => Math.random() * Math.PI * 2, [])

  return (
    <RigidBody {...props} userData={{ isObstacle: true }} type='fixed' colliders='cuboid'>
      <primitive object={clonedScene} ref={modelRef} />
    </RigidBody>
  )
}

export default Stone
