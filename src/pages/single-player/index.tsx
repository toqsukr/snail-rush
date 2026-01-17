import { useEffect } from 'react'
import { grassMapData } from '@widgets/game-map'
import { TrackCameraProvider, TrackingCamera } from '@features/tracking-camera'
import { useGameStore } from '@features/game'
import { Floor } from '@shared/lib/three'
import { GameMap } from '@shared/lib/game/map'
import PlayerSuspense from './player-snail'

const SinglePlayerPage = () => {
  const { playerModelHandle, updateMoveable } = useGameStore()

  useEffect(() => {
    updateMoveable(true)
  }, [updateMoveable])

  return (
    <TrackCameraProvider
      isFollowTarget
      initPosition={[0, 0, 0]}
      initRotation={[0, 0, 0]}
      targetHandle={playerModelHandle}>
      <PlayerSuspense />
      <TrackingCamera />
      <GameMap isStarted={true} mapData={grassMapData} onFinish={async () => {}} />
      <Floor />
    </TrackCameraProvider>
  )
}

export default SinglePlayerPage
