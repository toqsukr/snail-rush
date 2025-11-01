import { grassMapData } from '@pages/home/ui/game-map'
import { GameMap } from '@shared/lib/game/map'
import { Floor } from '@shared/lib/three'

const EditorMap = () => {
  return (
    <>
      <Floor />
      <GameMap onFinish={async () => {}} mapData={grassMapData} />
    </>
  )
}

export default EditorMap
