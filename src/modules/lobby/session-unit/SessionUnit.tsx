import { usePlayerData } from '@modules/player/store'
import { FC, ReactNode } from 'react'
import CreationUnit from '../creation-unit/CreationUnit'
import JoinUnit from '../join-unit/JoinUnit'
import { PlayerStatus } from '../type'
import { SessionUnitProp } from './SessionUnit.type'

const SessionUnit: FC<SessionUnitProp> = ({ status }) => {
  const { player_id } = usePlayerData()

  if (!player_id) return

  const content: Record<PlayerStatus, ReactNode> = {
    host: <CreationUnit playerID={player_id} />,
    joined: <JoinUnit playerID={player_id} />,
  }

  return content[status]
}

export default SessionUnit
