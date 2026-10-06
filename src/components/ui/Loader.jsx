'use client'

import { useRef } from 'react'
import { site } from '@/config/site'
import { gsap, useGSAP } from '@/lib/gsap'
import { useSceneStore } from '@/lib/scrollState'
import styles from './Loader.module.css'

export default function Loader() {
  const sceneReady = useSceneStore((state) => state.sceneReady)
  const setIntroDone = useSceneStore((state) => state.setIntroDone)
  const rootRef = useRef(null)
  const contentRef = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)
  const labelRef = useRef(null)
  const progressRef = useRef({ value: 0 })

  useGSAP(
    () => {
      const progress = progressRef.current
      const render = () => {
        counterRef.current.textContent = String(Math.round(progress.value)).padStart(3, '0')
        gsap.set(barRef.current, { scaleX: progress.value / 100 })
      }

      if (!sceneReady) {
        gsap.to(progress, { value: 88, duration: 3.2, ease: 'power2.out', onUpdate: render })
        return
      }

      gsap
        .timeline()
        .to(progress, { value: 100, duration: 0.6, ease: 'power2.inOut', onUpdate: render })
        .add(() => {
          labelRef.current.textContent = site.loader.done
        })
        .to(contentRef.current, { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power2.in' }, '+=0.35')
        .add(() => setIntroDone(), '>-0.1')
        .to(rootRef.current, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '<')
        .set(rootRef.current, { display: 'none' })
    },
    { scope: rootRef, dependencies: [sceneReady] },
  )

  return (
    <div ref={rootRef} className={styles.loader} role="status" aria-live="polite">
      <div ref={contentRef} className={styles.content}>
        <span className={styles.brand}>{site.name}</span>
        <span ref={counterRef} className={styles.counter}>
          000
        </span>
        <div className={styles.track}>
          <div ref={barRef} className={styles.bar} />
        </div>
        <span ref={labelRef} className={styles.label}>
          {site.loader.label}
        </span>
      </div>
    </div>
  )
}
