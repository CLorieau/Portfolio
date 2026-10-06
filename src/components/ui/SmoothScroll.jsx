'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { scroller, useSceneStore } from '@/lib/scrollState'

export default function SmoothScroll() {
  const introDone = useSceneStore((state) => state.introDone)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
    lenis.stop()
    scroller.lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      scroller.lenis = null
    }
  }, [])

  useEffect(() => {
    if (introDone) scroller.lenis?.start()
  }, [introDone])

  return null
}
