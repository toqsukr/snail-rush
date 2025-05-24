import { Text, useAnimations, useGLTF, useTexture } from '@react-three/drei'
import { useFrame, useGraph, useThree } from '@react-three/fiber'
import {
  CuboidCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
  RoundCuboidCollider,
} from '@react-three/rapier'
import React, { FC, useEffect, useMemo, useRef } from 'react'
import { MeshPhysicalMaterial } from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { useSnailDeps } from '../deps'
import { useAnimation } from '../model/use-animation'
import { useCollision } from '../model/use-collision'
import { useJump } from '../model/use-jump'
import { useShrink } from '../model/use-shrink'
import { useSnailContext } from './snail-provider'

const textures = [
  '/textures/snail-metal.png',
  '/textures/snail-normal.png',
  '/textures/snail-roughness.png',
]

export const Snail: FC<{ username: string; userID?: string }> = ({ username, userID }) => {
  const { texturePath, shrinkDuration, stunTimeout } = useSnailDeps()
  const { scene, animations } = useGLTF('/models/snail.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { ref, actions } = useAnimations(animations)

  const [metalTexture, normalTexture, roughnessTexture, mapTexture] = useTexture([
    ...textures,
    texturePath,
  ])

  const rigidBodyRef = useRef<RapierRigidBody | null>(null)
  const { animate, stopAnimation, isAnimationRunning } = useAnimation(actions)
  const { updateStartShrinkAnimation, updateStopShrinkAnimation } = useSnailContext()

  const getRigidBody = () => rigidBodyRef.current

  useJump(
    getRigidBody,
    () => isAnimationRunning('BakedAnimation'),
    (duration: number) => animate('BakedAnimation', { duration })
  )

  const { startShrinkAnimation, stopShrinkAnimation } = useShrink(
    () => isAnimationRunning('shrink-animation'),
    () =>
      animate('shrink-animation', {
        pauseOnEnd: true,
        loop: false,
        duration: shrinkDuration / 1000,
      }),
    () => stopAnimation('shrink-animation')
  )

  const handleCollision = useCollision(getRigidBody, () =>
    animate('stun-animation', { duration: stunTimeout / 1000 })
  )

  const { camera } = useThree()
  const textRef = useRef<any>(null)

  useEffect(() => {
    updateStartShrinkAnimation(startShrinkAnimation)
    updateStopShrinkAnimation(stopShrinkAnimation)
  }, [])

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })

  const userData = useMemo(() => ({ userID }), [])

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
      mass={10}
      type='dynamic'
      colliders={false}
      ref={rigidBodyRef}
      userData={userData}
      friction={1.5}
      linearDamping={1.2}
      collisionGroups={interactionGroups(0b10, 0b01)}
      onCollisionEnter={handleCollision}
      enabledRotations={[false, false, false]}
      restitution={1}>
      <RoundCuboidCollider
        name='neck'
        args={[0.05, 0.05, 0.5, 0.2]}
        position={[0, 0.85, 0.7]}
        rotation={[-Math.PI / 2.5, 0, 0]}
      />
      <CuboidCollider name='leg' args={[0.27, 0.2, 0.8]} position={[0, 0.22, -0.2]} />
      <RoundCuboidCollider name='shell' args={[0.08, 0.15, 0.15, 0.5]} position={[0, 0.85, -0.4]} />
      <Text ref={textRef} fontSize={0.8} fontWeight={800} fillOpacity={0.8} position={[0, 4, 0]}>
        {username}
      </Text>
      <group ref={ref as any} dispose={null}>
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
