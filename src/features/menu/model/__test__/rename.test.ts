import { afterEach, describe, expect, it, vi } from 'vitest'
import { TUser } from '@entities/user'
import playerService, { PlayerDTO } from '@shared/api/player'
import { queryClient } from '@shared/api/query-client'
import { flushRename, rename } from '../rename'

const racer = (username: string) =>
  ({
    id: 'racer-7',
    username,
    skinID: 'shell-3',
    wins: 2,
    losses: 5,
    totalGames: 7,
    isReady: false,
  }) as unknown as TUser

const server = () =>
  vi.spyOn(playerService, 'updatePlayer').mockResolvedValue({} as unknown as PlayerDTO)

describe('rename of the local player', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    queryClient.clear()
  })

  it('cannot postpone the request past a flush', async () => {
    const updated = server()
    rename(racer('Hare'))
    await flushRename()
    expect(updated).toHaveBeenCalledWith({
      player_id: 'racer-7',
      username: 'Hare',
      skin_id: 'shell-3',
    })
  })

  it('cannot leave the lobby board on the old name', async () => {
    server()
    queryClient.setQueryData(['get-player-by-id', 'racer-7'], { username: 'Tortoise' })
    rename(racer('Hare'))
    await flushRename()
    expect(queryClient.getQueryState(['get-player-by-id', 'racer-7'])?.isInvalidated).toBe(true)
  })

  it('cannot leave the profile on the old name', async () => {
    server()
    queryClient.setQueryData(['get-user-data'], { username: 'Tortoise' })
    rename(racer('Hare'))
    await flushRename()
    expect(queryClient.getQueryState(['get-user-data'])?.isInvalidated).toBe(true)
  })

  it('cannot demand a flush when nothing is pending', async () => {
    const updated = server()
    await flushRename()
    expect(updated).not.toHaveBeenCalled()
  })
})
