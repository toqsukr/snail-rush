import MainUnit from '../main-unit/MainUnit'
import SessionUnit from '../session-unit/SessionUnit'
import { useLobby } from '../store'

const MainMenu = () => {
  const { status } = useLobby()

  if (!status) return <MainUnit />

  return <SessionUnit status={status} />
}

export default MainMenu
