import { useUser } from '@entities/user'
import { useMenuDeps } from '@features/menu/deps'
import { useKickLobbyPlayer } from '@features/menu/model/use-kick-player'
import { FC } from 'react'
import { RxCross2 } from 'react-icons/rx'

const KickPlayerButton: FC<{ lobbyPlayerID: string }> = ({ lobbyPlayerID }) => {
  const kickPlayer = useKickLobbyPlayer()
  const { isHost } = useMenuDeps()
  const user = useUser(s => s.user)

  if (!isHost(user?.id ?? '') || user?.id === lobbyPlayerID) return

  return <RxCross2 onClick={() => kickPlayer(lobbyPlayerID)} />
}

export default KickPlayerButton
