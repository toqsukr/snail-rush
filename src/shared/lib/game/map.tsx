import { Euler, Vector3 } from 'three'
import { FC } from 'react'
import { useGLTF } from '@react-three/drei'
import { interactionGroups, RigidBody } from '@react-three/rapier'
import { ChopperObstacle, StaticObstacle } from './obstacle'
import { FinishControl } from './finish'
import { StartModel } from './start'
import { ModelPrimitive } from './primitive'

type MapObject = { position: [number, number, number]; rotation: [number, number, number] }
type Chopper = {
  extremePositions: [start: [number, number, number], finish: [number, number, number]]
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

export const GameMap: FC<{
  mapData: MapData
  isStarted: boolean
  onFinish: (userData: unknown) => Promise<void>
}> = ({ mapData, isStarted, onFinish }) => {
  const { stone, smallStone, bigStone, chopper } = mapData.obstacle
  const { planeModelPath, wallsModelPath } = mapData

  return (
    <>
      <MapModelConstruct planeModelPath={planeModelPath} wallsModelPath={wallsModelPath} />
      <StartModel {...mapData.startLine} />
      <FinishControl {...mapData.finishLine} onFinish={onFinish} />
      {stone?.items.map(({ position, rotation }) => (
        <StaticObstacle
          key={`stone-${position.join()}`}
          model={<ModelPrimitive modelPath={stone.modelPath} />}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
        />
      ))}
      {smallStone?.items.map(({ position, rotation }) => (
        <StaticObstacle
          key={`small-stone-${position.join()}`}
          model={<ModelPrimitive modelPath={smallStone.modelPath} />}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
        />
      ))}
      {bigStone?.items.map(({ position, rotation }) => (
        <StaticObstacle
          key={`big-stone-${position.join()}`}
          model={<ModelPrimitive modelPath={bigStone.modelPath} />}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
        />
      ))}
      {/* {isStarted &&
        chopper?.items.map(({ extremePositions, speed }) => (
          <ChopperObstacle
            speed={speed}
            key={`chopper-${extremePositions.join()}`}
            model={<ModelPrimitive scale={3} modelPath={chopper.modelPath} />}
            extremePositions={[
              new Vector3(...extremePositions[0]),
              new Vector3(...extremePositions[1]),
            ]}
          />
        ))} */}
    </>
  )
}
