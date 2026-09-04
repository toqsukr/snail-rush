import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../error-boundary'

const Broken = () => {
  throw new Error('render is broken')
}

describe('ErrorBoundary', () => {
  it('renders children while they dont throw', () => {
    render(
      <ErrorBoundary fallback={<span>fallback</span>}>
        <span>content</span>
      </ErrorBoundary>
    )

    expect(screen.queryByText('content')).not.toBeNull()
  })

  it('renders the fallback once a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<span>fallback</span>}>
        <Broken />
      </ErrorBoundary>
    )

    expect(screen.queryByText('fallback')).not.toBeNull()
  })
})
