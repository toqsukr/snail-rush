import { FC } from 'react'
import MainUnit from '../main-unit/MainUnit'
import SessionUnit from '../session-unit/SessionUnit'
import { useLobby } from '../store'

const Menu: FC<{ handleClickPlay: () => void }> = ({ handleClickPlay }) => {
  const { status } = useLobby()

  if (!status)
    return (
      <>
        <MainUnit />
        <button onClick={handleClickPlay}>PLAY</button>
      </>
    )

  return <SessionUnit status={status} handleClickPlay={handleClickPlay} />
}

export default Menu
