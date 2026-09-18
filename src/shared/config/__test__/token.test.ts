import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useToken, useTokenExpiry } from '../token'

const signed = (name: string, exp: number) =>
  `${name}.${btoa(JSON.stringify({ exp: Math.floor(exp / 1000) }))}.signature`

const token = () => useToken.getState().token

afterEach(() => {
  vi.useRealTimers()
})

describe('useTokenExpiry', () => {
  it('drops a token that expired before the player came back', () => {
    vi.useFakeTimers({ now: 1734567890000 })
    useToken.setState({ token: signed('stale', 1734567880000) })

    renderHook(() => useTokenExpiry())

    expect(token()).toBeNull()
  })

  it('drops a token once its expiry moment comes', () => {
    vi.useFakeTimers({ now: 1734567890000 })
    useToken.setState({ token: signed('ripening', 1734567897000) })

    renderHook(() => useTokenExpiry())
    act(() => vi.advanceTimersByTime(7000))

    expect(token()).toBeNull()
  })

  it('keeps a token while its expiry moment is ahead', () => {
    vi.useFakeTimers({ now: 1734567890000 })
    const fresh = signed('fresh', 1734567990000)
    useToken.setState({ token: fresh })

    renderHook(() => useTokenExpiry())
    act(() => vi.advanceTimersByTime(90000))

    expect(token()).toBe(fresh)
  })
})
