import { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'
import { useToastStore } from '@shared/lib/toast'
import { notifyError, serverMessage } from '../error-toast'

const failure = (status: number, data: unknown) =>
  ({ response: { status, data } }) as AxiosError

const texts = () => useToastStore.getState().toasts.map(toast => toast.text)

describe('serverMessage', () => {
  it('takes the detail of a rejected request', () => {
    expect(serverMessage(failure(400, { detail: 'wrong session code' }))).toBe('wrong session code')
  })

  it('takes a plain text body', () => {
    expect(serverMessage(failure(500, 'gateway is down'))).toBe('gateway is down')
  })

  it('cannot invent a message for an empty body', () => {
    expect(serverMessage(failure(404, {}))).toBeNull()
  })

  it('cannot invent a message for an unreachable server', () => {
    expect(serverMessage({} as AxiosError)).toBeNull()
  })
})

describe('notifyError', () => {
  it('shows the server message of a failed request', async () => {
    await notifyError(failure(403, { detail: 'access denied' })).catch(() => {})

    expect(texts()).toContain('access denied')
  })

  it('rethrows the failure to the caller', async () => {
    await expect(notifyError(failure(418, { detail: 'i am a teapot' }))).rejects.toBeDefined()
  })
})
