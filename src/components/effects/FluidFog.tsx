import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, Vector2, Mesh, ShaderMaterial } from 'three'
import { fogVertexShader, fogFragmentShader } from '@/lib/shaders/fog'
import { useSimulation } from '@/lib/stores/simulation'

export function FluidFog() {
  const mesh = useRef<Mesh>(null)
  const { size, viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uResolution: { value: new Vector2(size.width, size.height) },
      uColor1: { value: new Color('#0D1117') }, // Twilight-900
      uColor2: { value: new Color('#161B22') }, // Twilight-800
      uIntensity: { value: 1.0 },
      uChaos: { value: 0.0 },
      uSuction: { value: 0.0 }
    }),
    []
  )

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as ShaderMaterial
      if (material.uniforms.uTime) {
        material.uniforms.uTime.value = state.clock.getElapsedTime()
      }

      // Sync with global simulation state
      const { chaos, suction } = useSimulation.getState()

      // Lerp for smooth transitions (0.1 is arbitrary speed)
      if (material.uniforms.uChaos) {
        material.uniforms.uChaos.value += (chaos - material.uniforms.uChaos.value) * 0.1
      }
      if (material.uniforms.uSuction) {
        material.uniforms.uSuction.value += (suction - material.uniforms.uSuction.value) * 0.1
      }

      // Smooth mouse interpolation
      const targetX = (state.pointer.x + 1) / 2
      const targetY = (state.pointer.y + 1) / 2
      if (material.uniforms.uMouse) {
        material.uniforms.uMouse.value.lerp(new Vector2(targetX, targetY), 0.05)
      }
    }
  })

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={fogVertexShader}
        fragmentShader={fogFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
