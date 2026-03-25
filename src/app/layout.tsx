import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Este Tuzla | Profesyonel Bakım ve Güzellik',
  description: 'Este Tuzla güzellik salonunda kendinizi şımartın. Profesyonel saç, cilt ve tırnak bakımı.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
