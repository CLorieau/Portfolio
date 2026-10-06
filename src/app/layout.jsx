import { Space_Grotesk, Syne } from 'next/font/google'
import 'lenis/dist/lenis.css'
import './globals.css'
import { site } from '@/config/site'

const display = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const body = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: site.title,
  description: site.description,
}

export const viewport = {
  themeColor: '#04050a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
