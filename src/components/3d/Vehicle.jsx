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
  [0.15, -0.3],
  [1.5, 0.45],
  [1.5, 0.7],
  [0.15, 0.35],
]
const tailWing = [
  [0.1, -0.22],
  [0.72, 0.06],
  [0.72, 0.24],
  [0.1, 0.16],
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

const windows = Array.from({ length: 12 }, (_, index) => -0.5 + index * 0.1)

function Airliner() {
  return (
    <group position={[0, 0.2, 0]}>
      {/* Fuselage : tube, nez arrondi, cône de queue relevé */}
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 1.4, 28]} />
        <meshStandardMaterial color={WHITE} metalness={0.15} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.8]} scale={[1, 1, 1.7]}>
        <sphereGeometry args={[0.17, 28, 20]} />
        <meshStandardMaterial color={WHITE} metalness={0.15} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.07, -1.07]} rotation={[-Math.PI / 2 + 0.14, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.17, 0.95, 28]} />
        <meshStandardMaterial color={WHITE} metalness={0.15} roughness={0.35} />
      </mesh>

      {/* Cockpit et hublots */}
      <mesh position={[0, 0.1, 0.93]} rotation={[-0.6, 0, 0]}>
        <boxGeometry args={[0.24, 0.045, 0.1]} />
        <meshStandardMaterial color={GLASS} metalness={0.6} roughness={0.15} />
      </mesh>
      {[-1, 1].map((side) =>
        windows.map((z) => (
          <mesh key={`${side}${z}`} position={[side * 0.171, 0.05, z]}>
            <boxGeometry args={[0.012, 0.045, 0.055]} />
            <meshStandardMaterial color={GLASS} metalness={0.5} roughness={0.2} />
          </mesh>
        )),
      )}

      {/* Ailes basses en flèche */}
      <Wing points={mainWing} thickness={0.05} position={[0, -0.11, 0.12]} />

      {/* Réacteurs sous les ailes */}
      {[-0.62, 0.62].map((x) => (
        <group key={x} position={[x, -0.27, 0.3]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.11, 0.55, 20]} />
            <meshStandardMaterial color="#cfccc4" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.02, 20]} />
            <meshBasicMaterial color="#05070c" />
          </mesh>
        </group>
      ))}

      {/* Empennage : stabilisateurs et dérive aux couleurs du site */}
      <Wing points={tailWing} thickness={0.03} position={[0, 0.1, -1.05]} />
      <mesh position={[0, 0.42, -1.08]} rotation={[-0.55, 0, 0]}>
        <boxGeometry args={[0.04, 0.68, 0.5]} />
        <meshStandardMaterial color={scene.accent} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Feux de navigation en bout d'aile */}
      <mesh position={[-1.5, -0.09, -0.32]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
      </mesh>
      <mesh position={[1.5, -0.09, -0.32]}>
        <sphereGeometry args={[0.035, 8, 8]} />
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
      <group ref={planeRef} scale={0.045}>
        <Airliner />
      </group>
    </group>
  )
}
