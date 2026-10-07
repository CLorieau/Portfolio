'use client'

import { useRef } from 'react'
import { useContent } from '@/lib/i18n'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { scrollState, useSceneStore } from '@/lib/scrollState'
import styles from './Projects.module.css'

export default function Projects() {
  const { site, projects } = useContent()
  const setActiveSection = useSceneStore((state) => state.setActiveSection)
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()

      media.add('(min-width: 900px)', () => {
        const getDistance = () => Math.max(trackRef.current.scrollWidth - window.innerWidth, 0)

        const slide = gsap.to(trackRef.current, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            id: projects.id,
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              if (self.isActive) setActiveSection(projects.id)
            },
            onUpdate: (self) => {
              scrollState.projects = self.progress
            },
          },
        })

        gsap.utils.toArray(`.${styles.visualInner}`).forEach((element) => {
          gsap.fromTo(
            element,
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: element.closest(`.${styles.card}`),
                containerAnimation: slide,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })

        gsap.from(`.${styles.header} > *`, {
          autoAlpha: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        })
      })

      media.add('(max-width: 899px)', () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onToggle: (self) => {
            if (self.isActive) setActiveSection(projects.id)
          },
          onUpdate: (self) => {
            scrollState.projects = self.progress
          },
        })

        gsap.utils.toArray(`.${styles.card}, .${styles.contact}`).forEach((element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 70,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          })
        })
      })

      return () => media.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section id={projects.id} ref={sectionRef} className={styles.projects}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>{projects.eyebrow}</span>
        <h2 className={styles.title}>{projects.title}</h2>
        <p className={styles.intro}>{projects.intro}</p>
      </header>

      <div ref={trackRef} className={styles.track}>
        {projects.items.map((project) => (
          <article key={project.id} className={styles.card}>
            <div className={styles.visual} data-variant={project.variant}>
              <div className={styles.visualInner}>
                <span className={styles.orb} />
                <span className={styles.ring} />
                <span className={styles.number}>{project.index}</span>
              </div>
            </div>
            <div className={styles.info}>
              <span className={styles.context}>{project.context}</span>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardText}>{project.description}</p>
              <ul className={styles.tags}>
                {project.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
              {project.link && (
                <a className={styles.link} href={project.link} target="_blank" rel="noreferrer" data-cursor>
                  {projects.linkLabel}
                </a>
              )}
            </div>
          </article>
        ))}

        <aside id="contact" className={styles.contact}>
          <span className={styles.eyebrow}>{site.contact.eyebrow}</span>
          <h2 className={styles.contactTitle}>{site.contact.title}</h2>
          <p className={styles.contactText}>{site.contact.text}</p>
          <a className={styles.mail} href={`mailto:${site.contact.email}`} data-cursor>
            {site.contact.emailLabel}
            <span className={styles.mailAddress}>{site.contact.email}</span>
          </a>
          <ul className={styles.links}>
            <li>
              <a href={site.contact.phoneHref} data-cursor>
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={site.contact.websiteHref} target="_blank" rel="noreferrer" data-cursor>
                {site.contact.website}
              </a>
            </li>
            <li>{site.location}</li>
          </ul>
          <p className={styles.signature}>{site.footer}</p>
        </aside>
      </div>
    </section>
  )
}
