import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useObserveTabFocus, useTabFocus } from '../tab-focus'

const withVisibility = (state: 'visible' | 'hidden') => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('useObserveTabFocus', () => {
  it('cannot keep the focus while the phone hides the page', () => {
    renderHook(() => useObserveTabFocus())
    const { result } = renderHook(() => useTabFocus())

    act(() => withVisibility('hidden'))

    expect(result.current).toBe(false)
  })

  it('cannot stay unfocused once the player returns to the page', () => {
    renderHook(() => useObserveTabFocus())
    const { result } = renderHook(() => useTabFocus())
    act(() => withVisibility('hidden'))

    act(() => withVisibility('visible'))

    expect(result.current).toBe(true)
  })

  it('cannot keep the focus while the phone leaves the page', () => {
    renderHook(() => useObserveTabFocus())
    const { result } = renderHook(() => useTabFocus())

    act(() => window.dispatchEvent(new Event('pagehide')))

    expect(result.current).toBe(false)
  })

  it('cannot stay unfocused once the phone restores the page', () => {
    renderHook(() => useObserveTabFocus())
    const { result } = renderHook(() => useTabFocus())
    act(() => window.dispatchEvent(new Event('pagehide')))

    act(() => window.dispatchEvent(new Event('pageshow')))

    expect(result.current).toBe(true)
  })

  it('cannot keep the focus while the desktop window blurs', () => {
    renderHook(() => useObserveTabFocus())
    const { result } = renderHook(() => useTabFocus())

    act(() => window.dispatchEvent(new Event('blur')))

    expect(result.current).toBe(false)
  })
})
