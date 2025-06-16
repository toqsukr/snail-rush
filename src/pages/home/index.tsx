import { useSkinById } from '@entities/skin/query'
import { useUser } from '@entities/user'
import { Snail, snailDepsContext, SnailProvider } from '@features/snail'
import { TrackingCamera } from '@features/tracking-camera'
import { RigidBody } from '@react-three/rapier'
import { Floor } from '@shared/lib/three'
import { Suspense } from 'react'
import {
  LIGHT_POSITION,
  MAX_SPACE_HOLD_TIME,
  SKIN_SNAIL_POSITION,
  SKIN_SNAIL_ROTATION,
  STUN_TIMEOUT,
} from '../../app/constants'
import { getTexturePath, PlayerSkins } from './lib/status'
import CountdownWithDeps from './ui/countdown-with-deps'
import MainMenu from './ui/main-menu'
import OpponentSuspense from './ui/opponent-snail'
import SkinMenu from './ui/skin-menu'

const HomePage = () => {
  const user = useUser(s => s.user)
  const { data: skin } = useSkinById(user?.skinID ?? '')

  const texturePath = getTexturePath(skin?.name.split('.')[0] ?? PlayerSkins.HERBIVORE)

  return (
    <>
      <TrackingCamera />
      <OpponentSuspense />
      <CountdownWithDeps />
      <MainMenu />
      <Suspense>
        <snailDepsContext.Provider
          value={{
            texturePath,
            onCollision: () => {},
            stunTimeout: STUN_TIMEOUT,
            shouldHandleCollision: () => false,
            shrinkDuration: MAX_SPACE_HOLD_TIME,
          }}>
          <SnailProvider initPosition={SKIN_SNAIL_POSITION} initRotation={SKIN_SNAIL_ROTATION}>
            <Snail />
          </SnailProvider>
        </snailDepsContext.Provider>
      </Suspense>
      <RigidBody
        type='fixed'
        position={[SKIN_SNAIL_POSITION[0], SKIN_SNAIL_POSITION[1] - 10, SKIN_SNAIL_POSITION[2]]}
        colliders='cuboid'
        rotation={[-Math.PI / 2, 0, 0]}
        args={[5, 5, 5]}>
        <mesh>
          <planeGeometry args={[5, 5, 5]} />
          <meshStandardMaterial color='gray' />
        </mesh>
      </RigidBody>
      <SkinMenu />
      <Floor />
      <ambientLight position={LIGHT_POSITION} intensity={1} />
    </>
  )
}

export default HomePage
