import { ComponentType, FC, useState } from 'react'

export const hasWebgl = (canvas: HTMLCanvasElement): boolean => {
  try {
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export const useWebglSupport = (): boolean =>
  useState(() => hasWebgl(document.createElement('canvas')))[0]

/**
 * Guards a subtree that needs a rendering context: hands the browser the
 * fallback instead of the scene once WebGL is unavailable.
 */
export const withWebgl = <P extends object>(
  Scene: ComponentType<P>,
  Fallback: ComponentType
): FC<P> => {
  const Guarded: FC<P> = props => {
    if (!useWebglSupport()) return <Fallback />
    return <Scene {...props} />
  }
  Guarded.displayName = `withWebgl(${Scene.displayName || Scene.name})`
  return Guarded
}
