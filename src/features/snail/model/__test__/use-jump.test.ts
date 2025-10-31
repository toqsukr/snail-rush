import { Euler, Quaternion, Vector3 } from 'three'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { RapierRigidBody } from '@react-three/rapier'
import { renderHook, waitFor } from '@testing-library/react'
import { useSnailContext } from '@features/snail/ui/snail-provider'
import { Emitter } from '@shared/lib/emitter'
import { useSnailDeps } from '@features/snail/deps'
import { useJump } from '../use-jump'
import type { PositionType, RotationType } from '../types'

vi.mock('@features/snail/ui/snail-provider', () => ({
  useSnailContext: vi.fn().mockReturnValue({
    updatePosition: vi.fn(),
    updateRotation: vi.fn(),
    position: new Vector3(),
    rotation: new Euler(),
  }),
}))

vi.mock('@features/snail/deps', () => ({
  useSnailDeps: vi.fn().mockReturnValue({
    positionEmitter: new Emitter<PositionType>(),
    rotationEmitter: new Emitter<RotationType>(),
  }),
}))

describe('useJump', () => {
  const mockedAnimateJump = vi.fn()
  const mockedGetRigidBody = vi.fn().mockReturnValue({
    applyImpulse: vi.fn(),
    setRotation: vi.fn(),
    setTranslation: vi.fn(),
  } as unknown as RapierRigidBody)

  beforeAll(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('should handle position', () => {
    const rigidBody = mockedGetRigidBody()
    const position: PositionType = {
      duration: 100,
      holdTime: 500,
      impulse: new Vector3(1, 2, 3),
    }

    renderHook(() => useJump(mockedGetRigidBody, mockedAnimateJump))
    const { result: snailContextResult } = renderHook(() => useSnailContext())
    const { result: snailDepsResult } = renderHook(() => useSnailDeps())

    snailDepsResult.current.positionEmitter.emitNextValue(position)

    waitFor(() => {
      expect(mockedAnimateJump).toHaveBeenCalledWith(snailContextResult.current.position)
      expect(rigidBody.applyImpulse).toHaveBeenCalledWith(position.impulse, true)
      expect(snailContextResult.current.updatePosition).toHaveBeenCalledWith(position.impulse)
    })
  })

  it('should handle rotation', () => {
    const duration = 100
    const rotation = new Euler(1, 2, 3)
    const rigidBody = mockedGetRigidBody()

    renderHook(() => useJump(mockedGetRigidBody, mockedAnimateJump))
    const { result: snailContextResult } = renderHook(() => useSnailContext())
    const { result: snailDepsResult } = renderHook(() => useSnailDeps())

    snailDepsResult.current.rotationEmitter.emitNextValue({ rotation, duration })

    waitFor(() => {
      expect(rigidBody.setRotation).toHaveBeenCalledWith(
        new Quaternion().setFromEuler(rotation),
        true
      )
      expect(snailContextResult.current.updateRotation).toHaveBeenCalledWith(rotation)
    })
  })

  it('should set initial position & rotation', () => {
    const rigidBody = mockedGetRigidBody()

    renderHook(() => useJump(mockedGetRigidBody, mockedAnimateJump))
    const { result } = renderHook(() => useSnailContext())
    const quaternion = new Quaternion().setFromEuler(result.current.rotation)

    expect(rigidBody.setTranslation).toHaveBeenCalledWith(
      new Vector3(...result.current.position),
      true
    )
    expect(rigidBody.setRotation).toHaveBeenCalledWith(quaternion, true)
  })
})
