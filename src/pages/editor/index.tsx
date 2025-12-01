import { grassMapData } from '@pages/home/ui/game-map'
import { PerspectiveCamera, TransformControls } from '@react-three/drei'
import { GameMap } from '@shared/lib/game/map'
import { Floor } from '@shared/lib/three'
import { Euler, Vector3 } from 'three'

const EditorMap = () => {
  return (
    <>
      <Floor />

      <TransformControls mode='translate' />
      <PerspectiveCamera
        makeDefault
        position={new Vector3(40, 90, -38)}
        rotation={new Euler(-Math.PI / 2, 0, 0)}
      />
      <GameMap isStarted onFinish={async () => {}} mapData={grassMapData} />
    </>
  )
}

export default EditorMap
