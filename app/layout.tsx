// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

// Import Firebase to initialize it
import '@/lib/firebase' // This ensures Firebase is initialized when the app loads

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'GroomTap - Professional Grooming Made Simple',
    description: 'Connect with the best barbers and shops in your area',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
        </body>
        </html>
    )
}
