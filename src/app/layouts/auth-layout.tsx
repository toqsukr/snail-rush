import { useSession } from '@entities/session'
import { useMenuMode } from '@features/menu'
import { useToken } from '@shared/config/token'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const updateMenuMode = useMenuMode()
  const token = useToken(s => s.token)
  const deleteSession = useSession(s => s.deleteSession)

  if (!token) {
    deleteSession()
    updateMenuMode('auth-username')
    return <Navigate to={Routes.AUTH} />
  }

  updateMenuMode('main-menu')

  return children
}

export default AuthLayout
