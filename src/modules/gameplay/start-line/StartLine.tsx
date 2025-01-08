import { useGLTF } from '@react-three/drei'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Object3D, Object3DEventMap } from 'three'

const StartLine = forwardRef<Object3D<Object3DEventMap>>((_, ref) => {
  const { scene } = useGLTF('models/start-line/start-line.glb')
  const modelRef = useRef<Object3D>(null)
  useImperativeHandle(ref, () => modelRef.current as Object3D)

  return (
    <primitive
      object={scene}
      position={[3, 0.1, 4]}
      rotation={[0, Math.PI / 2, 0]}
      ref={modelRef}
    />
  )
})

export default StartLine
