import { describe, expect, it } from 'vitest'
import { dismissToast, pushToast, useToastStore } from '../toast'

const texts = () => useToastStore.getState().toasts.map(toast => toast.text)

describe('toast store', () => {
  it('keeps a pushed message', () => {
    pushToast('server is on fire')

    expect(texts()).toContain('server is on fire')
  })

  it('drops a dismissed message', () => {
    pushToast('lobby is full')
    const shown = useToastStore.getState().toasts.find(toast => toast.text === 'lobby is full')!

    dismissToast(shown.id)

    expect(texts()).not.toContain('lobby is full')
  })

  it('cannot show the same message twice', () => {
    pushToast('token expired')
    pushToast('token expired')

    expect(texts().filter(text => text === 'token expired')).toHaveLength(1)
  })
})
