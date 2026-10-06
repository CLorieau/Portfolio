'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { site } from '@/config/site'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { scroller, useSceneStore } from '@/lib/scrollState'
import styles from './Nav.module.css'

function goTo(id) {
  const lenis = scroller.lenis
  if (!lenis) return
  if (id === 'accueil') {
    lenis.scrollTo(0, { duration: 1.8 })
    return
  }
  const trigger = ScrollTrigger.getById(id)
  const target = trigger ? trigger.start : document.getElementById(id)
  lenis.scrollTo(target, { duration: 1.8 })
}

export default function Nav() {
  const activeSection = useSceneStore((state) => state.activeSection)
  const introDone = useSceneStore((state) => state.introDone)
  const rootRef = useRef(null)
  const barRef = useRef(null)

  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          gsap.set(barRef.current, { scaleX: self.progress })
        },
      })
    },
    { scope: rootRef },
  )

  useGSAP(
    () => {
      gsap.set(rootRef.current, { autoAlpha: 0, y: -20 })
      if (!introDone) return
      gsap.to(rootRef.current, { autoAlpha: 1, y: 0, duration: 1, delay: 0.6, ease: 'power3.out' })
    },
    { scope: rootRef, dependencies: [introDone] },
  )

  return (
    <header ref={rootRef} className={styles.nav}>
      <button type="button" className={styles.brand} onClick={() => goTo('accueil')} data-cursor>
        <Image
          className={styles.mark}
          src={site.logo.src}
          width={site.logo.width}
          height={site.logo.height}
          alt={site.logo.alt}
          priority
        />
        <span className={styles.brandName}>{site.name}</span>
      </button>

      <nav className={styles.links} aria-label="Navigation principale">
        {site.nav.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.link}
            data-active={activeSection === item.id}
            onClick={() => goTo(item.id)}
            data-cursor
          >
            <span className={styles.linkIndex}>{item.index}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <a className={styles.contact} href={`mailto:${site.contact.email}`} data-cursor>
        Contact
      </a>

      <div className={styles.progress}>
        <div ref={barRef} className={styles.progressBar} />
      </div>
    </header>
  )
}
