import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePortrait } from '../orientation'

const withPortrait = (portrait: boolean) => {
  const listeners = new Set<() => void>()
  const query = {
    matches: portrait,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }
  Object.defineProperty(window, 'matchMedia', {
    value: () => query as unknown as MediaQueryList,
    configurable: true,
  })
  return (turned: boolean) => {
    query.matches = turned
    listeners.forEach(listener => listener())
  }
}

describe('usePortrait', () => {
  it('asks the player for landscape while the phone stands upright', () => {
    withPortrait(true)

    expect(renderHook(() => usePortrait()).result.current).toBe(true)
  })

  it('cannot ask for landscape while the phone lies sideways', () => {
    withPortrait(false)

    expect(renderHook(() => usePortrait()).result.current).toBe(false)
  })

  it('drops the request once the phone is turned sideways', () => {
    const turn = withPortrait(true)
    const { result } = renderHook(() => usePortrait())

    act(() => turn(false))

    expect(result.current).toBe(false)
  })
})
