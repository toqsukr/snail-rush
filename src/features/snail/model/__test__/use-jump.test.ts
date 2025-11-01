import { Euler, Quaternion, Vector3 } from 'three'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { RapierRigidBody } from '@react-three/rapier'
import { renderHook, waitFor } from '@testing-library/react'
import { useSnailContext } from '@features/snail/ui/snail-provider'
import { Emitter } from '@shared/lib/emitter'
import { useSnailDeps } from '@features/snail/deps'
import { useJump } from '../use-jump'
import { PositionWithCorrectType, PositionWithoutCorrectType, type RotationType } from '../types'

vi.mock('@features/snail/ui/snail-provider', () => ({
  useSnailContext: vi.fn().mockReturnValue({
    updatePosition: vi.fn(),
    updateRotation: vi.fn(),
    getPosition: () => new Vector3(),
    rotation: new Euler(),
  }),
}))

vi.mock('@features/snail/deps', () => ({
  useSnailDeps: vi.fn().mockReturnValue({
    positionEmitter: new Emitter<PositionWithCorrectType>(),
    rotationEmitter: new Emitter<RotationType>(),
  }),
}))

describe('useJump', () => {
  const mockedAnimateJump = vi.fn()
  const mockedRigidBody = {
    translation: vi.fn().mockReturnValue({ x: 1, y: 2, z: 3 }),
    applyImpulse: vi.fn(),
    setRotation: vi.fn(),
    setTranslation: vi.fn(),
  } as unknown as RapierRigidBody

  const rigidBodyRef = { current: mockedRigidBody }

  beforeAll(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('should handle position', async () => {
    const position: PositionWithCorrectType = {
      correctStartPosition: true,
      startPosition: new Vector3(10, 20, 30),
      duration: 100,
      holdTime: 500,
      impulse: new Vector3(1, 2, 3),
    }

    renderHook(() => useJump(rigidBodyRef, mockedAnimateJump))
    const { result: snailContextResult } = renderHook(() => useSnailContext())
    const { result: snailDepsResult } = renderHook(() => useSnailDeps())

    const positionEmitter = snailDepsResult.current
      .positionEmitter as Emitter<PositionWithCorrectType>
    positionEmitter.emitNextValue(position)

    await waitFor(() => {
      expect(mockedRigidBody.setTranslation).toHaveBeenCalledWith(position.startPosition, true)
    })

    await waitFor(() => {
      expect(mockedAnimateJump).toHaveBeenCalledWith(position.duration)
      expect(mockedRigidBody.applyImpulse).toHaveBeenCalledWith(position.impulse, true)
      expect(snailContextResult.current.updatePosition).toHaveBeenCalledWith(position.impulse)
    })
  })

  it('should handle rotation', async () => {
    const duration = 100
    const rotation = new Euler(1, 2, 3)

    renderHook(() => useJump(rigidBodyRef, mockedAnimateJump))
    const { result: snailContextResult } = renderHook(() => useSnailContext())
    const { result: snailDepsResult } = renderHook(() => useSnailDeps())

    snailDepsResult.current.rotationEmitter.emitNextValue({ rotation, duration })

    await waitFor(() => {
      expect(mockedRigidBody.setRotation).toHaveBeenCalledWith(
        new Quaternion().setFromEuler(rotation),
        true
      )
      expect(snailContextResult.current.updateRotation).toHaveBeenCalledWith(rotation)
    })
  })

  it('should set initial position & rotation', () => {
    renderHook(() => useJump(rigidBodyRef, mockedAnimateJump))
    const { result } = renderHook(() => useSnailContext())
    const quaternion = new Quaternion().setFromEuler(result.current.rotation)

    expect(mockedRigidBody.setTranslation).toHaveBeenCalledWith(result.current.getPosition(), true)
    expect(mockedRigidBody.setRotation).toHaveBeenCalledWith(quaternion, true)
  })

  it('should handle position without correctStartPosition', async () => {
    const position: PositionWithoutCorrectType = {
      correctStartPosition: false,
      duration: 100,
      holdTime: 500,
      impulse: new Vector3(1, 2, 3),
    }

    renderHook(() => useJump(rigidBodyRef, mockedAnimateJump))
    const { result: snailContextResult } = renderHook(() => useSnailContext())
    const { result: snailDepsResult } = renderHook(() => useSnailDeps())

    const positionEmitter = snailDepsResult.current
      .positionEmitter as Emitter<PositionWithoutCorrectType>
    positionEmitter.emitNextValue(position)

    await waitFor(() => {
      expect(mockedRigidBody.setTranslation).not.toHaveBeenCalledWith(position.startPosition, true)
      expect(mockedAnimateJump).toHaveBeenCalledWith(position.duration)
      expect(mockedRigidBody.applyImpulse).toHaveBeenCalledWith(position.impulse, true)
      expect(snailContextResult.current.updatePosition).toHaveBeenCalledWith(position.impulse)
    })
  })
})
