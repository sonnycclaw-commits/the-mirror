
import { Canvas } from '@react-three/fiber'
import { FluidFog } from './FluidFog'
import { GalaxyField } from './GalaxyField'
import { Suspense } from 'react'
import { Preload } from '@react-three/drei'

export function TheVoid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]} // Clamp resolution for performance
        camera={{ position: [0, 0, 1] }}
        resize={{ scroll: false }}
        gl={{ antialias: false, alpha: false }}
      >
        <Suspense fallback={null}>
          <FluidFog />
          <GalaxyField />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
