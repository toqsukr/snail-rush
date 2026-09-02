import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGameStore } from '../store'
import { useStunLock } from '../use-stun-lock'

describe('useStunLock', () => {
  it('cannot leave a snail locked after the stun ends', () => {
    vi.useFakeTimers()
    useGameStore.setState({ moveable: true, pause: false, finished: false })
    const { result } = renderHook(() => useStunLock())
    result.current(500)
    vi.advanceTimersByTime(500)
    vi.useRealTimers()
    expect(useGameStore.getState().moveable, 'a stun cannot outlive its timeout').toBe(true)
  })

  it('cannot stack a second stun lock onto a pending one', () => {
    vi.useFakeTimers()
    useGameStore.setState({ moveable: true, pause: false, finished: false })
    const { result } = renderHook(() => useStunLock())
    result.current(500)
    vi.advanceTimersByTime(300)
    result.current(500)
    vi.advanceTimersByTime(200)
    vi.useRealTimers()
    expect(useGameStore.getState().moveable, 'a repeat lock cannot extend a pending stun').toBe(true)
  })

  it('cannot unlock movement after unmount', () => {
    vi.useFakeTimers()
    useGameStore.setState({ moveable: true, pause: false, finished: false })
    const { result, unmount } = renderHook(() => useStunLock())
    result.current(500)
    unmount()
    vi.advanceTimersByTime(500)
    vi.useRealTimers()
    expect(useGameStore.getState().moveable, 'an unmounted lock cannot unfreeze movement').toBe(false)
  })

  it('cannot unlock movement of a finished game', () => {
    vi.useFakeTimers()
    useGameStore.setState({ moveable: true, pause: false, finished: false })
    const { result } = renderHook(() => useStunLock())
    result.current(500)
    useGameStore.getState().finishGame()
    vi.advanceTimersByTime(500)
    vi.useRealTimers()
    expect(useGameStore.getState().moveable, 'a stale stun timer cannot unfreeze a finished game').toBe(false)
  })
})
