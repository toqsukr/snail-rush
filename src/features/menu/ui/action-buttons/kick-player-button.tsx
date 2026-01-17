import { FC } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useUser } from '@entities/user'
import { useLobbyMenuDeps } from '../../../menu/deps'
import { useKickLobbyPlayer } from '../../../menu/model/use-kick-player'

const KickPlayerButton: FC<{ lobbyPlayerID: string }> = ({ lobbyPlayerID }) => {
  const kickPlayer = useKickLobbyPlayer()
  const { isHost, onKickPlayer } = useLobbyMenuDeps()
  const { data: user } = useUser()

  const kickClick = async () => {
    await kickPlayer(lobbyPlayerID)
    onKickPlayer(lobbyPlayerID)
  }

  if (!isHost(user?.id ?? '') || user?.id === lobbyPlayerID) return

  return (
    <button className='focus-visible:text-[var(--primary-color)]'>
      <RxCross2 className='w-[18px] h-[18px]' onClick={kickClick} />
    </button>
  )
}

export default KickPlayerButton
