import { describe, expect, it, vi } from 'vitest'
import { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import { renderHook } from '@testing-library/react'
import { useSnailDeps } from '@features/snail/deps'
import { useSnailContext } from '@features/snail/ui/snail-provider'
import { Vector3 } from 'three'
import { BouncePayload, calculateBounce, useCollision } from '../use-collision'

vi.mock('../params', () => ({
  useSnailParams: {
    getState: () => ({
      bounceMultiplier: 7,
      dynamicObstacleMultiplier: 0.3,
      collisionCooldown: 150,
      bounceJitter: 0.1,
      minApproachSpeed: 0.5,
    }),
  },
}))

vi.mock('@features/snail/ui/snail-provider', () => ({
  useSnailContext: vi.fn().mockReturnValue({
    updatePosition: vi.fn(),
    getIsStuning: () => false,
  }),
}))

vi.mock('@features/snail/deps', () => ({
  useSnailDeps: vi.fn().mockReturnValue({
    onCollision: vi.fn(),
    shouldHandleCollision: vi.fn(),
  }),
}))

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

    expect(bounce!.x, 'bounce cannot push a snail towards an obstacle').toBeCloseTo(-7)
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

    expect(bounce!.length(), 'steep normal cannot weaken bounce').toBeCloseTo(7)
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

    expect(bounce!.y, 'bounce cannot get a vertical part').toBe(0)
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

    expect(bounce!.length(), 'dynamic obstacle cannot bounce at full power').toBeCloseTo(2.1)
  })
})

describe('useCollision bursts', () => {
  it('cannot bounce a snail once per trimesh manifold', () => {
    const wallManifold = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      other: { rigidBody: { userData: { isObstacle: true }, isKinematic: () => false } },
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
    result.current.enter(wallManifold)
    result.current.enter(wallManifold)
    result.current.enter(wallManifold)

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

    expect(bounce!.z, 'degenerate contact cannot keep a snail going forward').toBeCloseTo(-7)
  })
})

describe('useCollision of a dynamic obstacle', () => {
  it('cannot bounce a snail off a chopper at full power', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.mocked(useSnailDeps).mockReturnValue({
      onCollision: vi.fn(),
      shouldHandleCollision: () => true,
    } as unknown as ReturnType<typeof useSnailDeps>)
    const chopper = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      other: { rigidBody: { userData: { isObstacle: true }, isKinematic: () => true } },
      manifold: {
        normal: () => ({ x: 1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 2, y: 0, z: 0 }),
      },
    } as unknown as CollisionEnterPayload
    const snail = {
      linvel: () => ({ x: 5, y: 0, z: 0 }),
      translation: () => ({ x: 0, y: 0, z: 0 }),
      setLinvel: vi.fn(),
      setAngvel: vi.fn(),
      applyImpulse: vi.fn(),
    } as unknown as RapierRigidBody

    const { result } = renderHook(() => useCollision({ current: snail }, vi.fn(), vi.fn()))
    result.current.enter(chopper)

    expect(
      (vi.mocked(snail.applyImpulse).mock.calls[0][0] as Vector3).length(),
      'a chopper cannot bounce a snail at full power'
    ).toBeCloseTo(2.1)
  })
})

describe('calculateBounce of a sensor', () => {
  it('cannot lose bounce direction of a sensor intersection', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const chopperSensor = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      other: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 6 }) } },
    }

    const bounce = calculateBounce(chopperSensor as unknown as BouncePayload, new Vector3(0, 0, 0))

    expect(bounce!.z, 'a sensor intersection cannot lose bounce direction').toBeCloseTo(-7)
  })
})

describe('useCollision of unequal approach speeds', () => {
  const bounceOf = (speed: number) => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.mocked(useSnailDeps).mockReturnValue({
      onCollision: vi.fn(),
      shouldHandleCollision: () => true,
    } as unknown as ReturnType<typeof useSnailDeps>)
    const wall = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      other: { rigidBody: { userData: { isObstacle: true }, isKinematic: () => false } },
      manifold: {
        normal: () => ({ x: 1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 2, y: 0, z: 0 }),
      },
    } as unknown as BouncePayload
    const snail = {
      linvel: () => ({ x: speed, y: 0, z: 0 }),
      translation: () => ({ x: 0, y: 0, z: 0 }),
      setLinvel: vi.fn(),
      setAngvel: vi.fn(),
      applyImpulse: vi.fn(),
    } as unknown as RapierRigidBody

    const { result } = renderHook(() => useCollision({ current: snail }, vi.fn(), vi.fn()))
    result.current.enter(wall)

    return (vi.mocked(snail.applyImpulse).mock.calls[0][0] as Vector3).length()
  }

  it('cannot bounce a racing snail harder than a crawling one', () => {
    expect(
      bounceOf(40),
      'impact speed cannot change how hard a snail rebounds'
    ).toBeCloseTo(bounceOf(0.5))
  })
})

