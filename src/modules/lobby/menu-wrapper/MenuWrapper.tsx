import { queryClient } from '@modules/app/api'
import { useAppState } from '@modules/gameplay/store'
import { Html } from '@react-three/drei'
import LoadingLayout from '@shared/loading-layout/LoadingLayout'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'
import Menu from '../menu/Menu'
import css from './MenuWrapper.module.scss'

const MenuWrapper: FC<{ handleStart: () => void }> = ({ handleStart }) => {
  const { onGameStart } = useAppState()

  const handleClickPlay = () => {
    handleStart()
    onGameStart()
  }

  return (
    <Html position={[0, 18, -4]} rotation={[0, Math.PI, 0]} occlude='raycast' transform>
      <QueryClientProvider client={queryClient}>
        <div className={css.menu}>
          <LoadingLayout>
            <Menu handleClickPlay={handleClickPlay} />
          </LoadingLayout>
        </div>
      </QueryClientProvider>
    </Html>
  )
}

export default MenuWrapper
