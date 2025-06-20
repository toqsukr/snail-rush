import { useUser } from '@entities/user'
import { useLobbyMenuDeps } from '@features/menu/deps'
import { useKickLobbyPlayer } from '@features/menu/model/use-kick-player'
import { FC } from 'react'
import { RxCross2 } from 'react-icons/rx'

const KickPlayerButton: FC<{ lobbyPlayerID: string }> = ({ lobbyPlayerID }) => {
  const kickPlayer = useKickLobbyPlayer()
  const { isHost, onKickPlayer } = useLobbyMenuDeps()
  const { data: user } = useUser()

  const kickClick = async () => {
    await kickPlayer(lobbyPlayerID)
    onKickPlayer(lobbyPlayerID)
  }

  if (!isHost(user?.id ?? '') || user?.id === lobbyPlayerID) return

  return <RxCross2 className='w-[18px] h-[18px]' onClick={kickClick} />
}

export default KickPlayerButton
