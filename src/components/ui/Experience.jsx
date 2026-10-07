'use client'

import SceneRoot from '@/components/3d/SceneRoot'
import Cursor from './Cursor'
import Hero from './Hero'
import Journey from './Journey'
import LangSync from './LangSync'
import Loader from './Loader'
import Nav from './Nav'
import Projects from './Projects'
import Skills from './Skills'
import SmoothScroll from './SmoothScroll'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <>
      <LangSync />
      <SmoothScroll />
      <SceneRoot />
      <Loader />
      <main className={styles.main}>
        <Hero />
        <Journey />
        <Skills />
        <Projects />
      </main>
      <Nav />
      <Cursor />
    </>
  )
}
