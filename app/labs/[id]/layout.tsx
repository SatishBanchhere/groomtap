import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getLabById } from '@/lib/labs'; // Implement this

type Props = {
    params: { id: string };
    children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const lab = await getLabById(params.id);
    const tests = lab.specialties || []; // Assuming specialties contains tests

    const testNames = tests.slice(0, 5).map(t => t.name).join(', ');

    return {
        title: `${lab.fullName} - Lab Tests in ${lab.location.address} | DocZappoint`,
        description: `${lab.fullName} located at ${lab.location.address}. Book lab tests including ${testNames} and more.`,
        keywords: [
            lab.fullName,
            `Lab in ${lab.location.address}`,
            `Book lab tests in ${lab.location.address}`,
            `Home collection lab tests`,
            testNames,
            lab.whatsapp ? `Lab contact ${lab.whatsapp}` : '',
        ],
        openGraph: {
            title: `${lab.fullName} - Lab Tests in ${lab.location.address}`,
            description: `${lab.fullName} located at ${lab.location.address}. Book lab tests including ${testNames} and more.`,
            url: `https://yourwebsite.com/labs/${params.id}`,
            type: 'website',
            images: lab.imageUrl ? [
                {
                    url: lab.imageUrl,
                    width: 800,
                    height: 600,
                    alt: lab.fullName,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${lab.fullName} - Lab Tests in ${lab.location.address}`,
            description: `${lab.fullName} located at ${lab.location.address}. Book lab tests including ${testNames} and more.`,
            images: lab.imageUrl ? [lab.imageUrl] : undefined,
        },
    };
}

export default function LabLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#f8f5ef] min-h-screen">
            {children}
        </div>
    );
}
