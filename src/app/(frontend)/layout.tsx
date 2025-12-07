import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/Header'

// Font pre body text
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
})

// Font pre nadpisy
const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body antialiased min-h-screen bg-gray-50">
        <Header />
        {children}
      </body>
    </html>
  )
}
