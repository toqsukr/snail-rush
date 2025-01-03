import { forwardRef, useImperativeHandle } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import { useSnailJump } from './useSnailJump'

const SnailJump = forwardRef<Object3D<Object3DEventMap>>((_, ref) => {
  const { modelRef, model, triggerJump } = useSnailJump()

  useImperativeHandle(ref, () => modelRef.current as Object3D)

  return <primitive ref={modelRef} object={model.scene} onClick={triggerJump} />
})

export default SnailJump
