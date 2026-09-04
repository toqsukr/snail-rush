import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { hasWebgl, withWebgl } from '../webgl'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('hasWebgl', () => {
  it('accepts a webgl2 context', () => {
    const canvas = { getContext: (name: string) => (name === 'webgl2' ? {} : null) }

    expect(hasWebgl(canvas as HTMLCanvasElement)).toBe(true)
  })

  it('accepts a legacy webgl context', () => {
    const canvas = { getContext: (name: string) => (name === 'webgl' ? {} : null) }

    expect(hasWebgl(canvas as HTMLCanvasElement)).toBe(true)
  })

  it('rejects a canvas without any context', () => {
    const canvas = { getContext: () => null }

    expect(hasWebgl(canvas as unknown as HTMLCanvasElement)).toBe(false)
  })

  it('rejects a canvas that throws on context', () => {
    const canvas = {
      getContext: () => {
        throw new Error('webgl is disabled')
      },
    }

    expect(hasWebgl(canvas as unknown as HTMLCanvasElement)).toBe(false)
  })
})

describe('withWebgl', () => {
  const Scene = () => <span>scene</span>
  const Fallback = () => <span>fallback</span>

  it('renders the guarded component on a webgl capable canvas', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as RenderingContext)
    const Guarded = withWebgl(Scene, Fallback)

    render(<Guarded />)

    expect(screen.queryByText('scene')).not.toBeNull()
  })

  it('renders the fallback without any webgl context', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const Guarded = withWebgl(Scene, Fallback)

    render(<Guarded />)

    expect(screen.queryByText('fallback')).not.toBeNull()
  })
})
