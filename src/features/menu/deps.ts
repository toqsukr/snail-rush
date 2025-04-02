import { TUser } from '@entities/user'
import { createStrictContext, useStrictContext } from '@shared/lib/react'

type MenuDeps = {
  onPlay: () => void
  onPause: () => void
  onContinue: () => void
  isHost: (playerID: string) => boolean
  getUserByID: (userID: string) => TUser
}

export const menuDepsContext = createStrictContext<MenuDeps>()

export const useMenuDeps = () => useStrictContext(menuDepsContext)
