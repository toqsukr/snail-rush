import { TrackingCamera } from '@features/tracking-camera'
import { Floor } from '@shared/lib/three'
import { LIGHT_POSITION } from './model/constants'
import CountdownWithDeps from './ui/countdown-with-deps'
import MainMenu from './ui/main-menu'
import OpponentSuspense from './ui/opponent-snail'

const HomePage = () => {
  return (
    <>
      <TrackingCamera />
      <OpponentSuspense />
      <CountdownWithDeps />
      <MainMenu />
      <Floor />
      <ambientLight position={LIGHT_POSITION} intensity={1} />
    </>
  )
}

export default HomePage
