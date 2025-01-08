import { FC, ReactNode } from 'react'
import CreationUnit from '../creation-unit/CreationUnit'
import JoinUnit from '../join-unit/JoinUnit'
import { PlayerStatus } from '../type'

const SessionUnit: FC<{ status: PlayerStatus; handleClickPlay: () => void }> = ({
  status,
  handleClickPlay,
}) => {
  const content: Record<PlayerStatus, ReactNode> = {
    host: <CreationUnit handleStart={handleClickPlay} />,
    joined: <JoinUnit handleClickPlay={handleClickPlay} />,
  }

  return content[status]
}

export default SessionUnit
