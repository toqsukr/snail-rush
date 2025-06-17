import { useGLTF, useTexture } from '@react-three/drei'
import { useGraph } from '@react-three/fiber'
import {
  CuboidCollider,
  interactionGroups,
  RigidBody,
  RigidBodyProps,
  RoundCuboidCollider,
} from '@react-three/rapier'
import React, { FC } from 'react'
import { MeshPhysicalMaterial } from 'three'
import { SkeletonUtils } from 'three-stdlib'

const textures = [
  '/textures/snail-metal.png',
  '/textures/snail-normal.png',
  '/textures/snail-roughness.png',
]

type StaticSnailProps = { texturePath: string } & RigidBodyProps

export const StaticSnail: FC<StaticSnailProps> = ({ texturePath, ...props }) => {
  const { scene } = useGLTF('/models/snail.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])

  const [metalTexture, normalTexture, roughnessTexture, mapTexture] = useTexture([
    ...textures,
    texturePath,
  ])

  const { nodes } = useGraph(clone)
  const meshProps = nodes['snail_mesh'] as any

  mapTexture.flipY = false
  mapTexture.colorSpace = 'srgb'

  const material = new MeshPhysicalMaterial({
    ...meshProps.material,
    map: mapTexture,
    metalnessMap: metalTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    color: 0xaaaaaa,
    metalness: 0.1,
    roughness: 0.1,
  })

  return (
    <RigidBody
      {...props}
      mass={10}
      type='dynamic'
      colliders={false}
      collisionGroups={interactionGroups(0b01, 0b10)}
      enabledRotations={[false, false, false]}>
      <RoundCuboidCollider
        name='neck'
        args={[0.05, 0.05, 0.5, 0.2]}
        position={[0, 0.85, 0.7]}
        rotation={[-Math.PI / 2.5, 0, 0]}
      />
      <CuboidCollider name='leg' args={[0.27, 0.2, 0.8]} position={[0, 0.22, -0.2]} />
      <RoundCuboidCollider name='shell' args={[0.08, 0.15, 0.15, 0.5]} position={[0, 0.85, -0.4]} />
      <group dispose={null}>
        <group name='Scene'>
          <group name='snail' position={[0, 0.2, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={nodes['tail-bone']} />
            <primitive object={nodes['tip-tail-bone']} />
            <primitive object={nodes['tail-shell-bone']} />
          </group>
          <skinnedMesh
            name='snail_mesh'
            material={material}
            geometry={meshProps.geometry}
            skeleton={meshProps.skeleton}
            morphTargetDictionary={meshProps.morphTargetDictionary}
            morphTargetInfluences={meshProps.morphTargetInfluences}
            position={[0, 0.2, 0.11]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      </group>
    </RigidBody>
  )
}

useGLTF.preload('/models/snail.glb')
useTexture.preload(textures[0])
useTexture.preload(textures[1])
useTexture.preload(textures[2])
