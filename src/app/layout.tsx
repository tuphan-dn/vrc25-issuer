import type { Metadata, Viewport } from 'next'

import Header from './header'
import Footer from './footer'

import UiProvider from '@/providers/ui.provider'

import WalletProvider from '@/providers/wallet.provider'

const title = 'Viction | #BuildOnViction'
const description =
  'Viction, previously known as TomoChain, is a people-centric layer-1 blockchain that provides zero-gas transactions and heightened security, making Web3 accessible and safe for everyone. With a design emphasis on user experience, Viction prioritizes zero-gas transactions through the innovative TRC25 token standard, alongside speed, security, and scalability, all contributing to a more secure and open world.'
const thumbnail = '/thumbnail.jpeg'

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL('https://viction.tuphan.dev'),
  openGraph: {
    title,
    description,
    images: [thumbnail],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@1,900,700,500,300,400,2&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="w-full">
        <UiProvider>
          <WalletProvider>
            <div className="w-full min-h-[100dvh] flex flex-col justify-between">
              <header className="sticky top-0">
                <Header />
              </header>
              <main className="px-4">{children}</main>
              <footer className="mt-8">
                <Footer />
              </footer>
            </div>
          </WalletProvider>
        </UiProvider>
      </body>
    </html>
  )
}
