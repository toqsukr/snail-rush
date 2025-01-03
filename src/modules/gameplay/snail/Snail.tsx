import { forwardRef, useImperativeHandle } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import { useSnail } from './useSnail'

const Snail = forwardRef<Object3D<Object3DEventMap>, { modelPath: string }>(
  ({ modelPath }, ref) => {
    const { model, modelRef } = useSnail(modelPath)

    useImperativeHandle(ref, () => modelRef.current as Object3D)

    return <primitive ref={modelRef} object={model.scene} position={[8, 0, 0]} />
  }
)

export default Snail
