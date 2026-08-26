import { describe, expect, it } from 'vitest'
import { countdownState } from '../countdown-state'

const deadline = 10_000
const duration = 3_000

describe('countdownState', () => {
  it('cannot run a countdown before its deadline', () => {
    expect(
      countdownState(deadline - 500, deadline, duration).phase,
      'a countdown cannot run while the race lead is still going'
    ).toBe('pending')
  })

  it('cannot misplace a countdown inside its window', () => {
    expect(
      countdownState(deadline + 1_200, deadline, duration).elapsed,
      'a countdown cannot forget how much of it is already gone'
    ).toBe(1_200)
  })

  it('cannot restart a countdown for a late client', () => {
    expect(
      countdownState(deadline + 2_000, deadline, duration).remaining,
      'a client joining late cannot be granted the whole countdown again'
    ).toBe(1_000)
  })

  it('cannot hold a client after the countdown is spent', () => {
    expect(
      countdownState(deadline + duration, deadline, duration).phase,
      'a countdown cannot outlive the instant it releases the racers'
    ).toBe('done')
  })

  it('cannot stretch a countdown past its duration', () => {
    expect(
      countdownState(deadline + 9_000, deadline, duration).elapsed,
      'a countdown cannot report more elapsed time than it lasts'
    ).toBe(duration)
  })
})
