import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getDoctorById } from '@/lib/doctors';

type Props = {
    params: { id: string };
    children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    let doctor;

    try {
        doctor = await getDoctorById(params.id);
    } catch (error) {
        console.error('Error fetching doctor:', error);
    }

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

    return {
        title: `Dr. ${doctor.fullName} - ${doctor.specialty} | DocZappoint`,
        description: `Book appointments with Dr. ${doctor.fullName}, ${doctor.specialty} in ${doctor.location.city}. ${doctor.about || ''}`,
        keywords: [
            `Dr. ${doctor.fullName}`,
            `${doctor.specialty} in ${doctor.location.city}`,
            `${doctor.fullName} appointment`,
            `Book ${doctor.specialty} online`,
            `Doctor in ${doctor.location.city}`,
            doctor.qualifications,
        ],
        openGraph: {
            title: `Dr. ${doctor.fullName} - ${doctor.specialty}`,
            description: `Book appointments with Dr. ${doctor.fullName}, ${doctor.specialty} in ${doctor.location.city}`,
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
            title: `Dr. ${doctor.fullName} - ${doctor.specialty}`,
            description: `Book appointments with Dr. ${doctor.fullName}, ${doctor.specialty} in ${doctor.location.city}`,
            images: doctor.imageUrl ? [doctor.imageUrl] : undefined,
        },
    };
}

export default function DoctorLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#f8f5ef] min-h-screen">
            {children}
        </div>
    );
}
