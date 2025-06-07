// app/[state]/[district]/layout.tsx
import type { Metadata } from 'next'

export async function generateMetadata({
                                           params,
                                       }: {
    params: { state: string; district: string }
}): Promise<Metadata> {
    const formattedState = await params.state.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    const formattedDistrict = await params.district.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    const ayushmanAvailable = true

    // Create base metadata
    const metadata: Metadata = {
        title: `Top Doctors in ${formattedDistrict}, ${formattedState} | Book Appointments Near You | DoczAppoint`,
        description: `Find top-rated doctors in ${formattedDistrict}, ${formattedState}. ` +
            `${ayushmanAvailable ? 'Ayushman card accepted. ' : ''}` +
            `Book appointments with general physicians, specialists, and clinics near you through DoczAppoint.`,
        keywords: [
            `Doctors in ${formattedDistrict}`,
            `Best doctors near me in ${formattedDistrict}`,
            `Top-rated physicians in ${formattedDistrict}`,
            `Find doctors in ${formattedDistrict}, ${formattedState}`,
            `Nearby doctors in ${formattedDistrict}`,
            `General physicians ${formattedDistrict}`,
            `DoczAppoint doctors directory`,
            ...(ayushmanAvailable ? [
                `Ayushman Bharat doctors in ${formattedDistrict}`,
                `PMJAY doctors in ${formattedDistrict}`,
                `Free treatment doctors in ${formattedDistrict}`
            ] : [])
        ],
        openGraph: {
            title: `Find Doctors in ${formattedDistrict}, ${formattedState} ${ayushmanAvailable ? '| Ayushman Bharat Accepted' : ''} | DoczAppoint`,
            description: `Search and book appointments with top doctors in ${formattedDistrict}, ${formattedState}. ` +
                `${ayushmanAvailable ? 'Ayushman Bharat/PMJAY card accepted. ' : ''}` +
                `Fast, reliable, and nearby.`,
            type: 'website',
            url: `https://doczappoint.com/${params.state}/${params.district}`,
            images: [
                {
                    url: 'https://doczappoint.com/images/doctors-og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Doctors in ${formattedDistrict}${ayushmanAvailable ? ' with Ayushman Bharat' : ''}`,
                },
            ],
            siteName: 'DoczAppoint',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Find Doctors in ${formattedDistrict} ${ayushmanAvailable ? '| Ayushman Bharat' : ''} | Book Nearby Appointments | DoczAppoint`,
            description: `Explore top-rated doctors in ${formattedDistrict}, ${formattedState}. ` +
                `${ayushmanAvailable ? 'Ayushman Bharat card accepted. ' : ''}` +
                `Easily book appointments through DoczAppoint.`,
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

    return metadata
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
