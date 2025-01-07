import { MutationKeys } from '@modules/app/type.d'
import { useIsMutating } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'

const LoadingLayout: FC<PropsWithChildren> = ({ children }) => {
  const isPlayerCreating = useIsMutating({ mutationKey: [MutationKeys.CREATE_PLAYER] })
  const isSessionCreating = useIsMutating({
    mutationKey: [MutationKeys.CREATE_SESSION],
  })
  const isSessionDeleting = useIsMutating({
    mutationKey: [MutationKeys.DELETE_SESSION],
  })
  const isSessionConnecting = useIsMutating({
    mutationKey: [MutationKeys.CONNECT_SESSION],
  })
  const isPlayerKicking = useIsMutating({
    mutationKey: [MutationKeys.KICK_PLAYER],
  })

  if (
    !!isSessionConnecting ||
    !!isPlayerCreating ||
    !!isSessionCreating ||
    !!isSessionDeleting ||
    !!isPlayerKicking
  )
    return <div>Loading...</div>

  return children
}

export default LoadingLayout
