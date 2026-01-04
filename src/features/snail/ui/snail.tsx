import { Text, useAnimations, useGLTF, useTexture } from '@react-three/drei'
import { useFrame, useGraph, useThree } from '@react-three/fiber'
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  RoundCuboidCollider,
} from '@react-three/rapier'
import React, { FC, RefObject, useEffect, useMemo, useRef } from 'react'
import { BufferGeometry, Group, MeshPhysicalMaterial, Object3DEventMap, Skeleton } from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { useSnailDeps } from '../deps'
import { useAnimation } from '../model/use-animation'
import { useCollision } from '../model/use-collision'
import { useJump } from '../model/use-jump'
import { useSnailContext } from './snail-provider'
import { DreiTextProps } from '@shared/lib/three'

const STUN_ANIMATION_NAME = 'stun-animation'
const JUMP_ANIMATION_NAME = 'BakedAnimation'
const SHRINK_ANIMATION_NAME = 'shrink-animation'

export const textures = [
  '/textures/snail-metal.png',
  '/textures/snail-normal.png',
  '/textures/snail-roughness.png',
]

export const Snail: FC<{ username?: string; userID?: string }> = ({ username, userID }) => {
  const { texturePath, shrinkDuration, stunTimeout, handleModelHandle } = useSnailDeps()
  const { scene, animations } = useGLTF('/models/snail.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { ref, actions } = useAnimations(animations)

  const [mapTexture] = useTexture([texturePath])

  const rigidBodyRef = useRef<RapierRigidBody | null>(null)
  const { animate, stopAnimation, isAnimationRunning } = useAnimation(actions)
  const {
    updateStartShrinkAnimation,
    updateStopShrinkAnimation,
    updateIsJumping,
    updateIsStuning,
  } = useSnailContext()

  useFrame(() => {
    updateIsJumping(isAnimationRunning(JUMP_ANIMATION_NAME))
    updateIsStuning(isAnimationRunning(STUN_ANIMATION_NAME))
  })

  const startJumpAnimation = (duration: number) => animate(JUMP_ANIMATION_NAME, { duration })

  const stopJumpAnimation = () => stopAnimation(JUMP_ANIMATION_NAME)

  useJump(rigidBodyRef, startJumpAnimation)

  const startShrinkAnimation = () =>
    animate(SHRINK_ANIMATION_NAME, {
      pauseOnEnd: true,
      loop: false,
      duration: shrinkDuration / 1000,
    })

  const stopShrinkAnimation = (reset = false) => stopAnimation(SHRINK_ANIMATION_NAME, reset)

  const stopStunAnimation = () => stopAnimation(STUN_ANIMATION_NAME)

  const startStunAnimation = () => {
    animate(STUN_ANIMATION_NAME, { duration: stunTimeout / 1000 })
  }

  const stopAllAnimation = () => {
    stopShrinkAnimation()
    stopJumpAnimation()
    stopStunAnimation()
  }

  const handleCollision = useCollision(rigidBodyRef, startStunAnimation, stopAllAnimation)

  const { camera } = useThree()
  const textRef = useRef<DreiTextProps | null>(null)

  useEffect(() => {
    updateStartShrinkAnimation(startShrinkAnimation)
    updateStopShrinkAnimation(stopShrinkAnimation)
    handleModelHandle?.(rigidBodyRef.current?.handle ?? -1)
  }, [])

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt?.(camera.position)
    }
  })

  const userData = useMemo(() => ({ userID }), [])

  const { nodes } = useGraph(clone)
  const meshProps = nodes['snail_mesh'] as unknown as {
    material: object
    skeleton: Skeleton
    geometry: BufferGeometry
    morphTargetInfluences?: number[]
    morphTargetDictionary?: {
      [key: string]: number
    }
  }

  mapTexture.flipY = false
  mapTexture.colorSpace = 'srgb'

  const material = new MeshPhysicalMaterial({
    ...meshProps.material,
    map: mapTexture,
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
      onCollisionEnter={handleCollision}
      enabledRotations={[false, false, false]}
      restitution={0}>
      <CuboidCollider name='leg' args={[0.27, 0.2, 0.8]} position={[0, 0.22, -0.2]} />
      <RoundCuboidCollider name='shell' args={[0.08, 0.5, 0.5, 0.5]} position={[0, 1, 0]} />
      <Text ref={textRef} fontSize={0.8} fontWeight={800} fillOpacity={0.8} position={[0, 4, 0]}>
        {username}
      </Text>
      <group ref={ref as RefObject<Group<Object3DEventMap>>} dispose={null}>
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
