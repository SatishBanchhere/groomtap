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
        title: `Top Doctors in ${formattedDistrict}, ${formattedState} | Book Appointments Near You | DoczAppoint`,
        description: `Find top-rated doctors in ${formattedDistrict}, ${formattedState}. Book appointments with general physicians, specialists, and clinics near you through DoczAppoint.`,
        keywords: [
            `Doctors in ${formattedDistrict}`,
            `Best doctors near me in ${formattedDistrict}`,
            `Top-rated physicians in ${formattedDistrict}`,
            `Find doctors in ${formattedDistrict}, ${formattedState}`,
            `Nearby doctors in ${formattedDistrict}`,
            `General physicians ${formattedDistrict}`,
            `DoczAppoint doctors directory`
        ],
        openGraph: {
            title: `Find Doctors in ${formattedDistrict}, ${formattedState} | DoczAppoint`,
            description: `Search and book appointments with top doctors in ${formattedDistrict}, ${formattedState}. Fast, reliable, and nearby.`,
            type: 'website',
            url: `https://doczappoint.com/${params.state}/${params.district}`,
            images: [
                {
                    url: 'https://doczappoint.com/images/doctors-og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Doctors in ${formattedDistrict}`,
                },
            ],
            siteName: 'DoczAppoint',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Find Doctors in ${formattedDistrict} | Book Nearby Appointments | DoczAppoint`,
            description: `Explore top-rated doctors in ${formattedDistrict}, ${formattedState}. Easily book appointments through DoczAppoint.`,
            images: ['https://doczappoint.com/images/doctors-twitter-image.jpg'],
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
        themeColor: '#2563eb',
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
