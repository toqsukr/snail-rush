import { MeshPhysicalMaterial, Texture } from 'three'
import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMaterial } from '../use-material'

const shell = () => ({ name: 'snail-shell', emissiveIntensity: 0.4 })

describe('useMaterial of a snail shell', () => {
  it('cannot rebuild the material while the texture holds still', () => {
    const map = new Texture()
    const source = shell()
    const { result, rerender } = renderHook(() => useMaterial(source, map))
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })

  it('cannot keep a material built for a dropped texture', () => {
    const source = shell()
    const { result, rerender } = renderHook(({ map }) => useMaterial(source, map), {
      initialProps: { map: new Texture() },
    })
    const first = result.current
    rerender({ map: new Texture() })
    expect(result.current).not.toBe(first)
  })

  it('cannot leak the material once the snail leaves', () => {
    const { result, unmount } = renderHook(() => useMaterial(shell(), new Texture()))
    const material = result.current as MeshPhysicalMaterial
    let disposed = false
    material.addEventListener('dispose', () => {
      disposed = true
    })
    unmount()
    expect(disposed).toBe(true)
  })

  it('cannot flip a texture the loader delivered upside down', () => {
    const map = new Texture()
    renderHook(() => useMaterial(shell(), map))
    expect(map.flipY).toBe(false)
  })
})
