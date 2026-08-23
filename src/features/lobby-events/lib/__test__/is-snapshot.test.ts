import { describe, expect, it } from 'vitest'
import { BOUNCE_HOLD_TIME } from '../is-bounce'
import { isSnapshot, SNAPSHOT_HOLD_TIME } from '../is-snapshot'

describe('isSnapshot', () => {
  it('cannot mistake a held jump for a snapshot', () => {
    expect(isSnapshot({ hold_time: 320 }), 'a held jump cannot arrive as a snapshot').toBe(false)
  })

  it('cannot mistake a bounce for a snapshot', () => {
    expect(
      isSnapshot({ hold_time: BOUNCE_HOLD_TIME }),
      'a bounce cannot arrive as a snapshot'
    ).toBe(false)
  })

  it('cannot miss a snapshot the server relayed whole', () => {
    expect(
      isSnapshot({ hold_time: SNAPSHOT_HOLD_TIME, snapshot: true }),
      'a relayed flag cannot leave a snapshot unrecognised'
    ).toBe(true)
  })

  it('cannot miss a snapshot whose flag the server dropped', () => {
    expect(
      isSnapshot({ hold_time: SNAPSHOT_HOLD_TIME }),
      'a stripped flag cannot leave a snapshot unrecognised'
    ).toBe(true)
  })

  it('cannot miss a snapshot whose hold time the server clamped', () => {
    expect(
      isSnapshot({ hold_time: 0, snapshot: true }),
      'a clamped hold time cannot leave a snapshot unrecognised'
    ).toBe(true)
  })
})
