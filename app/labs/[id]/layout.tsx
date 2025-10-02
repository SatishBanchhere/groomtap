import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getLabById, getTestsByLab } from '@/lib/labs';

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
    children: ReactNode;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    let lab;
    let tests: string[] = [];
    const testType = searchParams?.test ?
        (Array.isArray(searchParams.test) ? searchParams.test[0] : searchParams.test) :
        undefined;

    const {id} = await params;
    try {
        lab = await getLabById(id);

        if (lab) {
            const labTests = lab.specialties;
            console.log(labTests);
            tests = [...new Set(labTests.map(t => t.name))]; // Unique test names
        }
    } catch (error) {
        console.error('Error fetching lab data:', error);
        return notFoundMetadata();
    }

    if (!lab) {
        return notFoundMetadata();
    }

    const { fullName, location, about, whatsapp, imageUrl } = lab;
    const locationString = `${location?.address || ''}${location?.city ? `, ${location.city}` : ''}`;
    const testTypeString = testType ? `Specializing in ${testType} tests` : '';
    const testsString = tests.slice(0, 5).join(', ');

    // Base metadata
    const baseMetadata: Metadata = {
        title: `${fullName} - ${testType || 'Diagnostic Lab'} in ${location?.city || ''} | DocZappoint`,
        description: `${fullName} ${testTypeString} located at ${locationString}. ${about || ''} Available tests: ${testsString}`,
        keywords: [
            fullName,
            testType ? `${testType} lab` : 'Diagnostic Lab',
            location?.city ? `Labs in ${location.city}` : 'Diagnostic Lab',
            location?.city ? `Best ${testType || 'diagnostic lab'} in ${location.city}` : 'Diagnostic Lab',
            ...tests,
            ...(whatsapp ? [whatsapp] : []),
            'Blood tests',
            'Pathology lab',
            'Home collection'
        ].filter(Boolean),
        alternates: {
            canonical: testType
                ? `https://doczappoint.com/labs/${id}?test=${encodeURIComponent(testType)}`
                : `https://doczappoint.com/labs/${id}`,
        },
    };

    // Open Graph metadata
    const openGraphMetadata: Metadata['openGraph'] = {
        ...baseMetadata,
        type: 'website',
        images: imageUrl ? [{
            url: imageUrl,
            width: 800,
            height: 600,
            alt: fullName,
        }] : undefined,
    };

    // Twitter metadata
    const twitterMetadata: Metadata['twitter'] = {
        card: 'summary_large_image',
        title: baseMetadata.title as string,
        description: baseMetadata.description as string,
        images: imageUrl ? [imageUrl] : undefined,
    };

    return {
        ...baseMetadata,
        openGraph: openGraphMetadata,
        twitter: twitterMetadata,
    };
}

function notFoundMetadata(): Metadata {
    return {
        title: 'Lab Not Found | DocZappoint',
        description: 'The diagnostic lab you are looking for could not be found. Browse our list of partner labs.',
        robots: {
            index: false,
            follow: false,
        },
        alternates: undefined
    };
}

export default function LabLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#f8f5ef] min-h-screen">
            {children}
        </div>
    );
}
