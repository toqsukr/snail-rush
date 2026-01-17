import { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useMenuMode } from '@features/menu'
import { resetSession, useSessionCode } from '@entities/session'
import { useToken } from '@shared/config/token'
import { Routes } from '@shared/model/routes'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const updateMenuMode = useMenuMode()
  const token = useToken(s => s.token)
  const deleteSession = useSessionCode(s => s.deleteSession)

  if (!token) {
    deleteSession()
    resetSession()
    updateMenuMode('auth-username')
    return <Navigate to={Routes.AUTH} />
  }

  updateMenuMode('main-menu')

  return children
}

export default AuthLayout
