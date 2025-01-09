import { usePlayerData } from '@modules/player/store'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { DirectionalLight, Object3D, Object3DEventMap } from 'three'
import Player from '../player/Player'
import { IlluminatedPlayerProp } from './IlluminatedPlayer.type'

const IlluminatedPlayer = forwardRef<Object3D<Object3DEventMap>, IlluminatedPlayerProp>(
  (props, ref) => {
    const modelRef = useRef<Object3D>(null)
    const { player_id } = usePlayerData()

    useImperativeHandle(ref, () => modelRef.current as Object3D)

    const lightRef = useRef<DirectionalLight>(null)

    if (!player_id) return

    return (
      <>
        <directionalLight
          ref={lightRef}
          position={[0, 1, -1]}
          intensity={6}
          lookAt={() => modelRef?.current?.position}
        />
        <Player {...props} playerID={player_id} ref={modelRef} />
      </>
    )
  }
)

export default IlluminatedPlayer
