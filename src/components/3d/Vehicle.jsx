'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Shape } from 'three'
import { scene } from '@/config/scene'
import { journeyRuntime, transportAt } from '@/lib/journeyPath'

// Repère local : +z = avant, +y = haut (normale au globe), +x = droite.

const WHITE = '#f3f0e8'
const GLASS = '#10151f'

// Aile droite en flèche (x = envergure, y = -z : le bord de fuite est vers y positif).
function useWingGeometry(points) {
  return useMemo(() => {
    const shape = new Shape()
    points.forEach(([x, y], index) => (index === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)))
    shape.closePath()
    return shape
  }, [points])
}

const mainWing = [
  [0.12, -0.3],
  [1.45, 0.42],
  [1.45, 0.7],
  [0.12, 0.2],
]
const tailWing = [
  [0.08, -0.22],
  [0.62, 0.12],
  [0.62, 0.3],
  [0.08, 0.16],
]

function Wing({ points, thickness, ...props }) {
  const shape = useWingGeometry(points)
  return (
    <group {...props}>
      {[1, -1].map((side) => (
        <mesh key={side} scale={[side, 1, 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <extrudeGeometry args={[shape, { depth: thickness, bevelEnabled: false }]} />
          <meshStandardMaterial color={WHITE} metalness={0.25} roughness={0.35} side={2} />
        </mesh>
      ))}
    </group>
  )
}

function Car() {
  const wheels = [
    [-0.29, 0.1, 0.34],
    [0.29, 0.1, 0.34],
    [-0.29, 0.1, -0.34],
    [0.29, 0.1, -0.34],
  ]
  return (
    <group>
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.54, 0.16, 1.1]} />
        <meshStandardMaterial color={scene.accent} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, -0.06]}>
        <boxGeometry args={[0.46, 0.14, 0.58]} />
        <meshStandardMaterial color={GLASS} metalness={0.6} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.375, -0.06]}>
        <boxGeometry args={[0.44, 0.02, 0.5]} />
        <meshStandardMaterial color={scene.accent} metalness={0.5} roughness={0.3} />
      </mesh>
      {wheels.map((position) => (
        <mesh key={position.join()} position={position} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.09, 16]} />
          <meshStandardMaterial color="#0a0c12" roughness={0.8} />
        </mesh>
      ))}
      {[-0.19, 0.19].map((x) => (
        <mesh key={`h${x}`} position={[x, 0.18, 0.56]}>
          <boxGeometry args={[0.1, 0.05, 0.03]} />
          <meshBasicMaterial color="#fff6d6" toneMapped={false} />
        </mesh>
      ))}
      {[-0.19, 0.19].map((x) => (
        <mesh key={`t${x}`} position={[x, 0.18, -0.56]}>
          <boxGeometry args={[0.1, 0.05, 0.03]} />
          <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Airliner() {
  return (
    <group position={[0, 0.16, 0]}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 1.7, 24]} />
        <meshStandardMaterial color={WHITE} metalness={0.25} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.14, 0.55, 24]} />
        <meshStandardMaterial color={WHITE} metalness={0.25} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.03, -1.25]} rotation={[-Math.PI / 2 + 0.12, 0, 0]}>
        <coneGeometry args={[0.14, 0.9, 24]} />
        <meshStandardMaterial color={WHITE} metalness={0.25} roughness={0.3} />
      </mesh>
      {/* Bande de cabine et cockpit */}
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.142, 0.142, 1.3, 24]} />
        <meshStandardMaterial color={scene.accent} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.07, 1.0]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[0.2, 0.05, 0.14]} />
        <meshStandardMaterial color={GLASS} metalness={0.6} roughness={0.15} />
      </mesh>

      {/* Ailes basses en flèche */}
      <Wing points={mainWing} thickness={0.035} position={[0, -0.1, 0.25]} />
      {/* Réacteurs */}
      {[-0.55, 0.55].map((x) => (
        <group key={x} position={[x, -0.2, 0.28]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.42, 16]} />
            <meshStandardMaterial color="#d9d6ce" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.215]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
            <meshBasicMaterial color={GLASS} />
          </mesh>
        </group>
      ))}

      {/* Empennage */}
      <Wing points={tailWing} thickness={0.025} position={[0, 0.02, -1.0]} />
      <mesh position={[0, 0.34, -1.12]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.035, 0.55, 0.36]} />
        <meshStandardMaterial color={scene.accent} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Feux de navigation */}
      <mesh position={[-1.45, -0.08, -0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
      </mesh>
      <mesh position={[1.45, -0.08, -0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#35ff7a" toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function Vehicle({ ref }) {
  const carRef = useRef(null)
  const planeRef = useRef(null)

  useFrame(() => {
    const onRoad = transportAt(journeyRuntime.t) === 'road'
    if (carRef.current) carRef.current.visible = onRoad
    if (planeRef.current) planeRef.current.visible = !onRoad
  })

  return (
    <group ref={ref} visible={false}>
      <group ref={carRef} scale={0.05}>
        <Car />
      </group>
      <group ref={planeRef} scale={0.04}>
        <Airliner />
      </group>
    </group>
  )
}
