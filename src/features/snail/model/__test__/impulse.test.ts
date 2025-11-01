import { afterAll, beforeAll, describe, it, vi, expect } from 'vitest'
import { calculateImpulse } from '../impulse'
import { Euler, Vector3 } from 'three'

vi.mock('../constants', () => ({
  IMPULSE_MULTIPLIER: 10
}))

describe('calculateImpulse', () => {
  const rotation = new Euler()

  beforeAll(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })
  
  it('positive koef', () => {
    const koef = 1
    const expectedImpulse = new Vector3(0, 0, 10)
    
    const impulse = calculateImpulse(rotation, koef)

    expect(impulse).toEqual(expectedImpulse)
  })

  it('zero koef', () => {
    const koef = 0
    const expectedImpulse = new Vector3(0, 0, 0)
    
    const impulse = calculateImpulse(rotation, koef)

    expect(impulse).toEqual(expectedImpulse)
  })

  it('negative koef', () => {
    const koef = -1
    const expectedImpulse = new Vector3(0, 0, -10)
    
    const impulse = calculateImpulse(rotation, koef)

    expect(impulse).toEqual(expectedImpulse)
  })
})