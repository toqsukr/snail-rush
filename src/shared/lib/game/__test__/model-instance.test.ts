import { describe, expect, it } from 'vitest'
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three'
import { modelInstance } from '../model-instance'

const scene = () => {
  const root = new Group()
  root.add(new Mesh(new BoxGeometry(1, 2, 3), new MeshStandardMaterial()))
  return root
}

describe('modelInstance', () => {
  it('cannot share an instance with its source scene', () => {
    const source = scene()
    expect(
      modelInstance(source),
      'an instance cannot be the very object cached by the loader'
    ).not.toBe(source)
  })

  it('cannot hide an instance of a hidden scene', () => {
    const source = scene()
    source.visible = false
    expect(
      modelInstance(source).visible,
      'a scene hidden by a previous mount cannot hide the next instance'
    ).toBe(true)
  })

  it('cannot detach an instance from its source geometry', () => {
    const source = scene()
    expect(
      (modelInstance(source).children[0] as Mesh).geometry,
      'an instance cannot duplicate geometry it can share'
    ).toBe((source.children[0] as Mesh).geometry)
  })
})