describe('calculateBounce of a sliding contact', () => {
  it('cannot drag a snail along a wall', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const grazing = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      manifold: {
        normal: () => ({ x: 1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 0.05, y: 0, z: 0.9 }),
      },
    }

    const bounce = calculateBounce(grazing as unknown as CollisionEnterPayload, new Vector3(2, 0, 3))

    expect(bounce!.z, 'a grazing contact cannot push a snail along a wall').toBeCloseTo(0)
  })

  it('cannot bounce a snail in its approach direction of a flipped normal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const flipped = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      manifold: {
        normal: () => ({ x: -1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: -2, y: 0, z: 0 }),
      },
    }

    const bounce = calculateBounce(flipped as unknown as CollisionEnterPayload, new Vector3(-5, 0, 0))

    expect(bounce!.x, 'a flipped normal cannot push a snail deeper into a wall').toBeCloseTo(7)
  })
})

describe('useCollision of a directionless contact', () => {
  it('cannot crash on a contact with no direction', () => {
    vi.mocked(useSnailDeps).mockReturnValue({
      onCollision: vi.fn(),
      shouldHandleCollision: () => true,
    } as unknown as ReturnType<typeof useSnailDeps>)
    const still = {
      linvel: () => ({ x: 0, y: 0, z: 0 }),
      translation: () => ({ x: 0, y: 0, z: 0 }),
      setLinvel: vi.fn(),
      setAngvel: vi.fn(),
      applyImpulse: vi.fn(),
    } as unknown as RapierRigidBody
    const contactless = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
    } as unknown as BouncePayload

    const { result } = renderHook(() => useCollision({ current: still }, vi.fn(), vi.fn()))
    result.current.enter(contactless)

    expect(still.applyImpulse, 'a directionless contact cannot bounce a snail').not.toHaveBeenCalled()
  })
})

describe('useCollision of a non obstacle', () => {
  it('cannot bounce a snail off a non obstacle', () => {
    vi.mocked(useSnailDeps).mockReturnValue({
      onCollision: vi.fn(),
      shouldHandleCollision: () => false,
    } as unknown as ReturnType<typeof useSnailDeps>)
    const snail = {
      linvel: () => ({ x: 5, y: 0, z: 0 }),
      translation: () => ({ x: 0, y: 0, z: 0 }),
      setLinvel: vi.fn(),
      setAngvel: vi.fn(),
      applyImpulse: vi.fn(),
    } as unknown as RapierRigidBody
    const decoration = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      other: { rigidBody: { userData: {}, isKinematic: () => false } },
      manifold: {
        normal: () => ({ x: 1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 2, y: 0, z: 0 }),
      },
    } as unknown as BouncePayload

    const { result } = renderHook(() => useCollision({ current: snail }, vi.fn(), vi.fn()))
    result.current.enter(decoration)

    expect(snail.applyImpulse, 'a non obstacle cannot bounce a snail').not.toHaveBeenCalled()
  })
})

const stunned = () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  vi.mocked(useSnailDeps).mockReturnValue({
    onCollision: vi.fn(),
    shouldHandleCollision: () => true,
  } as unknown as ReturnType<typeof useSnailDeps>)
  vi.mocked(useSnailContext).mockReturnValue({
    updatePosition: vi.fn(),
    getIsStuning: () => true,
  } as unknown as ReturnType<typeof useSnailContext>)
  const snail = {
    linvel: () => ({ x: 5, y: 0, z: 0 }),
    translation: () => ({ x: 0, y: 0, z: 0 }),
    setLinvel: vi.fn(),
    setAngvel: vi.fn(),
    applyImpulse: vi.fn(),
  } as unknown as RapierRigidBody
  const wall = {
    target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
    other: { rigidBody: { userData: { isObstacle: true }, isKinematic: () => false } },
    manifold: {
      normal: () => ({ x: 1, y: 0, z: 0 }),
      numSolverContacts: () => 1,
      solverContactPoint: () => ({ x: 2, y: 0, z: 0 }),
    },
  } as unknown as BouncePayload
  return { snail, wall }
}

