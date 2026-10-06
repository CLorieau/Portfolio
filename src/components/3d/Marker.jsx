'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html } from '@react-three/drei'
import { scene } from '@/config/scene'
import { scrollState } from '@/lib/scrollState'
import { waypointPosition } from '@/lib/journeyPath'
import styles from './Marker.module.css'

export default function Marker({ step, index, occluder }) {
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const position = waypointPosition(index)

  useFrame(({ clock }) => {
    const pulse = (clock.elapsedTime * 0.7 + index * 0.31) % 1
    const ring = ringRef.current
    if (ring) {
      ring.scale.setScalar(1 + pulse * 2.4)
      ring.material.opacity = (1 - pulse) * 0.85
    }
    const label = labelRef.current
    if (label) {
      const visible = scrollState.hero > 0.55 && scrollState.skills < 0.25
      label.dataset.visible = String(visible)
    }
  })

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.011, 16, 16]} />
        <meshBasicMaterial color={scene.accent} toneMapped={false} />
      </mesh>
      <Billboard>
        <mesh ref={ringRef}>
          <ringGeometry args={[0.016, 0.02, 48]} />
          <meshBasicMaterial color={scene.accent} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
      <Html occlude={[occluder]} zIndexRange={[20, 0]}>
        <div ref={labelRef} className={styles.label} data-side={step.labelSide} data-visible="false">
          <span className={styles.city}>{step.city}</span>
          <span className={styles.period}>{step.period}</span>
        </div>
      </Html>
    </group>
  )
}
