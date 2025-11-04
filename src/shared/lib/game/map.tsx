import { Euler, Vector3 } from 'three'
import { FC } from 'react'
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { StaticObstacle, Stone } from './obstacle'
import { FinishControl } from './finish'
import { StartModel } from './start'

type MapObject = { position: [number, number, number]; rotation: [number, number, number] }

export type MapData = {
  startLine: MapObject
  finishLine: MapObject
  planeModelPath: string
  wallsModelPath: string
  obstacle: {
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
      <RigidBody colliders='cuboid' type='fixed' position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <primitive object={mapPlane.scene} />
      </RigidBody>
      <RigidBody
        type='fixed'
        colliders='trimesh'
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
  onFinish: (userData: unknown) => Promise<void>
}> = ({ mapData, onFinish }) => {
  const { stone, smallStone, bigStone } = mapData.obstacle
  const { planeModelPath, wallsModelPath } = mapData

  return (
    <>
      <MapModelConstruct planeModelPath={planeModelPath} wallsModelPath={wallsModelPath} />
      <StartModel {...mapData.startLine} />
      <FinishControl {...mapData.finishLine} onFinish={onFinish} />
      {stone?.items.map(({ position, rotation }) => (
        <StaticObstacle
          key={`stone-${position.join()}`}
          model={<Stone modelPath={stone.modelPath} />}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
        />
      ))}
      {smallStone?.items.map(({ position, rotation }) => (
        <StaticObstacle
          key={`small-stone-${position.join()}`}
          model={<Stone modelPath={smallStone.modelPath} />}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
        />
      ))}
      {bigStone?.items.map(({ position, rotation }) => (
        <StaticObstacle
          key={`big-stone-${position.join()}`}
          model={<Stone modelPath={bigStone.modelPath} />}
          rotation={new Euler(...rotation)}
          position={new Vector3(...position)}
        />
      ))}
    </>
  )
}
