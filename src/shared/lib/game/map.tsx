import { FC, lazy, Suspense, useMemo, useState } from 'react'
import { interactionGroups, RigidBody } from '@react-three/rapier'
import { Euler, EulerTuple, Vector3, Vector3Tuple } from 'three'
import { useGLTF } from '@react-three/drei'
import { ChopperObstacle, ColliderBox, StaticObstacle } from './obstacle'
import { FinishControl } from './finish'
import { StartModel } from './start'
import { ModelPrimitive } from './primitive'
import { modelInstance } from './model-instance'

const MapTransform = lazy(() => import('./map-transform'))

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
  decorationModelPath?: string
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

const STONE_COLLIDER: ColliderBox = {
  args: [1.25, 1.42, 1.64],
  position: [-0.02, 1.42, -0.02],
  rotation: [0, -0.44, 0],
}
const SMALL_STONE_COLLIDER: ColliderBox = {
  args: [0.65, 0.57, 0.72],
  position: [-0.03, 0.57, 0.01],
  rotation: [0, -1.2, 0],
}

export type EditMode = 'rotate' | 'translate'

export type ChangeSelectedOptions = {
  name: string
  mode: EditMode
  rotation: EulerTuple
  position: Vector3Tuple
}

type GameMapProp = {
  mapData: MapData
  isStarted: boolean
  startedAt?: number
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

const MapDecoration: FC<{ modelPath: string }> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath)
  const decoration = useMemo(() => modelInstance(scene), [scene])

  return (
    <group>
      <primitive object={decoration} />
    </group>
  )
}

export const MapModelConstruct = ({
  planeModelPath,
  wallsModelPath,
  decorationModelPath,
}: {
  planeModelPath: string
  wallsModelPath: string
  decorationModelPath?: string
}) => {
  const mapPlane = useGLTF(planeModelPath)
  const mapWalls = useGLTF(wallsModelPath)

  return (
    <>
      {decorationModelPath && <MapDecoration modelPath={decorationModelPath} />}
      <RigidBody colliders='cuboid' collisionGroups={interactionGroups(0b01, 0b10)} type='fixed'>
        <primitive object={mapPlane.scene} />
      </RigidBody>
      <RigidBody
        type='fixed'
        colliders='trimesh'
        collisionGroups={interactionGroups(0b01, 0b10)}
        userData={{ isObstacle: true }}>
        <primitive object={mapWalls.scene} />
      </RigidBody>
    </>
  )
}

export const GameMap: FC<GameMapProp> = ({ mapData, onFinish, isStarted, startedAt, ...props }) => {
  const { stone, smallStone, bigStone, chopper } = mapData.obstacle
  const { planeModelPath, wallsModelPath, decorationModelPath } = mapData
  const [editMode, setEditMode] = useState<EditMode>('translate')
  const [openedAt] = useState(() => Date.now())

  return (
    <>
      <MapModelConstruct
        planeModelPath={planeModelPath}
        wallsModelPath={wallsModelPath}
        decorationModelPath={decorationModelPath}
      />
      <StartModel {...mapData.startLine} />
      <FinishControl {...mapData.finishLine} onFinish={onFinish} />
      {props.editable && props.selectedName && (
        <Suspense fallback={null}>
          <MapTransform
            mode={editMode}
            selectedName={props.selectedName}
            onChangeSelected={props.onChangeSelected}
          />
        </Suspense>
      )}
      {stone?.items.map(({ name, position, rotation }) => (
        <StaticObstacle
          key={name}
          collider={STONE_COLLIDER}
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
          collider={SMALL_STONE_COLLIDER}
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
      {chopper?.items.map(({ extremePositions, speed }) => (
        <ChopperObstacle
          speed={speed}
          startedAt={isStarted ? startedAt || openedAt : undefined}
          key={`chopper-${extremePositions.join()}`}
          model={
            <ModelPrimitive
              name={`chopper-${extremePositions.join()}`}
              modelPath={chopper.modelPath}
            />
          }
          extremePositions={[
            new Vector3(...extremePositions[0]),
            new Vector3(...extremePositions[1]),
          ]}
        />
      ))}
    </>
  )
}
