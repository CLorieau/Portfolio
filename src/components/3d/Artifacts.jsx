'use client'

import { Float, MeshDistortMaterial } from '@react-three/drei'
import { scene } from '@/config/scene'

const { blob, wire, knot, shards } = scene.artifacts

export default function Artifacts({ ref }) {
  return (
    <group ref={ref} visible={false}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.4}>
        <mesh position={blob.position} scale={blob.scale}>
          <sphereGeometry args={[1, 48, 48]} />
          <MeshDistortMaterial
            color={blob.color}
            distort={0.42}
            speed={1.5}
            roughness={0.18}
            metalness={0.65}
            envMapIntensity={1.4}
          />
        </mesh>
      </Float>

      <Float speed={0.9} rotationIntensity={1.2} floatIntensity={0.8}>
        <mesh position={wire.position} scale={wire.scale}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={wire.color} wireframe transparent opacity={0.55} toneMapped={false} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={1.6} floatIntensity={1}>
        <mesh position={knot.position} scale={knot.scale}>
          <torusKnotGeometry args={[0.6, 0.18, 100, 14]} />
          <meshPhysicalMaterial
            color={knot.color}
            metalness={1}
            roughness={0.12}
            clearcoat={1}
            iridescence={1}
            envMapIntensity={1.6}
          />
        </mesh>
      </Float>

      {shards.map((shard, index) => (
        <Float key={index} speed={1 + index * 0.25} rotationIntensity={2} floatIntensity={1.6}>
          <mesh position={shard.position} scale={shard.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={scene.accentSoft}
              metalness={0.8}
              roughness={0.2}
              emissive={scene.accentSoft}
              emissiveIntensity={0.25}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
