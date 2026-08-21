import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { chopperPosition } from '../chopper-path'

const path: [Vector3, Vector3] = [new Vector3(0, 3, 0), new Vector3(10, 3, 0)]

describe('chopperPosition', () => {
  it('cannot stop a chopper short of its extreme point', () => {
    expect(
      chopperPosition(2, path, 5).x,
      'a chopper cannot fall short of the point it aims at'
    ).toBeCloseTo(10)
  })

  it('cannot break a chopper cycle', () => {
    expect(
      chopperPosition(4, path, 5).x,
      'a full cycle cannot leave a chopper away from its start'
    ).toBeCloseTo(0)
  })

  it('cannot turn a chopper around early', () => {
    expect(
      chopperPosition(3, path, 5).x,
      'a returning chopper cannot miss the middle of its path'
    ).toBeCloseTo(5)
  })

  it('cannot drift a chopper phase over a long race', () => {
    expect(
      chopperPosition(7.3, path, 5).distanceTo(chopperPosition(7.3 + 4, path, 5)),
      'equal phases of a race cannot place a chopper differently'
    ).toBeCloseTo(0)
  })

  it('cannot move a chopper before the race starts', () => {
    expect(
      chopperPosition(-1, path, 5).x,
      'a chopper cannot leave its start before a race begins'
    ).toBeCloseTo(0)
  })
})
