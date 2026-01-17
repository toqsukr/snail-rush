import { Euler, EulerTuple, Group, Mesh, Quaternion, Vector3, Vector3Tuple } from 'three'
import { FC, useState } from 'react'
import { TransformControls, TransformControlsProps, useCursor, useGLTF } from '@react-three/drei'
import { interactionGroups, RigidBody } from '@react-three/rapier'
import { StaticObstacle } from './obstacle'
import { FinishControl } from './finish'
import { StartModel } from './start'
import { ModelPrimitive } from './primitive'
import { useThree } from '@react-three/fiber'

export type MapObject = {
  name: string
  position: Vector3Tuple
  rotation: EulerTuple
}
type Chopper = {
  extremePositions: [start: Vector3Tuple, finish: Vector3Tuple]
  speed: number
}

export type MapData = {
  startLine: MapObject
  finishLine: MapObject
  planeModelPath: string
  wallsModelPath: string
  obstacle: {
    chopper?: {
      items: Chopper[]
      modelPath: string
    }
    stone?: {
      items: MapObject[]
      modelPath: string
    }
    smallStone?: {
      items: MapObject[]
      modelPath: string
    }
    bigStone?: {
      items: MapObject[]
      modelPath: string
    }
  }
}

type EditMode = 'rotate' | 'translate'

export type ChangeSelectedOptions = {
  name: string
  mode: EditMode
  rotation: EulerTuple
  position: Vector3Tuple
}

type GameMapProp = {
  mapData: MapData
  isStarted: boolean
  onFinish: (userData: unknown) => Promise<void>
} & (
  | {
      editable: true
      selectedName: string | null
      updateSelectedName: (selectedName: string | null) => void
      onChangeSelected: (options: ChangeSelectedOptions) => void
    }
  | {
      editable?: false
    }
)

export const MapModelConstruct = ({
  planeModelPath,
  wallsModelPath,
}: {
  planeModelPath: string
  wallsModelPath: string
}) => {
  const mapPlane = useGLTF(planeModelPath)
  const mapWalls = useGLTF(wallsModelPath)

  return (
    <>
      <RigidBody
        colliders='cuboid'
        collisionGroups={interactionGroups(0b01, 0b10)}
        type='fixed'
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}>
        <primitive object={mapPlane.scene} />
      </RigidBody>
      <RigidBody
        type='fixed'
        colliders='trimesh'
        collisionGroups={interactionGroups(0b01, 0b10)}
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
        userData={{ isObstacle: true }}>
        <primitive object={mapWalls.scene} />
      </RigidBody>
    </>
  )
}

export const GameMap: FC<GameMapProp> = ({ mapData, onFinish, ...props }) => {
  const { stone, smallStone, bigStone } = mapData.obstacle
  const { planeModelPath, wallsModelPath } = mapData
  const { scene } = useThree()
  const [editMode, setEditMode] = useState<EditMode>('translate')

  return (
    <>
      <MapModelConstruct planeModelPath={planeModelPath} wallsModelPath={wallsModelPath} />
      <StartModel {...mapData.startLine} />
      <FinishControl {...mapData.finishLine} onFinish={onFinish} />
      {props.editable && props.selectedName && (
        <TransformControls
          mode={editMode}
          object={scene.getObjectByName(props.selectedName)}
          onObjectChange={e => {
            const obj = (e?.target as TransformControlsProps).object as Group
            const worldPosition = new Vector3()
            const worldQuaternion = new Quaternion()
            const worldScale = new Vector3()

            obj.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale)

            // Конвертируем кватернион в углы Эйлера (радианы)
            const euler = new Euler().setFromQuaternion(worldQuaternion)

            props.onChangeSelected({
              name: obj.name,
              position: worldPosition
                .toArray()
                .map(value => parseFloat(value.toFixed(2))) as Vector3Tuple,
              rotation: [euler.x, euler.y, euler.z].map(value =>
                parseFloat(value.toFixed(2))
              ) as EulerTuple,
              mode: editMode,
            })
          }}
        />
      )}
      {stone?.items.map(({ name, position, rotation }) => (
        <StaticObstacle
          key={name}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
          model={
            <ModelPrimitive
              name={name}
              onDoubleClick={() =>
                setEditMode(prev => (prev === 'rotate' ? 'translate' : 'rotate'))
              }
              onClick={props.editable ? () => props.updateSelectedName(name) : undefined}
              modelPath={stone.modelPath}
            />
          }
        />
      ))}
      {smallStone?.items.map(({ name, position, rotation }) => (
        <StaticObstacle
          key={name}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
          model={
            <ModelPrimitive
              name={name}
              onDoubleClick={() =>
                setEditMode(prev => (prev === 'rotate' ? 'translate' : 'rotate'))
              }
              onClick={props.editable ? () => props.updateSelectedName(name) : undefined}
              modelPath={smallStone.modelPath}
            />
          }
        />
      ))}
      {bigStone?.items.map(({ name, position, rotation }) => (
        <StaticObstacle
          key={name}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
          model={
            <ModelPrimitive
              name={name}
              onDoubleClick={() =>
                setEditMode(prev => (prev === 'rotate' ? 'translate' : 'rotate'))
              }
              onClick={props.editable ? () => props.updateSelectedName(name) : undefined}
              modelPath={bigStone.modelPath}
            />
          }
        />
      ))}
      {/* {isStarted &&
        chopper?.items.map(({ extremePositions, speed }) => (
          <ChopperObstacle
            speed={speed}
            key={`chopper-${extremePositions.join()}`}
            model={<ModelPrimitive name={`chopper-${extremePositions.join()}`} scale={3} modelPath={chopper.modelPath} />}
            extremePositions={[
              new Vector3(...extremePositions[0]),
              new Vector3(...extremePositions[1]),
            ]}
          />
        ))} */}
    </>
  )
}
