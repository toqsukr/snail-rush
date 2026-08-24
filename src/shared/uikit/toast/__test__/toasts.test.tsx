import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { pushToast, useToastStore } from '@shared/lib/toast'
import { Toasts } from '../toasts'

const texts = () => useToastStore.getState().toasts.map(toast => toast.text)

describe('Toasts', () => {
  it('shows a pushed message', () => {
    pushToast('map is unavailable')

    render(<Toasts />)

    expect(screen.queryByText('map is unavailable')).not.toBeNull()
  })

  it('drops a message clicked away', () => {
    pushToast('opponent has left')
    render(<Toasts />)

    fireEvent.click(screen.getByText('opponent has left'))

    expect(texts()).not.toContain('opponent has left')
  })
})