describe('useCollision of a stunned snail', () => {
  it('cannot restart a stun of an already stunned snail', () => {
    const { snail, wall } = stunned()
    const stun = vi.fn()

    const { result } = renderHook(() => useCollision({ current: snail }, stun, vi.fn()))
    result.current.enter(wall)

    expect(stun, 'a stun cannot restart while the previous one lasts').not.toHaveBeenCalled()
  })

  it('cannot interrupt animations of a stunned snail', () => {
    const { snail, wall } = stunned()
    const interrupt = vi.fn()

    const { result } = renderHook(() => useCollision({ current: snail }, vi.fn(), interrupt))
    result.current.enter(wall)

    expect(interrupt, 'a repeat hit cannot interrupt a running stun animation').not.toHaveBeenCalled()
  })

  it('cannot pin a stunned snail against an obstacle', () => {
    const { snail, wall } = stunned()

    const { result } = renderHook(() => useCollision({ current: snail }, vi.fn(), vi.fn()))
    result.current.enter(wall)

    expect(snail.applyImpulse, 'a stunned snail cannot stay pinned to an obstacle').toHaveBeenCalledOnce()
  })
})

describe('useCollision inside the cooldown window', () => {
  it('cannot bounce twice inside the collision cooldown', () => {
    const { snail, wall } = stunned()

    const { result } = renderHook(() => useCollision({ current: snail }, vi.fn(), vi.fn()))
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    result.current.enter(wall)
    vi.spyOn(Date, 'now').mockReturnValue(1_000_149)
    result.current.enter(wall)

    expect(snail.applyImpulse, 'the cooldown window cannot let a second bounce through').toHaveBeenCalledOnce()
  })

  it('cannot ignore a collision after the cooldown passes', () => {
    const { snail, wall } = stunned()

    const { result } = renderHook(() => useCollision({ current: snail }, vi.fn(), vi.fn()))
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    result.current.enter(wall)
    vi.spyOn(Date, 'now').mockReturnValue(1_000_151)
    result.current.enter(wall)

    expect(snail.applyImpulse, 'an expired cooldown cannot swallow a collision').toHaveBeenCalledTimes(2)
  })
})

describe('useCollision of a turning snail', () => {
  it('cannot bounce a snail off a wall it only turned into', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.mocked(useSnailDeps).mockReturnValue({
      onCollision: vi.fn(),
      shouldHandleCollision: () => true,
    } as unknown as ReturnType<typeof useSnailDeps>)
    const turning = {
      linvel: () => ({ x: 0.2, y: 0, z: 0.2 }),
      translation: () => ({ x: 0, y: 0, z: 0 }),
      setLinvel: vi.fn(),
      setAngvel: vi.fn(),
      applyImpulse: vi.fn(),
    } as unknown as RapierRigidBody
    const wall = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      other: { rigidBody: { userData: { isObstacle: true }, isKinematic: () => false } },
      manifold: {
        normal: () => ({ x: 1, y: 0, z: 0 }),
        numSolverContacts: () => 1,
        solverContactPoint: () => ({ x: 1, y: 0, z: 0 }),
      },
    } as unknown as BouncePayload

    const { result } = renderHook(() => useCollision({ current: turning }, vi.fn(), vi.fn()))
    result.current.enter(wall)

    expect(turning.applyImpulse, 'a turn in place cannot bounce a snail off a wall').not.toHaveBeenCalled()
  })

  it('cannot ignore a chopper hitting a resting snail', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.mocked(useSnailDeps).mockReturnValue({
      onCollision: vi.fn(),
      shouldHandleCollision: () => true,
    } as unknown as ReturnType<typeof useSnailDeps>)
    const resting = {
      linvel: () => ({ x: 0, y: 0, z: 0 }),
      translation: () => ({ x: 0, y: 0, z: 0 }),
      setLinvel: vi.fn(),
      setAngvel: vi.fn(),
      applyImpulse: vi.fn(),
    } as unknown as RapierRigidBody
    const chopper = {
      target: { rigidBody: { translation: () => ({ x: 0, y: 0, z: 0 }) } },
      other: {
        rigidBody: {
          userData: { isObstacle: true },
          isKinematic: () => true,
          translation: () => ({ x: 0, y: 0, z: 6 }),
        },
      },
    } as unknown as BouncePayload

    const { result } = renderHook(() => useCollision({ current: resting }, vi.fn(), vi.fn()))
    result.current.enter(chopper)

    expect(resting.applyImpulse, 'a moving chopper cannot pass through a resting snail').toHaveBeenCalledOnce()
  })
})
