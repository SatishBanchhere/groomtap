import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getDoctorById } from '@/lib/doctors'; // You'll need to implement this

type Props = {
    params: { id: string };
    children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const doctor = await getDoctorById(params.id);

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
            // @ts-ignore
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
