import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getLabById } from '@/lib/labs';

type Props = {
    params: { id: string };
    children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    let lab;

    try {
        lab = await getLabById(params.id);
    } catch (error) {
        console.error('Error fetching lab:', error);
        return {
            title: 'Lab Not Found | DocZappoint',
            description: 'The diagnostic lab you are looking for could not be found. Browse our list of partner labs.',
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    // If lab exists but is missing required fields
    if (!lab?.fullName || !lab?.location?.address) {
        return {
            title: 'Lab Information Incomplete | DocZappoint',
            description: 'This lab profile is currently incomplete. Please check back later or browse other labs.',
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    const tests = lab.specialties || [];
    const testNames = tests.slice(0, 5).map(t => t.name).join(', ');
    const locationString = `${lab.location.address}${lab.location.city ? `, ${lab.location.city}` : ''}`;

    const baseMetadata: Metadata = {
        title: `${lab.fullName} - Lab Tests in ${locationString} | DocZappoint`,
        description: `${lab.fullName} located at ${locationString}. Book lab tests including ${testNames || 'various tests'} and more.`,
        keywords: [
            lab.fullName,
            `Lab in ${locationString}`,
            `Book lab tests in ${locationString}`,
            'Home collection lab tests',
            ...(testNames ? [testNames] : []),
            ...(lab.whatsapp ? [`Lab contact ${lab.whatsapp}`] : []),
        ].filter(Boolean), // Remove empty strings
        alternates: {
            canonical: `https://doczappoint.com/labs/${params.id}`,
        },
    };

    const openGraphMetadata: Metadata['openGraph'] = {
        ...baseMetadata,
        type: 'website',
        images: lab.imageUrl ? [
            {
                url: lab.imageUrl,
                width: 800,
                height: 600,
                alt: lab.fullName,
            }
        ] : undefined,
    };

    const twitterMetadata: Metadata['twitter'] = {
        card: 'summary_large_image',
        title: baseMetadata.title as string,
        description: baseMetadata.description as string,
        images: lab.imageUrl ? [lab.imageUrl] : undefined,
    };

    return {
        ...baseMetadata,
        openGraph: openGraphMetadata,
        twitter: twitterMetadata,
    };
}

export default function LabLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#f8f5ef] min-h-screen">
            {children}
        </div>
    );
}
