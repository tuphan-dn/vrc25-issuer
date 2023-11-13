import type { Metadata } from 'next'

import '@/static/styles/global.scss'

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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
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
      <body className="w-[100dvw] min-h-[100dvh] flex flex-row">
        {children}
      </body>
    </html>
  )
}
