import { createStrictContext, useStrictContext } from '@shared/lib/react'
import { FC, PropsWithChildren, useRef, useState } from 'react'
import { Euler, Vector3 } from 'three'
import { createSnailStore, SnailStore } from '../model/store'

type SnailProviderProp = {
  initPosition?: Vector3
  initRotation?: Euler
}

type SnailContext = {
  getPosition: () => Vector3
  updatePosition: (value: Vector3) => void
  getIsJumping: () => boolean
  updateIsJumping: (value: boolean) => void
} & SnailStore

export const SnailContext = createStrictContext<SnailContext>()

export const useSnailContext = () => useStrictContext(SnailContext)

export const SnailProvider: FC<PropsWithChildren<SnailProviderProp>> = ({
  children,
  initRotation = new Euler(),
  initPosition = new Vector3(),
}) => {
  const [useSnailStore] = useState(() => createSnailStore(initRotation))
  const storeData = useSnailStore()

  const positionRef = useRef(initPosition)
  const updatePosition = (value: Vector3) => {
    positionRef.current = value
  }
  const getPosition = () => positionRef.current

  const isJumping = useRef(false)
  const updateIsJumping = (value: boolean) => {
    isJumping.current = value
  }
  const getIsJumping = () => isJumping.current

  const value = {
    ...storeData,
    getIsJumping,
    updateIsJumping,
    getPosition,
    updatePosition,
  }

  return <SnailContext.Provider value={value}>{children}</SnailContext.Provider>
}
