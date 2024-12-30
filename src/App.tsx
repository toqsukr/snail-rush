import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function Model() {
  const { scene, animations } = useGLTF('models/snail/snail-shrink.glb')
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const modelRef = useRef<THREE.Object3D>(null) // Отслеживание модели
  const jumpDuration = 1.6 // Длительность прыжка (в секундах)
  const startTime = useRef(0) // Время начала прыжка

  useEffect(() => {
    if (!scene || !animations.length) return

    mixer.current = new THREE.AnimationMixer(scene)
    return () => {
      mixer.current?.stopAllAction()
    }
  }, [scene, animations])

  const triggerJump = () => {
    if (!mixer.current || animations.length === 0) return

    const jumpAction = mixer.current.clipAction(animations[0])
    if (!jumpAction.isRunning()) {
      jumpAction.reset().play()
      startTime.current = performance.now()

      setTimeout(() => {
        if (modelRef.current) modelRef.current.position.z += 3
        jumpAction.stop()
      }, jumpDuration * 1000)
    }
  }

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta)
  })

  return <primitive object={scene} ref={modelRef} onClick={triggerJump} />
}

function Floor() {
  const { scene } = useGLTF('models/dirt/dirt.glb')
  const modelRef = useRef<THREE.Object3D>(null) // Отслеживание модели

  return <primitive object={scene} ref={modelRef} />
}

const App = () => {
  return (
    <Canvas>
      <PerspectiveCamera
        makeDefault
        position={[10, 15, 20]}
        rotation={[-Math.PI / 4, Math.PI / 7, Math.PI / 7]}
      />
      <directionalLight position={[-2, 5, 2]} intensity={2} />
      <directionalLight position={[2, 5, 2]} intensity={3} />
      <Model />
      <Floor />
    </Canvas>
  )
}

export default App
