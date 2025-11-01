import { ReactThreeFiber } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'

export type DreiTextProps = JSX.IntrinsicElements['mesh'] & {
    children: React.ReactNode;
    characters?: string;
    color?: ReactThreeFiber.Color;
    fontSize?: number;
    fontWeight?: number | string;
    fontStyle?: 'italic' | 'normal';
    maxWidth?: number;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    font?: string;
    anchorX?: number | 'left' | 'center' | 'right';
    anchorY?: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom';
    clipRect?: [number, number, number, number];
    depthOffset?: number;
    direction?: 'auto' | 'ltr' | 'rtl';
    overflowWrap?: 'normal' | 'break-word';
    whiteSpace?: 'normal' | 'overflowWrap' | 'nowrap';
    outlineWidth?: number | string;
    outlineOffsetX?: number | string;
    outlineOffsetY?: number | string;
    outlineBlur?: number | string;
    outlineColor?: ReactThreeFiber.Color;
    outlineOpacity?: number;
    strokeWidth?: number | string;
    strokeColor?: ReactThreeFiber.Color;
    strokeOpacity?: number;
    fillOpacity?: number;
    sdfGlyphSize?: number;
    debugSDF?: boolean;
    onSync?: (troika: unknown) => void;
};

const LIGHT_POSITION = [5, 1, 0] satisfies [number, number, number]

export const Floor = () => {
  return (
    <RigidBody
      type='fixed'
      position={[30, -0.1, -30]}
      colliders='cuboid'
      rotation={[Math.PI / 2, 0, 0]}
      args={[250, 250, 250]}>
      <mesh>
        <ambientLight intensity={4} color='white' position={LIGHT_POSITION} />
        <directionalLight intensity={3} position={[10, 10, 10]} castShadow />
        {/* <directionalLight intensity={3} position={[-10, 10, -10]} castShadow /> */}
        <planeGeometry args={[250, 250, 250]} />
        <meshStandardMaterial color='black' />
      </mesh>
    </RigidBody>
  )
}
