'use client'

import { useRef } from 'react'
import { skills } from '@/config/skills'
import { site } from '@/config/site'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { scrollState, useSceneStore } from '@/lib/scrollState'
import styles from './Skills.module.css'

const marqueeRows = [
  { id: 'forward', words: [...skills.marquee, ...skills.marquee], from: 0, to: -28 },
  { id: 'backward', words: [...skills.marquee, ...skills.marquee].reverse(), from: -28, to: 0 },
]

export default function Skills() {
  const setActiveSection = useSceneStore((state) => state.setActiveSection)
  const sectionRef = useRef(null)
  const titleRef = useRef(null)

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        onUpdate: (self) => {
          scrollState.skills = self.progress
        },
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'bottom 60%',
        onToggle: (self) => {
          if (self.isActive) setActiveSection(skills.id)
        },
      })

      const split = SplitText.create(titleRef.current, { type: 'words,chars' })
      gsap.from(split.chars, {
        autoAlpha: 0,
        yPercent: 100,
        rotate: 6,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.035,
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true },
      })

      gsap.from(`.${styles.intro}, .${styles.eyebrow}`, {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true },
      })

      marqueeRows.forEach((row) => {
        gsap.fromTo(
          `.${styles.marqueeTrack}[data-row='${row.id}']`,
          { xPercent: row.from },
          {
            xPercent: row.to,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      const cards = gsap.utils.toArray(`.${styles.skillCard}`)
      gsap.set(cards, { autoAlpha: 0, y: 90 })
      ScrollTrigger.batch(cards, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true,
          }),
      })

      gsap.from(`.${styles.footer} > *`, {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: `.${styles.footer}`, start: 'top 92%', once: true },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section id={skills.id} ref={sectionRef} className={styles.skills}>
      <div className={styles.marquee} aria-hidden="true">
        {marqueeRows.map((row) => (
          <div key={row.id} className={styles.marqueeTrack} data-row={row.id}>
            {row.words.map((word, index) => (
              <span key={`${word}-${index}`} className={styles.marqueeWord}>
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>

      <header className={styles.header}>
        <span className={styles.eyebrow}>{skills.eyebrow}</span>
        <h2 ref={titleRef} className={styles.title}>
          {skills.title}
        </h2>
        <p className={styles.intro}>{skills.intro}</p>
      </header>

      <div className={styles.grid}>
        {skills.categories.map((category) => (
          <article key={category.id} className={styles.skillCard}>
            <div className={styles.cardHead}>
              <span className={styles.cardIndex}>{category.index}</span>
              <span className={styles.cardCount}>{String(category.items.length).padStart(2, '0')}</span>
            </div>
            <h3 className={styles.cardName}>{category.name}</h3>
            <p className={styles.cardSummary}>{category.summary}</p>
            <ul className={styles.chips}>
              {category.items.map((item) => (
                <li key={item} className={styles.chip}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{skills.languages.label}</h3>
          <ul className={styles.languages}>
            {skills.languages.items.map((language) => (
              <li key={language.name} className={styles.language}>
                <span className={styles.languageName}>{language.name}</span>
                <span className={styles.languageLevel}>{language.level}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{site.interests.label}</h3>
          <ul className={styles.interests}>
            {site.interests.items.map((item) => (
              <li key={item} className={styles.interest}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
