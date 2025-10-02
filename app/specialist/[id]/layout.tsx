import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({
                                           params,
                                       }: {
    params: { id: string }
}): Promise<Metadata> {
    // Fetch specialty data from Firebase
    const specialtyDoc = await getDoc(doc(db, "specialties", params.id))

    if (!specialtyDoc.exists()) {
        return {
            title: "Service Not Found | GroomTap",
            description: "The requested beauty service was not found.",
            robots: {
                index: false,
                follow: false,
            },
            alternates: undefined
        }
    }

    const specialty = {
        id: specialtyDoc.id,
        ...specialtyDoc.data()
    } as {
        id: string
        name: string
        description?: string
        imageUrl?: string
    }

    return {
        title: `${specialty.name} Experts | Book Online | GroomTap`,
        description: specialty.description || `Book top ${specialty.name} experts near you on GroomTap. Experienced freelancers, verified reviews, and easy online booking.`,
        keywords: [
            `${specialty.name.toLowerCase()} freelancer`,
            `${specialty.name.toLowerCase()} expert`,
            'book freelancer online',
            'grooming appointment',
            `${specialty.name} near me`,
            'beauty booking',
            'GroomTap',
        ],
        openGraph: {
            title: `${specialty.name} Experts | GroomTap`,
            description: specialty.description || `Find and book the best ${specialty.name} experts in your area.`,
            url: `https://groomtap.in/services/${params.id}`,
            siteName: 'GroomTap',
            images: [
                {
                    url: specialty.imageUrl || 'https://groomtap.in/og-default.jpg',
                    width: 1200,
                    height: 630,
                    alt: `${specialty.name} experts available on GroomTap`,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${specialty.name} Experts | GroomTap`,
            description: specialty.description || `Book experienced ${specialty.name} experts online.`,
            images: [specialty.imageUrl || 'https://groomtap.in/og-default.jpg'],
        },
        alternates: {
            canonical: `https://groomtap.in/specialist/${params.id}`,
        },
        metadataBase: new URL('https://groomtap.in'),
    }
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffffff" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </head>
        <body className={inter.className}>
        {children}
        </body>
        </html>
    )
}
