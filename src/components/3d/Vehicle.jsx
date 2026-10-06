'use client'

import { scene } from '@/config/scene'

export default function Vehicle({ ref }) {
  return (
    <group ref={ref} scale={0.04} visible={false}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.32, 1.7, 24]} />
        <meshStandardMaterial color="#f3f0e8" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[-0.55, 0, -0.15]} rotation={[0, -0.55, 0]}>
        <boxGeometry args={[1.35, 0.04, 0.5]} />
        <meshStandardMaterial color="#f3f0e8" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0.55, 0, -0.15]} rotation={[0, 0.55, 0]}>
        <boxGeometry args={[1.35, 0.04, 0.5]} />
        <meshStandardMaterial color="#f3f0e8" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.3, -0.7]}>
        <boxGeometry args={[0.04, 0.5, 0.4]} />
        <meshStandardMaterial color={scene.accent} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, -0.72]}>
        <boxGeometry args={[0.9, 0.03, 0.28]} />
        <meshStandardMaterial color="#f3f0e8" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.95]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={scene.accent} toneMapped={false} />
      </mesh>
    </group>
  )
}
