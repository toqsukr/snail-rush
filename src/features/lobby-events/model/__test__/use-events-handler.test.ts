import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEventsHandler } from '../use-events-handler'
import { Operations } from '../types'

vi.mock('@entities/players', () => ({ parseFromPlayerDTO: vi.fn() }))

vi.mock('@entities/session', () => ({
  invalidateSession: vi.fn(),
  resetSession: vi.fn(),
  useSessionCode: vi.fn().mockReturnValue(vi.fn()),
}))

vi.mock('@entities/user', () => ({ useUser: vi.fn().mockReturnValue({ data: { id: 'me' } }) }))

const rotationOf = (actorID: string) =>
  ({
    data: JSON.stringify({
      type: Operations.PLAYER_ROTATION,
      data: {
        actor_id: actorID,
        timestamp: 1,
        session: {
          host_id: 'me',
          is_active: true,
          session_id: 'session',
          players: [],
          score: {},
        },
        rotation: { roll: 0, pitch: 1, yaw: 0, duration: 0 },
      },
    }),
  }) as MessageEvent

describe('useEventsHandler of a relayed rotation', () => {
  it('cannot replay a rotation the client itself authored', () => {
    const onChangeOpponentRotation = vi.fn()

    const { result } = renderHook(() => useEventsHandler({ onChangeOpponentRotation }))
    result.current(rotationOf('me'), vi.fn())

    expect(
      onChangeOpponentRotation,
      'an event echoed back to its author cannot turn the opponent snail'
    ).not.toHaveBeenCalled()
  })

  it('cannot drop a rotation the opponent authored', () => {
    const onChangeOpponentRotation = vi.fn()

    const { result } = renderHook(() => useEventsHandler({ onChangeOpponentRotation }))
    result.current(rotationOf('rival'), vi.fn())

    expect(
      onChangeOpponentRotation,
      'an opponent turn cannot be mistaken for an echo'
    ).toHaveBeenCalledWith({ rotation: { roll: 0, pitch: 1, yaw: 0, duration: 0 } })
  })
})
