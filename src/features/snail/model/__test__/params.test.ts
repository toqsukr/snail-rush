import { describe, expect, it } from 'vitest'
import { useSnailParams } from '../params'

describe('useSnailParams', () => {
  it('cannot ship a hair trigger collision cooldown', () => {
    expect(
      useSnailParams.getState().collisionCooldown,
      'collision cooldown cannot stay a hair trigger'
    ).toBe(400)
  })
})
