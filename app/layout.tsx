import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import ClientOnly from '@/components/ClientOnly'
import { CartProvider } from '@/hooks/use-cart'
import {
  ClerkProvider,
} from '@clerk/nextjs'

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
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientOnly>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </ClientOnly>
      </body>
    </html>
    </ClerkProvider>
  )
}
