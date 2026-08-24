import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MAX_SPACE_HOLD_TIME } from '@shared/config/game'
import { usePlayerDeps } from '../../deps'
import { Player } from '../player'

vi.mock('@react-three/drei', () => ({ useKeyboardControls: vi.fn() }))

vi.mock('@react-three/fiber', () => ({ useFrame: vi.fn() }))

vi.mock('../../deps', () => ({ usePlayerDeps: vi.fn() }))

vi.mock('@features/snail', () => ({ useSnailContext: () => ({ stopShrinkAnimation: vi.fn() }) }))

const keys = { left: false, right: false, jump: false }

const control = { moveable: true }

const onJump = vi.fn()

const mount = () => {
  let frame = () => {}
  keys.left = false
  keys.right = false
  keys.jump = false
  control.moveable = true
  vi.mocked(useKeyboardControls).mockReturnValue([
    vi.fn(),
    () => keys,
  ] as unknown as ReturnType<typeof useKeyboardControls>)
  vi.mocked(useFrame).mockImplementation(callback => {
    frame = () => callback({} as never, 0)
    return null
  })
  vi.mocked(usePlayerDeps).mockReturnValue({
    onJump,
    onRotate: vi.fn(),
    canMove: () => control.moveable,
    onStartShrink: vi.fn(),
    onStopShrink: vi.fn(),
  })
  render(<Player>{null}</Player>)

  return () => frame()
}

describe('Player', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('jumps with the whole hold time of an uninterrupted press', () => {
    vi.useFakeTimers()
    const frame = mount()

    keys.jump = true
    frame()
    vi.advanceTimersByTime(300)
    keys.jump = false
    frame()

    expect(onJump).toHaveBeenCalledWith(300 / MAX_SPACE_HOLD_TIME, 300, expect.any(Function))
  })

  it('cannot keep the hold accumulated before a collision took the control away', () => {
    vi.useFakeTimers()
    const frame = mount()

    keys.jump = true
    frame()
    vi.advanceTimersByTime(400)
    control.moveable = false
    frame()
    vi.advanceTimersByTime(2000)
    control.moveable = true
    frame()
    keys.jump = false
    frame()

    expect(onJump).toHaveBeenCalledWith(0.4, 0, expect.any(Function))
  })
})
