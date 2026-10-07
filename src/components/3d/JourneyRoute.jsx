'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { journey } from '@/config/journey'
import { scene } from '@/config/scene'
import { scrollState, useSceneStore } from '@/lib/scrollState'
import { journeyPoints, journeyRuntime, journeySegments, poseOnJourney } from '@/lib/journeyPath'
import Marker from './Marker'
import Vehicle from './Vehicle'

export default function JourneyRoute() {
  const sceneReady = useSceneStore((state) => state.sceneReady)
  const trailRef = useRef(null)
  const vehicleRef = useRef(null)

  useFrame(() => {
    const trail = trailRef.current
    const vehicle = vehicleRef.current
    if (!trail || !vehicle) return

    trail.geometry.instanceCount = Math.floor(journeyRuntime.t * journeySegments)
    poseOnJourney(journeyRuntime.t, vehicle.position, vehicle.quaternion)
    vehicle.visible = scrollState.hero > 0.55 && scrollState.skills < 0.6
  })

  return (
    <group>
      <Line
        points={journeyPoints}
        color={scene.accentSoft}
        lineWidth={1.2}
        transparent
        opacity={0.35}
        dashed
        dashSize={0.012}
        gapSize={0.012}
      />
      <Line ref={trailRef} points={journeyPoints} color={scene.accent} lineWidth={2.6} />
      {sceneReady &&
        journey.steps.map((step, index) => (
          <Marker key={step.id} step={step} index={index} />
        ))}
      <Vehicle ref={vehicleRef} />
    </group>
  )
}
