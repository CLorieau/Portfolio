'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import { LANG_STORAGE_KEY, useContent, useLangStore } from '@/lib/i18n'

// Français par défaut ; restaure l'anglais si le visiteur l'a choisi, met à jour <html> et recalcule le scroll.
export default function LangSync() {
  const { lang, site } = useContent()
  const setLang = useLangStore((state) => state.setLang)

  useEffect(() => {
    let stored = null
    try {
      stored = localStorage.getItem(LANG_STORAGE_KEY)
    } catch {}
    if (stored === 'en') setLang('en')
  }, [setLang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = site.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.description)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch {}
    // Les textes changent de longueur : on recalcule les sections épinglées.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [lang, site])

  return null
}
