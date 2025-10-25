import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren, useRef, useState } from 'react'
import { Euler, Vector3 } from 'three'
import { createSnailStore, SnailStore } from '../model/store'

type SnailProviderProp = {
  initPosition?: Vector3
  initRotation?: Euler
}

type SnailContext = {
  getIsJumping: () => boolean
  updateIsJumping: (value: boolean) => void
} & SnailStore

export const SnailContext = createStrictContext<SnailContext>()

export const useSnailContext = () => useStrictContext(SnailContext)

export const SnailProvider: FC<PropsWithChildren<SnailProviderProp>> = ({
  children,
  initPosition = new Vector3(),
  initRotation = new Euler(),
}) => {
  const [useSnailStore] = useState(() => createSnailStore(initPosition, initRotation))
  const storeData = useSnailStore()

  const isJumping = useRef(false)
  const updateIsJumping = (value: boolean) => {
    isJumping.current = value
  }
  const getIsJumping = () => isJumping.current

  const value = {
    ...storeData,
    getIsJumping,
    updateIsJumping,
  }

  return <SnailContext.Provider value={value}>{children}</SnailContext.Provider>
}
