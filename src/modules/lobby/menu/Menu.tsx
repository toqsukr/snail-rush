import { queryClient } from '@modules/app/api'
import { useLobby } from '@modules/lobby/store'
import NameInput3D from '@modules/player/name-input/NameInput'
import { Html } from '@react-three/drei'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'
import { useAppState } from '../../gameplay/store'
import CreationUnit from '../creation-unit/CreationUnit'
import JoinUnit from '../join-unit/JoinUnit'
import MainUnit from '../main-unit/MainUnit'
import { PlayerStatus } from '../type'
import css from './Menu.module.scss'

const Menu: FC<{ handleStart: () => void }> = ({ handleStart }) => {
  const { onGameStart } = useAppState()
  const { status } = useLobby()

  const handleClick = () => {
    handleStart()
    onGameStart()
  }

  const content: Record<PlayerStatus, ReactNode> = {
    host: <CreationUnit handleStart={handleClick} />,
    joined: <JoinUnit handleStart={handleClick} />,
  }

  return (
    <Html position={[0, 18, -4]} rotation={[0, Math.PI, 0]} occlude='raycast' transform>
      <QueryClientProvider client={queryClient}>
        <div className={css.menu}>
          <NameInput3D />
          {status ? content[status] : <MainUnit />}
        </div>
      </QueryClientProvider>
    </Html>
  )
}

export default Menu
