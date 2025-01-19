import { FC } from 'react'
import MainUnit from '../main-unit/MainUnit'
import SessionUnit from '../session-unit/SessionUnit'
import { useLobby } from '../store'

const MainMenu: FC<{ handleClickPlay: () => void }> = ({ handleClickPlay }) => {
  const { status } = useLobby()

  if (!status) return <MainUnit />

  return <SessionUnit status={status} handleClickPlay={handleClickPlay} />
}

export default MainMenu
