import { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useMenuMode } from '@features/menu'
import { useToken } from '@shared/config/token'
import { Routes } from '@shared/model/routes'

const NonAuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const updateMenuMode = useMenuMode()
  const token = useToken(s => s.token)

  if (token) {
    updateMenuMode('main-menu')
    return <Navigate to={Routes.HOME} />
  }

  updateMenuMode('auth-username')

  return children
}

export default NonAuthLayout
