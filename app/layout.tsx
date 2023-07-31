import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from '../lib/sessionProvider'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode
  session: any
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
        <Header/>
        {children}
        </SessionProvider>
      </body>
    </html>
  )
}
