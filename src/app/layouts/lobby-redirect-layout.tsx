import { useSession } from '@entities/session'
import { Routes } from '@shared/model/routes'
import { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LobbyRedirectLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (session) {
      navigate(Routes.LOBBY)
    }
  }, [session, navigate])

  return children
}

export default LobbyRedirectLayout
