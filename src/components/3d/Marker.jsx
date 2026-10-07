'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html } from '@react-three/drei'
import { Vector3 } from 'three'
import { scene } from '@/config/scene'
import { labelPortal, scrollState } from '@/lib/scrollState'
import { waypointPosition } from '@/lib/journeyPath'
import styles from './Marker.module.css'

const worldPosition = new Vector3()
const globeCenter = new Vector3()
const normal = new Vector3()
const toCamera = new Vector3()

export default function Marker({ step, index }) {
  const groupRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const position = waypointPosition(index)

  useFrame(({ clock, camera }) => {
    const pulse = (clock.elapsedTime * 0.7 + index * 0.31) % 1
    const ring = ringRef.current
    if (ring) {
      ring.scale.setScalar(1 + pulse * 2.4)
      ring.material.opacity = (1 - pulse) * 0.85
    }
    const label = labelRef.current
    if (label) {
      // Un point de la sphère est visible quand sa normale fait face à la caméra (sans lancer de rayons).
      const group = groupRef.current
      group.getWorldPosition(worldPosition)
      group.parent.getWorldPosition(globeCenter)
      normal.subVectors(worldPosition, globeCenter)
      toCamera.subVectors(camera.position, worldPosition)
      const facing = normal.dot(toCamera) > 0
      const visible = facing && scrollState.hero > 0.55 && scrollState.skills < 0.25
      label.dataset.visible = String(visible)
    }
  })

  return (
    <group ref={groupRef} position={position}>
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
      <Html portal={labelPortal} zIndexRange={[20, 0]}>
        <div ref={labelRef} className={styles.label} data-side={step.labelSide} data-visible="false">
          <span className={styles.city}>{step.city}</span>
          <span className={styles.period}>{step.period}</span>
        </div>
      </Html>
    </group>
  )
}
