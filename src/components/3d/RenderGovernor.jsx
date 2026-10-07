'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { quality } from '@/lib/quality'
import { setInvalidate, wake } from '@/lib/renderActivity'
import { useSceneStore } from '@/lib/scrollState'

const WARMUP_FRAMES = 30
const SAMPLE_FRAMES = 40
const SLOW_FRAME_SECONDS = 0.075
const LONG_TASK_MS = 60
const LONG_TASK_LIMIT = 6
const LONG_TASK_WARMUP = 1500

// Surveille la fluidité et pilote le rendu à la demande quand la machine n'a pas de GPU utilisable.
export default function RenderGovernor({ low, onSlow }) {
  const invalidate = useThree((state) => state.invalidate)
  const sceneReady = useSceneStore((state) => state.sceneReady)
  const introDone = useSceneStore((state) => state.introDone)
  const probe = useRef({ frames: 0, total: 0, done: false })

  useEffect(() => {
    if (!low) {
      setInvalidate(null)
      return
    }
    setInvalidate(() => invalidate())
    const onActivity = () => wake()
    window.addEventListener('scroll', onActivity, { passive: true })
    window.addEventListener('pointermove', onActivity, { passive: true })
    wake(2000)
    return () => {
      window.removeEventListener('scroll', onActivity)
      window.removeEventListener('pointermove', onActivity)
      setInvalidate(null)
    }
  }, [low, invalidate])

  useEffect(() => {
    if (low) wake(2500)
  }, [low, sceneReady, introDone])

  // Plus direct que la cadence : si le fil principal est bloqué à répétition par le rendu, on allège.
  useEffect(() => {
    if (low || quality.forced || !sceneReady || !('PerformanceObserver' in window)) return
    const startedAt = performance.now()
    let count = 0
    let observer
    try {
      observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.startTime < startedAt + LONG_TASK_WARMUP) return
          if (entry.duration > LONG_TASK_MS) count += 1
        })
        if (count >= LONG_TASK_LIMIT) {
          observer.disconnect()
          onSlow()
        }
      })
      observer.observe({ type: 'longtask', buffered: false })
    } catch {
      return
    }
    return () => observer.disconnect()
  }, [low, sceneReady, onSlow])

  // Mesure la cadence réelle : si elle est très basse, on bascule en mode allégé.
  useFrame((_, delta) => {
    const state = probe.current
    if (low || quality.forced || state.done || !sceneReady) return
    state.frames += 1
    if (state.frames <= WARMUP_FRAMES) return
    state.total += delta
    if (state.frames - WARMUP_FRAMES >= SAMPLE_FRAMES) {
      state.done = true
      if (state.total / SAMPLE_FRAMES > SLOW_FRAME_SECONDS) onSlow()
    }
  })

  return null
}
