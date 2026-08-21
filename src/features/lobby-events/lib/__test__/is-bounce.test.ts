import { describe, expect, it } from 'vitest'
import { BOUNCE_HOLD_TIME, isBounce } from '../is-bounce'

describe('isBounce', () => {
  it('cannot mistake a held jump for a bounce', () => {
    expect(
      isBounce({ hold_time: 320 }),
      'a held jump cannot arrive as a bounce'
    ).toBe(false)
  })

  it('cannot miss a bounce the server relayed whole', () => {
    expect(
      isBounce({ hold_time: BOUNCE_HOLD_TIME, bounced: true }),
      'a relayed flag cannot leave a bounce unrecognised'
    ).toBe(true)
  })

  it('cannot miss a bounce whose flag the server dropped', () => {
    expect(
      isBounce({ hold_time: BOUNCE_HOLD_TIME }),
      'a stripped flag cannot leave a bounce unrecognised'
    ).toBe(true)
  })

  it('cannot miss a bounce whose hold time the server clamped', () => {
    expect(
      isBounce({ hold_time: 0, bounced: true }),
      'a clamped hold time cannot leave a bounce unrecognised'
    ).toBe(true)
  })
})
