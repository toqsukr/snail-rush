import { FC, useEffect, useMemo, useState } from 'react'
import { CanvasTexture, LinearFilter, SRGBColorSpace, Vector3Tuple } from 'three'

const FONT_PX = 96
const PADDING = 24
const FONT = `800 ${FONT_PX}px "Jersey 25", Roboto, sans-serif`

/**
 * Player name baked into a canvas texture and hung above a snail as a sprite.
 */
export const NameLabel: FC<{
  text?: string
  position?: Vector3Tuple
  height?: number
}> = ({ text, position, height = 1.5 }) => {
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    let alive = true
    document.fonts
      .load(FONT)
      .then(() => alive && setFontReady(true))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const label = useMemo(() => {
    if (!text) return null
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return null
    context.font = FONT
    canvas.width = Math.ceil(context.measureText(text).width) + PADDING * 2
    canvas.height = Math.ceil(FONT_PX * 1.4)
    context.font = FONT
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = 'rgba(255, 255, 255, 0.8)'
    context.fillText(text, canvas.width / 2, canvas.height / 2)
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.generateMipmaps = false
    return { texture, aspect: canvas.width / canvas.height }
  }, [text, fontReady])

  useEffect(() => () => label?.texture.dispose(), [label])

  if (!label) return null

  return (
    <sprite position={position} scale={[height * label.aspect, height, 1]}>
      <spriteMaterial map={label.texture} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  )
}
