import { Logflow } from '@features/logflow'
import { useGameStore } from '@pages/home/model/store'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { FC, PropsWithChildren } from 'react'

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const started = useGameStore(s => s.started)
  return (
    <div className='h-full relative'>
      {started || <Logflow />}
      <Canvas>
        {/* <OrbitControls/> */}
        <Perf position='top-left' />
        <Physics gravity={[0, -20, 0]} timeStep={1 / 60}>
          {children}
        </Physics>
      </Canvas>
    </div>
  )
}

export default AppLayout
