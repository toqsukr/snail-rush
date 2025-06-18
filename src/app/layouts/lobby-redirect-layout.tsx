import { useSession } from '@entities/session'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LobbyRedirectLayout: FC<PropsWithChildren> = ({ children }) => {
  const session = useSession(s => s.session)
  const navigate = useNavigate()

  useEffect(() => {
    if (!!session) {
      navigate(Routes.LOBBY)
    }
  }, [session])

  return children
}

export default LobbyRedirectLayout
