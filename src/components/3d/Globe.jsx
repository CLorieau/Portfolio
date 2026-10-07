'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BackSide, Color } from 'three'
import { scene } from '@/config/scene'
import { buildLandDots } from '@/lib/geo'
import { useSceneStore } from '@/lib/scrollState'
import {
  atmosphereFragment,
  atmosphereVertex,
  dotsFragment,
  dotsVertex,
  oceanFragment,
  oceanVertex,
} from './shaders'

const { radius, dotCount, dotSize, dotColor, oceanColor, atmosphereColor } = scene.globe

const dotsUniforms = {
  uSize: { value: dotSize },
  uScale: { value: 1000 },
  uColor: { value: new Color(dotColor).toArray() },
  uRim: { value: new Color(atmosphereColor).toArray() },
}

const oceanUniforms = {
  uBase: { value: new Color(oceanColor).toArray() },
  uRim: { value: new Color(atmosphereColor).toArray() },
}

const atmosphereUniforms = {
  uColor: { value: new Color(atmosphereColor).toArray() },
}

export default function Globe({ children }) {
  const [positions, setPositions] = useState(null)
  const setSceneReady = useSceneStore((state) => state.setSceneReady)
  const dotsRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    buildLandDots(dotCount, radius).then((data) => {
      if (cancelled) return
      setPositions(data)
      setSceneReady()
    })
    return () => {
      cancelled = true
    }
  }, [setSceneReady])

  useFrame(({ camera, size, gl }) => {
    const material = dotsRef.current
    if (!material) return
    const focal = (size.height * gl.getPixelRatio()) / (2 * Math.tan((camera.fov * Math.PI) / 360))
    material.uniforms.uScale.value = focal
  })

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius * 0.995, 48, 48]} />
        <shaderMaterial
          args={[{ uniforms: oceanUniforms, vertexShader: oceanVertex, fragmentShader: oceanFragment }]}
        />
      </mesh>

      {positions && (
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <shaderMaterial
            ref={dotsRef}
            transparent
            depthWrite={false}
            args={[{ uniforms: dotsUniforms, vertexShader: dotsVertex, fragmentShader: dotsFragment }]}
          />
        </points>
      )}

      <mesh>
        <sphereGeometry args={[radius * 1.14, 40, 40]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={BackSide}
          blending={AdditiveBlending}
          args={[
            {
              uniforms: atmosphereUniforms,
              vertexShader: atmosphereVertex,
              fragmentShader: atmosphereFragment,
            },
          ]}
        />
      </mesh>

      {children}
    </group>
  )
}
