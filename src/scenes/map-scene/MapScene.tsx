import FinishLine from '@objects/environment/finish/FinishLine'
import GrassMap from '@objects/environment/maps/grass-map/GrassMap'
import GrassWalls from '@objects/environment/maps/grass-map/GrassWalls'
import Stone from '@objects/environment/obstacles/stone/Stone'
import StartLine from '@objects/environment/start/StartLine'
import { stones } from './map.data'

const MapScene = () => {
  const startProps = {
    position: [3, 0.1, 4],
    rotation: [0, Math.PI / 2, 0],
  }

  const finishProps = {
    position: [-35, 0.1, -4],
    rotation: [0, Math.PI / 2.8, 0],
  }

  return (
    <>
      <GrassMap />
      <GrassWalls />
      <StartLine {...startProps} />
      <FinishLine {...finishProps} />
      {stones.map((position, index) => (
        <Stone key={index} position={position} />
      ))}
    </>
  )
}

export default MapScene
