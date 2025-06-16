import { useUser } from '@entities/user'
import { useMenuMode } from '@features/menu'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const user = useUser(s => s.user)
  const updateMenuMode = useMenuMode()

  if (!user?.token) {
    updateMenuMode('auth-username')
    return <Navigate to={Routes.AUTH} />
  }

  updateMenuMode('main-menu')

  return children
}

export default AuthLayout
