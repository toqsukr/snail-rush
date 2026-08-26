export type CountdownPhase = 'pending' | 'running' | 'done'

export type CountdownState = {
  phase: CountdownPhase
  elapsed: number
  remaining: number
}

/**
 * Position of a countdown against the shared instant every client anchors to.
 * A client reaching the deadline late gets the truncated remainder rather than
 * a fresh countdown, so both racers are released at the very same moment.
 */
export const countdownState = (now: number, startAt: number, duration: number): CountdownState => {
  const elapsed = now - startAt
  if (elapsed < 0) return { phase: 'pending', elapsed: 0, remaining: duration }
  if (elapsed >= duration) return { phase: 'done', elapsed: duration, remaining: 0 }
  return { phase: 'running', elapsed, remaining: duration - elapsed }
}
