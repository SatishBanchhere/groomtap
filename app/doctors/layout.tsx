import type { Metadata } from 'next'
import { Suspense } from "react"

interface SearchLayoutProps {
    children: React.ReactNode;
    params: {
        state?: string;
        district?: string;
        specialty?: string;
    };
    searchParams: {
        state?: string;
        district?: string;
        specialty?: string;
    };
}

export async function generateMetadata({
                                           params,
                                           searchParams
                                       }: {
    params: {
        state?: string;
        district?: string;
        specialty?: string;
    };
    searchParams: {
        state?: string;
        district?: string;
        specialty?: string;
    };
}): Promise<Metadata> {
    // Get the actual values from either params or searchParams
    const state = params.state || searchParams?.state;
    const district = params.district || searchParams?.district;
    const specialty = params.specialty || searchParams?.specialty;

    // Helper function to format text (replace hyphens with spaces and capitalize)
    const formatText = (text?: string) => {
        if (!text) return '';
        return text.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formattedState = formatText(state);
    const formattedDistrict = formatText(district);
    const formattedSpecialty = formatText(specialty);

    let title = 'Find Doctors Near You | Book Appointments Online | DoczAppoint';
    let description = 'Easily find doctors near you and book appointments online with our secure platform.';
    let keywords = [
        'doctors near me',
        'book doctor appointment',
        'online doctor booking',
        'nearby clinics',
        'health checkup',
        'DoczAppoint'
    ];

    if (formattedSpecialty) {
        title = `${formattedSpecialty} Doctors | Find Specialists | DoczAppoint`;
        description = `Find the best ${formattedSpecialty.toLowerCase()} specialists near you. ${description}`;
        keywords.unshift(`${formattedSpecialty.toLowerCase()} doctor near me`);
    }

    if (formattedState) {
        title = `${title} in ${formattedState}`;
        description = `${description} Serving ${formattedState}.`;
        keywords.push(`doctors in ${formattedState.toLowerCase()}`);
    }

    if (formattedDistrict) {
        title = `${title}, ${formattedDistrict}`;
        description = `${description} Find local doctors in ${formattedDistrict}.`;
        keywords.push(`doctors in ${formattedDistrict.toLowerCase()}`);
    }

    // Generate canonical URL
    const canonicalUrl = `https://doczappoint.com/doctors${
        state ? `/${state}` : ''
    }${district ? `/${district}` : ''}${
        specialty ? `?specialty=${specialty}` : ''
    }`;

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: 'website',
            images: [
                {
                    url: 'https://doczappoint.com/images/doctors-og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Find Doctors on DoczAppoint',
                },
            ],
            siteName: 'DoczAppoint',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['https://doczappoint.com/images/doctors-twitter-image.jpg'],
            site: '@doczappoint',
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
    }
}

export default function SearchLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading search results...</div>}>
                    {children}
                </Suspense>
            </div>
        </div>
    )
}
