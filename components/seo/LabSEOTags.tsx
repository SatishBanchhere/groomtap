import { Metadata } from 'next';
import { Lab, Test } from '@/types'; // Define these types based on your data structure

export const generateLabMetadata = (lab: Lab, tests: Test[]): Metadata => {
    const locationString = [
        lab.location?.address,
        lab.location?.city,
        lab.location?.state,
        lab.location?.pincode
    ].filter(Boolean).join(', ');

    const testNames = (lab.specialties || []).slice(0, 5).map(t => t.name).join(', ');
    const services = (lab.services || []).slice(0, 3).join(', ');

    const title = `${lab.fullName} | Diagnostic Lab ${locationString ? `in ${locationString}` : ''} | DocZappoint`;
    const description = `Book lab tests at ${lab.fullName}${locationString ? ` located at ${locationString}` : ''}. ${testNames ? `Offering tests like ${testNames}` : 'Various diagnostic tests available'}. ${services ? `Services include ${services}.` : ''}`;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doczappoint.com';
    const canonicalUrl = `${baseUrl}/labs/${lab.id}`;

    return {
        title,
        description,
        applicationName: 'DocZappoint',
        authors: [{ name: 'DocZappoint', url: baseUrl }],
        generator: 'Next.js',
        keywords: [
            lab.fullName,
            'diagnostic lab',
            'lab tests',
            'blood tests',
            'home collection',
            ...(locationString ? [`labs in ${locationString}`, `diagnostic centers in ${locationString}`] : []),
            ...(testNames ? testNames.split(', ') : []),
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: 'website',
            url: canonicalUrl,
            title,
            description,
            siteName: 'DocZappoint',
            images: lab.imageUrl ? [
                {
                    url: lab.imageUrl.startsWith('http') ? lab.imageUrl : `${baseUrl}${lab.imageUrl}`,
                    width: 800,
                    height: 600,
                    alt: `${lab.fullName} lab`,
                }
            ] : [
                {
                    url: `${baseUrl}/images/lab-default.jpg`,
                    width: 800,
                    height: 600,
                    alt: 'DocZappoint Diagnostic Lab',
                }
            ],
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: lab.imageUrl ?
                (lab.imageUrl.startsWith('http') ? lab.imageUrl : `${baseUrl}${lab.imageUrl}`) :
                `${baseUrl}/images/lab-default.jpg`,
        },
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
            },
        },
        verification: {
            google: 'your-google-verification-code',
        },
        other: {
            'theme-color': '#ffffff',
        },
    };
};
