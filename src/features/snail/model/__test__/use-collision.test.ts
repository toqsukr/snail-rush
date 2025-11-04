import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import { renderHook, waitFor } from '@testing-library/react'
import { useSnailDeps } from '@features/snail/deps'
import { useCollision } from '../use-collision'

vi.mock('@features/snail/ui/snail-provider', () => ({
  useSnailContext: vi.fn().mockReturnValue({
    updatePosition: vi.fn(),
  }),
}))

vi.mock('@features/snail/deps', () => ({
  useSnailDeps: vi.fn().mockReturnValue({
    onCollision: vi.fn(),
    shouldHandleCollision: vi.fn(),
  }),
}))

describe('useCollision', () => {
  const mockedAnimateCollision = vi.fn()
  const mockedStopAllAnimation = vi.fn()
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

  it('should handle collision', () => {
    vi.mock('@features/snail/deps', () => ({
      useSnailDeps: vi.fn().mockReturnValue({
        onCollision: vi.fn(),
        shouldHandleCollision: vi.fn().mockReturnValue(true),
      }),
    }))
    const debounceLinvel = { x: 1, y: 2, z: 3 }
    const collisionPayload = {
      manifold: { normal: () => debounceLinvel },
      other: {},
    } as CollisionEnterPayload

    const { result: snailDepsResult } = renderHook(() => useSnailDeps())
    const { result: collisionResult } = renderHook(() =>
      useCollision(rigidBodyRef, mockedAnimateCollision, mockedStopAllAnimation)
    )

    collisionResult.current(collisionPayload)

    waitFor(() => {
      expect(mockedAnimateCollision).toHaveBeenCalledOnce()
      expect(snailDepsResult.current.onCollision).toHaveBeenCalledOnce()
      expect(mockedRigidBody.setLinvel).toHaveBeenCalledWith(debounceLinvel, true)
    })
  })

  it('should not handle collision', () => {
    vi.mock('@features/snail/deps', () => ({
      useSnailDeps: vi.fn().mockReturnValue({
        onCollision: vi.fn(),
        shouldHandleCollision: vi.fn().mockReturnValue(false),
      }),
    }))
    const debounceLinvel = { x: 1, y: 2, z: 3 }
    const collisionPayload = {
      manifold: { normal: () => debounceLinvel },
      other: {},
    } as CollisionEnterPayload

    const { result: snailDepsResult } = renderHook(() => useSnailDeps())
    const { result: collisionResult } = renderHook(() =>
      useCollision(rigidBodyRef, mockedAnimateCollision, mockedStopAllAnimation)
    )

    collisionResult.current(collisionPayload)

    waitFor(() => {
      expect(mockedAnimateCollision).not.toHaveBeenCalled()
      expect(snailDepsResult.current.onCollision).not.toHaveBeenCalled()
      expect(mockedRigidBody.setLinvel).not.toHaveBeenCalled()
    })
  })
})
