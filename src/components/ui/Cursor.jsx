'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import styles from './Cursor.module.css'

export default function Cursor() {
  const rootRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useGSAP(
    () => {
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      if (!finePointer) return

      gsap.set([dotRef.current, ringRef.current], { xPercent: -50, yPercent: -50 })

      const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.12, ease: 'power3' })
      const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.12, ease: 'power3' })
      const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.5, ease: 'power3' })
      const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.5, ease: 'power3' })

      const onMove = (event) => {
        rootRef.current.dataset.ready = 'true'
        dotX(event.clientX)
        dotY(event.clientY)
        ringX(event.clientX)
        ringY(event.clientY)
      }

      const onOver = (event) => {
        const hot = event.target instanceof Element && event.target.closest('a, button, [data-cursor]')
        rootRef.current.dataset.active = String(Boolean(hot))
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerover', onOver)

      return () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerover', onOver)
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className={styles.cursor} data-ready="false" data-active="false" aria-hidden="true">
      <div ref={ringRef} className={styles.ring}>
        <span className={styles.ringShape} />
      </div>
      <div ref={dotRef} className={styles.dot} />
    </div>
  )
}
