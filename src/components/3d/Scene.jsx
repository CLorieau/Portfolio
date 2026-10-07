'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { scene } from '@/config/scene'
import { labelPortal } from '@/lib/scrollState'
import { detectSoftwareRenderer, forcedQuality, quality } from '@/lib/quality'
import RenderGovernor from './RenderGovernor'
import World from './World'
import styles from './Scene.module.css'

export default function Scene() {
  const [low, setLow] = useState(() => {
    const forced = forcedQuality()
    quality.forced = Boolean(forced)
    quality.low = forced ? forced === 'low' : detectSoftwareRenderer()
    return quality.low
  })

  const handleSlow = () => {
    quality.low = true
    setLow(true)
  }

  return (
    <div ref={(element) => (labelPortal.current = element)} className={styles.canvasWrapper}>
      <Canvas
        dpr={low ? 1 : [1, 1.5]}
        frameloop={low ? 'demand' : 'always'}
        camera={{
          fov: scene.camera.fov,
          near: 0.05,
          far: 60,
          position: [0, 0, scene.camera.heroDistance],
        }}
        gl={{ antialias: !quality.low, powerPreference: 'high-performance' }}
        eventSource={document.documentElement}
        eventPrefix="client"
      >
        <color attach="background" args={[scene.background]} />
        <RenderGovernor low={low} onSlow={handleSlow} />
        <Suspense fallback={null}>
          <World />
        </Suspense>
        <Suspense fallback={null}>
          <Environment resolution={64} frames={1}>
            <Lightformer form="ring" intensity={3} color={scene.accent} position={[4, 2, -3]} scale={6} />
            <Lightformer intensity={2} color={scene.accentSoft} position={[-5, 0, -2]} scale={[8, 3, 1]} />
            <Lightformer form="rect" intensity={1.5} position={[0, 5, 2]} scale={[10, 2, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
      <div className={styles.vignette} />
    </div>
  )
}
