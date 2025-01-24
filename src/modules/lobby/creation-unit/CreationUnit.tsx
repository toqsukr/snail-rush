import { webSocketContext } from '@modules/app/websocket-provider/WebSocketProvider'
import { useAppState } from '@modules/gameplay/store'
import { usePlayerData } from '@modules/player/store'
import { useDeleteSession } from '@modules/session/model/hooks/useDeleteSession'
import { useSession } from '@modules/session/store'
import Menu from '@shared/menu/Menu'
import { FC, useContext } from 'react'
import LobbyUnit from '../lobby-unit/LobbyUnit'
import { useLobby } from '../store'

const CreationUnit: FC<{ playerID: string }> = ({ playerID }) => {
  const { username } = usePlayerData()
  const { session } = useSession()
  const { onClickBack } = useLobby()
  const { deleteSession } = useDeleteSession()
  const { onGameStart } = useAppState()
  const webSocketActions = useContext(webSocketContext)

  if (!session) return

  const handleStart = () => {
    console.log(webSocketActions)
    webSocketActions?.sendStartGame(playerID)
    onGameStart()
  }

  const handleBack = () => {
    deleteSession(session.session_id)
    onClickBack()
  }

  return (
    <Menu>
      <h1>Let your friend connect by code: {session?.session_id}</h1>
      <LobbyUnit />
      <Menu.Button disabled={session.players.length - 2 < 0} onClick={handleStart}>
        PLAY
      </Menu.Button>
      <Menu.Button disabled={!username} onClick={handleBack}>
        DELETE LOBBY
      </Menu.Button>
      <Menu.Button onClick={onClickBack}>BACK</Menu.Button>
    </Menu>
  )
}

export default CreationUnit
