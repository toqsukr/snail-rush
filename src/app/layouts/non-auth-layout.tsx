import { useUser } from '@entities/user'
import { useMenuMode } from '@features/menu'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

const NonAuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const user = useUser(s => s.user)
  const updateMenuMode = useMenuMode()

  if (user?.token) {
    updateMenuMode('main-menu')
    return <Navigate to={Routes.HOME} />
  }

  updateMenuMode('auth-username')

  return children
}

export default NonAuthLayout
