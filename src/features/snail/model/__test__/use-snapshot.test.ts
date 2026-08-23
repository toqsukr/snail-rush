import { Vector3 } from 'three'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RapierRigidBody } from '@react-three/rapier'
import { renderHook } from '@testing-library/react'
import { useSnailDeps } from '@features/snail/deps'
import { useSnailContext } from '@features/snail/ui/snail-provider'
import { Emitter } from '@shared/lib/emitter'
import { SNAPSHOT_INTERVAL, SNAPSHOT_TOLERANCE } from '../constants'
import { SnapshotType } from '../types'
import { useSnapshot } from '../use-snapshot'

vi.mock('@features/snail/deps', () => ({ useSnailDeps: vi.fn() }))

vi.mock('@features/snail/ui/snail-provider', () => ({ useSnailContext: vi.fn() }))

const snailAt = (position: Vector3, velocity = new Vector3()) =>
  ({
    translation: () => position,
    linvel: vi.fn().mockReturnValue(velocity),
    setLinvel: vi.fn(),
    setTranslation: vi.fn(),
  }) as unknown as RapierRigidBody

const deps = (overrides: { onSnapshot?: (snapshot: SnapshotType) => void; snapshotEmitter?: Emitter<SnapshotType> }) => {
  vi.mocked(useSnailDeps).mockReturnValue(overrides as ReturnType<typeof useSnailDeps>)
  vi.mocked(useSnailContext).mockReturnValue({
    updatePosition: vi.fn(),
  } as unknown as ReturnType<typeof useSnailContext>)
}

describe('useSnapshot of an owned snail', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('cannot leave an owner silent on its first tick', () => {
    const onSnapshot = vi.fn()
    deps({ onSnapshot })
    const snail = snailAt(new Vector3(4, 0, 9), new Vector3(0, 0, -2))

    renderHook(() => useSnapshot({ current: snail })).result.current.tick()

    expect(onSnapshot, 'an owner cannot skip the snapshot a lost bounce relies on').toHaveBeenCalledWith({
      position: new Vector3(4, 0, 9),
      velocity: new Vector3(0, 0, -2),
    })
  })

  it('cannot broadcast twice inside one interval', () => {
    const onSnapshot = vi.fn()
    deps({ onSnapshot })
    const { result } = renderHook(() => useSnapshot({ current: snailAt(new Vector3()) }))

    result.current.tick()
    result.current.tick()

    expect(onSnapshot, 'a frame rate cannot dictate the snapshot rate').toHaveBeenCalledTimes(1)
  })

  it('cannot fall silent once the interval has passed', () => {
    vi.useFakeTimers()
    const onSnapshot = vi.fn()
    deps({ onSnapshot })
    const { result } = renderHook(() => useSnapshot({ current: snailAt(new Vector3()) }))

    result.current.tick()
    vi.advanceTimersByTime(SNAPSHOT_INTERVAL)
    result.current.tick()

    expect(onSnapshot, 'a waiting opponent cannot be left without a fresh snapshot').toHaveBeenCalledTimes(2)
  })

  it('cannot broadcast a snail it dont own', () => {
    const emitter = new Emitter<SnapshotType>()
    deps({ snapshotEmitter: emitter })
    const snail = snailAt(new Vector3())

    renderHook(() => useSnapshot({ current: snail })).result.current.tick()

    expect(snail.linvel, 'a replayed snail cannot broadcast its own guesses').not.toHaveBeenCalled()
  })
})

describe('useSnapshot of a replayed snail', () => {
  it('cannot anchor a snail its owner still agrees with', () => {
    const emitter = new Emitter<SnapshotType>()
    deps({ snapshotEmitter: emitter })
    const snail = snailAt(new Vector3(4, 0, 9))

    renderHook(() => useSnapshot({ current: snail }))
    emitter.emitNextValue({
      position: new Vector3(4, 0, 9 + SNAPSHOT_TOLERANCE / 2),
      velocity: new Vector3(),
    })

    expect(snail.setTranslation, 'a snail within tolerance cannot be jerked around').not.toHaveBeenCalled()
  })

  it('cannot let a snail drift away from its owner', () => {
    const emitter = new Emitter<SnapshotType>()
    deps({ snapshotEmitter: emitter })
    const snail = snailAt(new Vector3(4, 0, 9))
    const position = new Vector3(4, 0, 9 + SNAPSHOT_TOLERANCE * 3)

    renderHook(() => useSnapshot({ current: snail }))
    emitter.emitNextValue({ position, velocity: new Vector3() })

    expect(snail.setTranslation, 'a lost bounce cannot strand a snail inside an obstacle').toHaveBeenCalledWith(position, true)
  })

  it('cannot leave an anchored snail carrying a stale speed', () => {
    const emitter = new Emitter<SnapshotType>()
    deps({ snapshotEmitter: emitter })
    const snail = snailAt(new Vector3(4, 0, 9), new Vector3(0, 0, -8))
    const velocity = new Vector3(0, 0, 3)

    renderHook(() => useSnapshot({ current: snail }))
    emitter.emitNextValue({
      position: new Vector3(4, 0, 9 + SNAPSHOT_TOLERANCE * 3),
      velocity,
    })

    expect(snail.setLinvel, 'an anchored snail cannot keep the speed it drifted with').toHaveBeenCalledWith(velocity, true)
  })
})
