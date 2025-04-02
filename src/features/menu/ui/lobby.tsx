import { useSession } from '@entities/session'
import { useUser } from '@entities/user'
import Input from '@shared/uikit/input/Input'
import { FC, useState } from 'react'
import { useMenuDeps } from '../deps'
import BackButton from './action-buttons/back-button'
import ConnectLobbyButton from './action-buttons/connect-lobby-button'
import DeleteLobbyButton from './action-buttons/delete-lobby-button'
import DisconnectButton from './action-buttons/disconnect-button'
import PlayGameButton from './action-buttons/play-game-button'
import LobbyBoard from './lobby-board/lobby-board'

export const Lobby = () => {
  const session = useSession(s => s.session)
  const user = useUser(s => s.user)
  const { isHost } = useMenuDeps()

  if (isHost(user?.id ?? '') && session) return <HostLobby sessionID={session.id} />

  if (session) return <JoinLobbyConnected />

  return <JoinLobby />
}

const HostLobby: FC<{ sessionID: string }> = ({ sessionID }) => {
  return (
    <>
      <h1>Let your friend connect by code: {sessionID}</h1>
      <LobbyBoard />
      <PlayGameButton />
      <DeleteLobbyButton />
      <BackButton />
    </>
  )
}

const JoinLobby = () => {
  const [lobbyCode, setLobbyCode] = useState('')

  return (
    <>
      <Input value={lobbyCode} onChange={e => setLobbyCode(e.currentTarget.value)} />
      <ConnectLobbyButton lobbyCode={lobbyCode} disabled={lobbyCode.length !== 4} />
      <BackButton />
    </>
  )
}

const JoinLobbyConnected = () => {
  return (
    <>
      <LobbyBoard />
      <DisconnectButton />
    </>
  )
}
