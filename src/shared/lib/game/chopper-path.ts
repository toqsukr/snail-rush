import { Vector3 } from 'three'

export const chopperPosition = (elapsed: number, path: [Vector3, Vector3], speed: number) => {
  const span = path[0].distanceTo(path[1])
  if (span === 0 || elapsed <= 0) return path[0].clone()
  const travelled = (elapsed * speed) % (2 * span)
  const progress = travelled <= span ? travelled / span : (2 * span - travelled) / span
  return new Vector3().lerpVectors(path[0], path[1], progress)
}
