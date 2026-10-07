'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { Sparkles } from '@react-three/drei'
import { scene } from '@/config/scene'
import { smoothstep } from '@/lib/geo'
import { sampleJourney } from '@/lib/journeyPath'
import { scrollState } from '@/lib/scrollState'
import Artifacts from './Artifacts'
import Globe from './Globe'
import JourneyRoute from './JourneyRoute'

const { radius } = scene.globe
const { fov, heroDistance, farDistance } = scene.camera
const tanHalfFov = Math.tan((fov * Math.PI) / 360)

export default function World() {
  const globeRef = useRef(null)
  const artifactsRef = useRef(null)

  useFrame((state, delta) => {
    const { camera, size, pointer, clock } = state
    const globe = globeRef.current
    const artifacts = artifactsRef.current
    if (!globe || !artifacts) return

    const aspect = size.width / size.height
    const wide = aspect > 1.15
    const enter = smoothstep(0, 1, scrollState.hero)
    const leave = smoothstep(0, 1, scrollState.skills)
    const sample = sampleJourney(scrollState.journey)

    // En portrait la largeur visible est réduite : on recule pour garder le trajet et les étiquettes à l'écran.
    const portraitZoom = MathUtils.clamp(0.9 / aspect, 1, 1.9)
    const journeyDistance = radius + sample.framing * portraitZoom
    const targetZ = MathUtils.lerp(
      MathUtils.lerp(heroDistance, journeyDistance, enter),
      farDistance,
      leave,
    )
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 3.5, delta)
    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * 0.25, 2, delta)
    camera.position.y = MathUtils.damp(camera.position.y, pointer.y * 0.15, 2, delta)
    camera.lookAt(0, 0, 0)

    const viewHeight = 2 * tanHalfFov * Math.max(camera.position.z - radius, 0.1)
    const shiftX = wide ? viewHeight * aspect * 0.17 : 0
    // Portrait : le globe occupe la bande libre entre le titre et la carte de texte, en bas.
    const shiftY = wide ? 0 : viewHeight * 0.205
    const targetX = shiftX * enter * (1 - leave)
    const targetY = MathUtils.lerp(scene.hero.globeY, shiftY, enter) - leave * 9

    globe.position.x = MathUtils.damp(globe.position.x, targetX, 4, delta)
    globe.position.y = MathUtils.damp(globe.position.y, targetY, 4, delta)

    const heroSway = Math.sin(clock.elapsedTime * 0.15) * 0.3
    globe.rotation.y = MathUtils.damp(
      globe.rotation.y,
      MathUtils.lerp(scene.hero.rotationY + heroSway, -sample.lon, enter),
      4,
      delta,
    )
    globe.rotation.x = MathUtils.damp(
      globe.rotation.x,
      MathUtils.lerp(scene.hero.rotationX, sample.lat, enter),
      4,
      delta,
    )
    globe.visible = leave < 0.99

    const reveal = smoothstep(0, 1, scrollState.skills)
    artifacts.visible = reveal > 0.01
    artifacts.scale.setScalar(wide ? 1 : 0.65)
    artifacts.position.x = -scrollState.projects * 1.6
    artifacts.position.y = MathUtils.lerp(-2.5, 0, reveal)
    artifacts.position.z = MathUtils.lerp(-5, 0, reveal)
    artifacts.rotation.y = MathUtils.damp(
      artifacts.rotation.y,
      scrollState.projects * Math.PI * 1.2 + pointer.x * 0.2,
      3,
      delta,
    )
  })

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 3, 6]} intensity={2.4} color="#fff1e6" />
      <pointLight position={[-5, -2, 4]} intensity={40} color={scene.accentSoft} />
      <pointLight position={[4, 3, 3]} intensity={30} color={scene.accent} />

      <Sparkles
        count={scene.sparkles.count}
        size={scene.sparkles.size}
        speed={scene.sparkles.speed}
        color={scene.sparkles.color}
        scale={[16, 9, 8]}
        opacity={0.7}
      />

      <group ref={globeRef}>
        <Globe>
          <JourneyRoute />
        </Globe>
      </group>

      <Artifacts ref={artifactsRef} />
    </>
  )
}
