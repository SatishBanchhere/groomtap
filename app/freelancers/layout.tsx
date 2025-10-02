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

    let title = 'Find Groomers Near You | Book Beauty Services Online | GroomTap';
    let description = 'Easily find beauty groomers near you and book services online with our secure platform.';
    let keywords = [
        'groomers near me',
        'book beauty appointment',
        'online beauty booking',
        'nearby salons',
        'beauty services',
        'GroomTap'
    ];

    if (formattedSpecialty) {
        title = `${formattedSpecialty} Services | Find Beauty Experts | GroomTap`;
        description = `Find the best ${formattedSpecialty.toLowerCase()} experts near you. ${description}`;
        keywords.unshift(`${formattedSpecialty.toLowerCase()} service near me`);
    }

    if (formattedState) {
        title = `${title} in ${formattedState}`;
        description = `${description} Serving ${formattedState}.`;
        keywords.push(`groomers in ${formattedState.toLowerCase()}`);
    }

    if (formattedDistrict) {
        title = `${title}, ${formattedDistrict}`;
        description = `${description} Find local doctors in ${formattedDistrict}.`;
        keywords.push(`groomers in ${formattedDistrict.toLowerCase()}`);
    }

    // Generate canonical URL
    const canonicalUrl = `https://groomtap.in/freelancers${
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
                    url: 'https://groomtap.in/images/doctors-og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Find Salons on GroomTap',
                },
            ],
            siteName: 'GroomTap',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['https://groomtap.in/images/doctors-twitter-image.jpg'],
            site: '@groomtap',
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
