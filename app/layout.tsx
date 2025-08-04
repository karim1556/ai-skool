import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import ClientOnly from '@/components/ClientOnly'

export const metadata: Metadata = {
  title: 'karims skool',
  description: 'Created with love',
  generator: 'karim',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientOnly>
          <Header />
        </ClientOnly>
        {children}
        <ClientOnly>
          <Footer />
        </ClientOnly>
      </body>
    </html>
  )
}
