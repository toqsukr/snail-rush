import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useState } from 'react'

import { useControlTools } from '@features/player-control'
import { useSnailTools } from '@features/snail'
import { useRegisterTools } from '@shared/lib/devtools'

export const DevScene = () => {
  const [orbit, setOrbit] = useState(false)
  const [perf, setPerf] = useState(false)

  useRegisterTools([
    { type: 'toggle', name: 'OrbitControls', value: orbit, onChange: setOrbit },
    { type: 'toggle', name: 'Perf', value: perf, onChange: setPerf },
  ])
  useControlTools()
  useSnailTools()

  return (
    <>
      {orbit && <OrbitControls />}
      {perf && <Perf position='top-left' />}
    </>
  )
}
