import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import { renderHook, waitFor } from '@testing-library/react'
import { useSnailDeps } from '@features/snail/deps'
import { Vector3 } from 'three'
import { calculateBounce, useCollision } from '../use-collision'

vi.mock('../params', () => ({
  useSnailParams: {
    getState: () => ({
      bounceMultiplier: 7,
      dynamicObstacleMultiplier: 0.3,
      collisionCooldown: 150,
      bounceJitter: 0.1,
    }),
  },
}))

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

describe('calculateBounce', () => {
  it('cannot bounce a snail into an obstacle', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const wallAhead = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      manifold: {
        normal: () => ({ x: 1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 2, y: 0, z: 0 }),
      },
    }

    const bounce = calculateBounce(wallAhead as unknown as CollisionEnterPayload, new Vector3(5, 0, 0))

    expect(bounce.x, 'bounce cannot push a snail towards an obstacle').toBeCloseTo(-7)
  })

  it('cannot weaken bounce of a steep normal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const steepNormal = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      manifold: {
        normal: () => ({ x: 0.1, y: 0.99, z: 0 }),
        numSolverContacts: () => 0,
        solverContactPoint: () => ({ x: 0, y: 0, z: 0 }),
      },
    }

    const bounce = calculateBounce(steepNormal as unknown as CollisionEnterPayload, new Vector3(0, 0, 0))

    expect(bounce.length(), 'steep normal cannot weaken bounce').toBeCloseTo(7)
  })

  it('cannot bounce a snail vertically', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const ceiling = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      manifold: {
        normal: () => ({ x: 0, y: 1, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 0, y: 3, z: 1 }),
      },
    }

    const bounce = calculateBounce(ceiling as unknown as CollisionEnterPayload, new Vector3(0, 0, 0))

    expect(bounce.y, 'bounce cannot get a vertical part').toBe(0)
  })

  it('cannot ignore a dynamic obstacle multiplier', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const movingWall = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      manifold: {
        normal: () => ({ x: 1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 2, y: 0, z: 0 }),
      },
    }

    const bounce = calculateBounce(
      movingWall as unknown as CollisionEnterPayload,
      new Vector3(5, 0, 0),
      'kinematicPosition'
    )

    expect(bounce.length(), 'dynamic obstacle cannot bounce at full power').toBeCloseTo(2.1)
  })
})

describe('useCollision bursts', () => {
  it('cannot bounce a snail once per trimesh manifold', () => {
    const wallManifold = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      other: { rigidBody: { userData: { isObstacle: true } } },
      manifold: {
        normal: () => ({ x: 1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 2, y: 0, z: 0 }),
      },
    } as unknown as CollisionEnterPayload
    vi.mocked(useSnailDeps).mockReturnValue({
      onCollision: vi.fn(),
      shouldHandleCollision: () => true,
    } as unknown as ReturnType<typeof useSnailDeps>)
    const wall = {
      linvel: () => ({ x: 5, y: 0, z: 0 }),
      translation: () => ({ x: 0, y: 0, z: 0 }),
      setLinvel: vi.fn(),
      setAngvel: vi.fn(),
      applyImpulse: vi.fn(),
    } as unknown as RapierRigidBody

    const { result } = renderHook(() =>
      useCollision({ current: wall }, vi.fn(), vi.fn())
    )
    result.current(wallManifold)
    result.current(wallManifold)
    result.current(wallManifold)

    expect(wall.applyImpulse, 'a burst of manifolds cannot bounce more than once').toHaveBeenCalledOnce()
  })

  it('cannot lose bounce direction of a degenerate contact', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const degenerate = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      manifold: {
        normal: () => ({ x: 0, y: 1, z: 0 }),
        numSolverContacts: () => 0,
        solverContactPoint: () => ({ x: 0, y: 0, z: 0 }),
      },
    }

    const bounce = calculateBounce(degenerate as unknown as CollisionEnterPayload, new Vector3(0, 0, 4))

    expect(bounce.z, 'degenerate contact cannot keep a snail going forward').toBeCloseTo(-7)
  })
})
