'use client'

import { useContent, useLangStore } from '@/lib/i18n'
import styles from './LanguageSwitch.module.css'

function FlagFR() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="flag-fr">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-fr)">
        <rect width="8" height="24" fill="#0055a4" />
        <rect x="8" width="8" height="24" fill="#fff" />
        <rect x="16" width="8" height="24" fill="#ef4135" />
      </g>
    </svg>
  )
}

function FlagGB() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="flag-gb">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-gb)">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="4.5" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#c8102e" strokeWidth="1.8" />
        <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="7" />
        <path d="M12 0V24M0 12H24" stroke="#c8102e" strokeWidth="4" />
      </g>
    </svg>
  )
}

// Affiche le drapeau de la langue vers laquelle on bascule.
export default function LanguageSwitch() {
  const { lang, site } = useContent()
  const setLang = useLangStore((state) => state.setLang)
  const next = lang === 'fr' ? 'en' : 'fr'

  return (
    <button
      type="button"
      className={styles.switch}
      onClick={() => setLang(next)}
      aria-label={site.languageSwitchLabel}
      title={site.languageSwitchLabel}
      lang={next}
      data-cursor
    >
      {next === 'en' ? <FlagGB /> : <FlagFR />}
      <span className={styles.code}>{next.toUpperCase()}</span>
    </button>
  )
}
