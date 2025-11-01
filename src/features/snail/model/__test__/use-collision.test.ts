import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import { renderHook, waitFor } from '@testing-library/react'
import { useSnailDeps } from '@features/snail/deps'
import { useCollision } from '../use-collision'

vi.mock('@features/snail/deps', () => ({
  useSnailDeps: vi.fn().mockReturnValue({
    onCollision: vi.fn(),
    shouldHandleCollision: vi.fn(),
  }),
}))

describe('useCollision', () => {
  const mockedAnimateCollision = vi.fn()
  const mockedGetRigidBody = vi.fn().mockReturnValue({
    applyImpulse: vi.fn(),
    setRotation: vi.fn(),
    setTranslation: vi.fn(),
    setLinvel: vi.fn(),
  } as unknown as RapierRigidBody)

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
    const rigidBody = mockedGetRigidBody()
    const debounceLinvel = { x: 1, y: 2, z: 3 }
    const collisionPayload = {
      manifold: { normal: () => debounceLinvel },
      other: {},
    } as CollisionEnterPayload

    const { result: snailDepsResult } = renderHook(() => useSnailDeps())
    const { result: collisionResult } = renderHook(() => useCollision(mockedAnimateCollision))

    collisionResult.current(collisionPayload)

    waitFor(() => {
      expect(mockedAnimateCollision).toHaveBeenCalledOnce()
      expect(snailDepsResult.current.onCollision).toHaveBeenCalledOnce()
      expect(rigidBody.setLinvel).toHaveBeenCalledWith(debounceLinvel, true)
    })
  })

  it('should not handle collision', () => {
    vi.mock('@features/snail/deps', () => ({
      useSnailDeps: vi.fn().mockReturnValue({
        onCollision: vi.fn(),
        shouldHandleCollision: vi.fn().mockReturnValue(false),
      }),
    }))
    const rigidBody = mockedGetRigidBody()
    const debounceLinvel = { x: 1, y: 2, z: 3 }
    const collisionPayload = {
      manifold: { normal: () => debounceLinvel },
      other: {},
    } as CollisionEnterPayload

    const { result: snailDepsResult } = renderHook(() => useSnailDeps())
    const { result: collisionResult } = renderHook(() => useCollision(mockedAnimateCollision))

    collisionResult.current(collisionPayload)

    waitFor(() => {
      expect(mockedAnimateCollision).not.toHaveBeenCalled()
      expect(snailDepsResult.current.onCollision).not.toHaveBeenCalled()
      expect(rigidBody.setLinvel).not.toHaveBeenCalled()
    })
  })
})
