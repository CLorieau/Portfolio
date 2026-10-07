'use client'

import { useRef } from 'react'
import { useContent } from '@/lib/i18n'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { scrollState, useSceneStore } from '@/lib/scrollState'
import styles from './Hero.module.css'

export default function Hero() {
  const { site } = useContent()
  const introDone = useSceneStore((state) => state.introDone)
  const setActiveSection = useSceneStore((state) => state.setActiveSection)
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const roleRef = useRef(null)
  const titleRef = useRef(null)
  const metaRef = useRef(null)

  useGSAP(
    () => {
      const split = SplitText.create(titleRef.current, { type: 'words,chars' })
      const meta = gsap.utils.toArray(metaRef.current.children)

      gsap.set(split.chars, { autoAlpha: 0, yPercent: 110, rotate: 8 })
      gsap.set(roleRef.current, { autoAlpha: 0, y: 24 })
      gsap.set(meta, { autoAlpha: 0, y: 16 })

      if (!introDone) return

      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(split.chars, { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.045 })
        .to(roleRef.current, { autoAlpha: 1, y: 0, duration: 1.1 }, '-=1.0')
        .to(meta, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 }, '-=0.7')
    },
    { scope: sectionRef, dependencies: [introDone] },
  )

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onToggle: (self) => {
          if (self.isActive) setActiveSection('accueil')
        },
        onUpdate: (self) => {
          scrollState.hero = self.progress
        },
      })

      gsap.to(contentRef.current, {
        yPercent: -22,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 35%',
          scrub: true,
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id="accueil" ref={sectionRef} className={styles.hero}>
      <div ref={contentRef} className={styles.center}>
        <p ref={roleRef} className={styles.role}>
          <span className={styles.roleLine} />
          {site.role}
          <span className={styles.roleLine} />
        </p>
        <h1 ref={titleRef} className={styles.title}>
          {site.name}
        </h1>
      </div>

      <div ref={metaRef} className={styles.meta}>
        <span className={styles.metaItem}>{site.location}</span>
        <span className={styles.scroll}>
          {site.scrollHint}
          <span className={styles.scrollLine} />
        </span>
        <span className={`${styles.metaItem} ${styles.metaRight}`}>{site.availability}</span>
      </div>
    </section>
  )
}
