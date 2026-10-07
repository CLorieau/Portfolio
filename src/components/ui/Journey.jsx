'use client'

import { useRef } from 'react'
import { useContent } from '@/lib/i18n'
import { gsap, useGSAP } from '@/lib/gsap'
import { scrollState, useSceneStore } from '@/lib/scrollState'
import styles from './Journey.module.css'

export default function Journey() {
  const { site, journey } = useContent()
  const cards = [
    ...journey.steps.map((step) => ({ ...step, kind: 'step' })),
    { ...journey.destination, id: 'destination', kind: 'destination' },
  ]
  const setActiveSection = useSceneStore((state) => state.setActiveSection)
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const cardElements = gsap.utils.toArray(`.${styles.card}`)
      const dotElements = gsap.utils.toArray(`.${styles.railDot}`)

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          id: journey.id,
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${cards.length * 95}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            if (self.isActive) setActiveSection(journey.id)
          },
          onUpdate: (self) => {
            scrollState.journey = self.progress
          },
        },
      })

      timeline.from(`.${styles.header}`, { autoAlpha: 0, y: -24, duration: 0.25 }, 0)
      timeline.to(`.${styles.hint}`, { autoAlpha: 0, duration: 0.15 }, 0.35)
      timeline.fromTo(
        `.${styles.railFill}`,
        { scaleY: 0 },
        { scaleY: 1, duration: cards.length, ease: 'none' },
        0,
      )

      cardElements.forEach((element, index) => {
        const isLast = index === cardElements.length - 1
        gsap.set(element, { autoAlpha: 0 })
        timeline.fromTo(
          element,
          { autoAlpha: 0, y: 70, filter: 'blur(10px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.26 },
          index + 0.1,
        )
        if (!isLast) {
          timeline.to(
            element,
            { autoAlpha: 0, y: -70, filter: 'blur(10px)', duration: 0.2, ease: 'power2.in' },
            index + 0.8,
          )
        }
      })

      dotElements.forEach((element, index) => {
        timeline.to(element, { scale: 1.7, opacity: 1, duration: 0.12 }, index + 0.5)
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id={journey.id} ref={sectionRef} className={styles.journey}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>{journey.eyebrow}</span>
        <h2 className={styles.title}>{journey.title}</h2>
      </header>

      <p className={styles.hint}>{journey.hint}</p>

      <div className={styles.stack}>
        {cards.map((card) => (
          <article key={card.id} className={styles.card} data-kind={card.kind}>
            <div className={styles.cardTop}>
              <span className={styles.period}>{card.period}</span>
              {card.kind === 'step' && (
                <span className={styles.place}>
                  {card.city}, {card.country}
                </span>
              )}
            </div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardPlace}>{card.place}</p>
            <p className={styles.cardText}>{card.description}</p>
            {card.kind === 'step' && (
              <ul className={styles.tags}>
                {card.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {card.kind === 'destination' && (
              <a className={styles.cta} href={`mailto:${site.contact.email}`} data-cursor>
                {card.cta}
              </a>
            )}
          </article>
        ))}
      </div>

      <div className={styles.rail} aria-hidden="true">
        <ul className={styles.railList}>
          {journey.steps.map((step) => (
            <li key={step.id} className={styles.railItem}>
              <span className={styles.railDot} />
              <span className={styles.railLabel}>{step.city}</span>
            </li>
          ))}
          <li className={styles.railItem}>
            <span className={styles.railDot} />
            <span className={styles.railLabel}>{journey.destination.period}</span>
          </li>
        </ul>
        <div className={styles.railTrack}>
          <div className={styles.railFill} />
        </div>
      </div>
    </section>
  )
}
