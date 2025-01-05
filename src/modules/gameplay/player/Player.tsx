import { forwardRef, useImperativeHandle, useRef } from 'react'
import { DirectionalLight, Object3D, Object3DEventMap } from 'three'
import SnailJump from '../snail-jump/SnailJump'

const Player = forwardRef<Object3D<Object3DEventMap>>((_, ref) => {
  const modelRef = useRef<Object3D>(null)

  useImperativeHandle(ref, () => modelRef.current as Object3D)

  const lightRef = useRef<DirectionalLight>(null)

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[0, 1, -1]}
        intensity={6}
        lookAt={() => modelRef?.current?.position}
      />
      <SnailJump ref={modelRef} />
    </>
  )
})

export default Player
