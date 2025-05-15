// app/[state]/[district]/layout.tsx
import type { Metadata } from 'next'

export async function generateMetadata({
                                           params,
                                       }: {
    params: { state: string; district: string }
}): Promise<Metadata> {
    const formattedState = params.state.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    const formattedDistrict = params.district.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return {
        title: `24/7 Emergency Services in ${formattedDistrict} | Find Nearby Hospitals | DoczAppoint`,
        description: `Find 24/7 emergency medical services in ${formattedDistrict}, ${formattedState}. Book immediate appointments with nearby hospitals, ambulance services, and emergency care centers through DoczAppoint.`,
        keywords: [
            `Emergency hospitals in ${formattedDistrict}`,
            `24 hour emergency services ${formattedDistrict}`,
            `Ambulance services ${formattedDistrict}`,
            `Emergency medical care ${formattedDistrict}`,
            `Nearest emergency hospital ${formattedDistrict}`,
            `Emergency doctors ${formattedDistrict}`,
            `DoczAppoint emergency services`
        ],
        openGraph: {
            title: `24/7 Emergency Services in ${formattedDistrict} | DoczAppoint`,
            description: `Find and book emergency medical services in ${formattedDistrict}, ${formattedState} through DoczAppoint.`,
            type: 'website',
            url: `https://doczappoint.com/${params.state}/${params.district}`,
            images: [
                {
                    url: 'https://doczappoint.com/images/emergency-og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Emergency Services in ${formattedDistrict}`,
                },
            ],
            siteName: 'DoczAppoint',
        },
        twitter: {
            card: 'summary_large_image',
            title: `24/7 Emergency Services in ${formattedDistrict} | DoczAppoint`,
            description: `Find and book emergency medical services in ${formattedDistrict}, ${formattedState} through DoczAppoint.`,
            images: ['https://doczappoint.com/images/emergency-twitter-image.jpg'],
            site: '@doczappoint',
        },
        alternates: {
            canonical: `https://doczappoint.com/${params.state}/${params.district}`,
        },
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
            }
        },
        themeColor: '#2563eb', // Blue color matching your brand
        viewport: {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 1,
        }
    }
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
