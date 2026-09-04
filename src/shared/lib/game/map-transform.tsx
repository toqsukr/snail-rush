import { TransformControls, TransformControlsProps } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Euler, EulerTuple, Group, Quaternion, Vector3, Vector3Tuple } from 'three'
import { FC } from 'react'

import { ChangeSelectedOptions, EditMode } from './map'

/**
 * Gizmo that drags and spins a picked map object inside the editor.
 */
const MapTransform: FC<{
  mode: EditMode
  selectedName: string
  onChangeSelected: (options: ChangeSelectedOptions) => void
}> = ({ mode, selectedName, onChangeSelected }) => {
  const { scene } = useThree()

  return (
    <TransformControls
      mode={mode}
      object={scene.getObjectByName(selectedName)}
      onObjectChange={e => {
        const obj = (e?.target as TransformControlsProps).object as Group
        const worldPosition = new Vector3()
        const worldQuaternion = new Quaternion()
        const worldScale = new Vector3()
        obj.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale)
        const euler = new Euler().setFromQuaternion(worldQuaternion)
        onChangeSelected({
          name: obj.name,
          position: worldPosition
            .toArray()
            .map(value => parseFloat(value.toFixed(2))) as Vector3Tuple,
          rotation: [euler.x, euler.y, euler.z].map(value =>
            parseFloat(value.toFixed(2)),
          ) as EulerTuple,
          mode,
        })
      }}
    />
  )
}

export default MapTransform
