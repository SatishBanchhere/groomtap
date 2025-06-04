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
            title: "Specialty Not Found | DoczAppoint",
            description: "The requested medical specialty was not found.",
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
        title: `${specialty.name} Specialists | Book Online | DoczAppoint`,
        description: specialty.description || `Book top ${specialty.name} specialists near you on DoczAppoint. Experienced doctors, verified reviews, and easy online booking.`,
        keywords: [
            `${specialty.name.toLowerCase()} doctor`,
            `${specialty.name.toLowerCase()} specialist`,
            'book doctor online',
            'doctor appointment',
            `${specialty.name} near me`,
            'healthcare booking',
            'DoczAppoint',
        ],
        openGraph: {
            title: `${specialty.name} Specialists | DoczAppoint`,
            description: specialty.description || `Find and book the best ${specialty.name} specialists in your area.`,
            url: `https://doczappoint.com/specialist/${params.id}`,
            siteName: 'DoczAppoint',
            images: [
                {
                    url: specialty.imageUrl || 'https://doczappoint.com/og-default.jpg',
                    width: 1200,
                    height: 630,
                    alt: `${specialty.name} specialists available on DoczAppoint`,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${specialty.name} Specialists | DoczAppoint`,
            description: specialty.description || `Book experienced ${specialty.name} specialists online.`,
            images: [specialty.imageUrl || 'https://doczappoint.com/og-default.jpg'],
        },
        alternates: {
            canonical: `https://doczappoint.com/specialist/${params.id}`,
        },
        metadataBase: new URL('https://doczappoint.com'),
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
