import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getDoctorById } from '@/lib/doctors';

type Props = {
    params: { id: string };
    children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    console.log('generateMetadata called for doctor ID:', params.id);

    let doctor;

    try {
        doctor = await getDoctorById(params.id);
    } catch (error) {
        console.error('Error fetching doctor:', error);
    }

    console.log('Generated metadata:', {
        title: doctor ? `${doctor.fullName}` : 'Doctor Not Found',
        doctorId: params.id
    });


    // Fallback metadata when doctor is not found
    if (!doctor) {
        return {
            title: 'Doctor Not Found | DocZappoint',
            description: 'The doctor you are looking for could not be found. Browse our list of available doctors.',
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    // Create base title and description variations
    const nameTitle = `${doctor.fullName} | DocZappoint`;
    const specialtyTitle = `${doctor.fullName} - ${doctor.specialty} | DocZappoint`;

    const nameDescription = `Book appointments with Dr. ${doctor.fullName} in ${doctor.location.city}. ${doctor.about || ''}`;
    const specialtyDescription = `Book appointments with Dr. ${doctor.fullName}, ${doctor.specialty} in ${doctor.location.city}. ${doctor.about || ''}`;

    return {
        // Use both title variations with pipe separator
        title: `${nameTitle} | ${specialtyTitle.replace('DocZappoint', '')}`,
        description: `${nameDescription} ${specialtyDescription}`,
        keywords: [
            `${doctor.fullName}`,
            `${doctor.fullName} doctor`,
            `${doctor.fullName} ${doctor.location.city}`,
            `${doctor.specialty} in ${doctor.location.city}`,
            `${doctor.fullName} appointment`,
            `Book ${doctor.specialty} online`,
            `Doctor in ${doctor.location.city}`,
            doctor.qualifications,
        ],
        openGraph: {
            // Use both title variations
            title: `${nameTitle} | ${specialtyTitle.replace('DocZappoint', '')}`,
            description: `${nameDescription} ${specialtyDescription}`,
            url: `https://doczappoint.com/doctors/${params.id}`,
            type: 'profile',
            // @ts-ignore - TypeScript doesn't recognize the profile property by default
            profile: {
                firstName: doctor.fullName.split(' ')[0],
                lastName: doctor.fullName.split(' ').slice(1).join(' '),
                username: doctor.fullName.replace(/\s+/g, '-').toLowerCase(),
            },
            images: doctor.imageUrl ? [
                {
                    url: doctor.imageUrl,
                    width: 300,
                    height: 300,
                    alt: `Dr. ${doctor.fullName}`,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary',
            // Use both title variations
            title: `${nameTitle} | ${specialtyTitle.replace('DocZappoint', '')}`,
            description: `${nameDescription} ${specialtyDescription}`,
            images: doctor.imageUrl ? [doctor.imageUrl] : undefined,
        },
        // Add alternate titles for SEO
        alternates: {
            canonical: `https://doczappoint.com/doctors/${params.id}`,
        },
        // Additional metadata to help with both variations
        metadataBase: new URL('https://doczappoint.com'),
        other: {
            'name:title': nameTitle,
            'specialty:title': specialtyTitle,
        }
    };
}
export default function DoctorLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#f8f5ef] min-h-screen">
            {children}
        </div>
    );
}
