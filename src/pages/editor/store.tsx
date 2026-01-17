import { create } from 'zustand'
import { EulerTuple, Vector3Tuple } from 'three'
import { grassMapData } from '@widgets/game-map'
import { MapData, MapObject } from '@shared/lib/game/map'

type MapDataStore = MapData & {
  updateStone: (name: string, position: Vector3Tuple, rotation: EulerTuple) => void
}

const getNewStoneObject = (
  name: string,
  type: Exclude<keyof MapDataStore['obstacle'], 'chopper'>,
  mapData: MapDataStore,
  position: Vector3Tuple,
  rotation: EulerTuple,
) => {
  const obstacle = mapData.obstacle

  const stone = obstacle[type] as {
    items: MapObject[]
    modelPath: string
  }

  return {
    ...mapData,
    obstacle: {
      ...obstacle,
      [type]: {
        ...stone,
        items: (mapData.obstacle[type]?.items ?? []).map(stone =>
          stone.name === name ? { ...stone, position, rotation } : stone,
        ),
      },
    },
  }
}

export const useMapDataStore = create<MapDataStore>((set, get) => ({
  ...grassMapData,
  updateStone: (name, position, rotation) => {
    const mapData = get()

    if (!mapData) return

    if (name.includes('smallStone')) {
      set(getNewStoneObject(name, 'smallStone', mapData, position, rotation))
    } else if (name.includes('bigStone')) {
      set(getNewStoneObject(name, 'bigStone', mapData, position, rotation))
    } else if (name.includes('stone-')) {
      set(getNewStoneObject(name, 'stone', mapData, position, rotation))
    }
  },
}))
