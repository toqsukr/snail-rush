import { FC, PropsWithChildren } from 'react'

const LightLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ambientLight intensity={3} color='white' />
      <directionalLight intensity={3} position={[10, 10, 10]} castShadow />
      <directionalLight intensity={3} position={[-10, 10, -10]} castShadow />
      {children}
    </>
  )
}

export default LightLayout
