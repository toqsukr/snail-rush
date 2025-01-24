import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import LightLayout from '../LightLayout'

const GrassMap = () => {
  const { scene } = useGLTF('models/map1/map1.glb')

  return (
    <LightLayout>
      <RigidBody colliders='cuboid' type='fixed' position={[18, 0, -6]} rotation={[0, Math.PI, 0]}>
        <primitive object={scene} />
      </RigidBody>
    </LightLayout>
  )
}

export default GrassMap
