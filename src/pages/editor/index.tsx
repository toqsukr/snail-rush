import { grassMapData } from '@pages/home/ui/game-map'
import { Html, PerspectiveCamera } from '@react-three/drei'
import { ChangeSelectedOptions, GameMap } from '@shared/lib/game/map'
import { Floor } from '@shared/lib/three'
import { useState } from 'react'
import { Euler, Vector3 } from 'three'
import { useMapDataStore } from './store'

const EditorMap = () => {
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const { updateStone, ...mapData } = useMapDataStore()

  const handleChangeSelected = ({ name, position, rotation }: ChangeSelectedOptions) => {
    updateStone(name, position, rotation)
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(mapData))
    alert('Objects success copied!')
  }

  return (
    <>
      <Html>
        <button onClick={handleCopyClick}>COPY OBJECTS</button>
      </Html>
      <Floor />
      <PerspectiveCamera
        makeDefault
        position={new Vector3(40, 90, -38)}
        rotation={new Euler(-Math.PI / 2, 0, 0)}
      />
      <GameMap
        editable
        selectedName={selectedName}
        onChangeSelected={handleChangeSelected}
        updateSelectedName={value => setSelectedName(value)}
        isStarted
        onFinish={async () => {}}
        mapData={grassMapData}
      />
    </>
  )
}

export default EditorMap
