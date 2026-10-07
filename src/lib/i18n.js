import { useMemo } from 'react'
import { create } from 'zustand'
import { site } from '@/config/site'
import { journey } from '@/config/journey'
import { projects } from '@/config/projects'
import { skills } from '@/config/skills'
import { en } from '@/config/en'

export const LANG_STORAGE_KEY = 'portfolio-lang'

export const useLangStore = create((set) => ({
  lang: 'fr',
  setLang: (lang) => set({ lang }),
}))

// Fusionne la traduction sur la base française : les objets sont fusionnés, les tableaux terme à terme.
function merge(base, patch) {
  if (patch === undefined) return base
  if (Array.isArray(base)) {
    if (!Array.isArray(patch)) return base
    return base.map((item, index) => merge(item, patch[index]))
  }
  if (base && typeof base === 'object') {
    const result = { ...base }
    for (const key of Object.keys(patch)) result[key] = merge(base[key], patch[key])
    return result
  }
  return patch
}

const content = {
  fr: { site, journey, projects, skills },
  en: {
    site: merge(site, en.site),
    journey: merge(journey, en.journey),
    projects: merge(projects, en.projects),
    skills: merge(skills, en.skills),
  },
}

export function useContent() {
  const lang = useLangStore((state) => state.lang)
  return useMemo(() => ({ lang, ...content[lang] }), [lang])
}

export function getContent() {
  return content[useLangStore.getState().lang]
}
