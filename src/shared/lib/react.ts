import { Context, createContext, useContext, useRef } from 'react'

export function useStrictContext<T>(context: Context<T | null>) {
  const value = useContext(context)
  if (value === null) throw new Error('Strict context not passed')
  return value as T
}

export function createStrictContext<T>() {
  return createContext<T | null>(null)
}

export function useEventCallback<T extends (...args: any[]) => void>(fn: T): T {
  const ref = useRef<T>(fn)
  ref.current = fn
  return ((...args: any[]) => ref.current(...args)) as T
}
