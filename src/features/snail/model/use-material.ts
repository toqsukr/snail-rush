import { useEffect, useMemo } from 'react'
import { MeshPhysicalMaterial, Texture } from 'three'

export const useMaterial = (source: object, map: Texture) => {
  const material = useMemo(() => {
    map.flipY = false
    map.colorSpace = 'srgb'
    return new MeshPhysicalMaterial({
      ...source,
      map,
      color: 0xaaaaaa,
      metalness: 0.1,
      roughness: 0.1,
    })
  }, [source, map])
  useEffect(() => () => material.dispose(), [material])
  return material
}
