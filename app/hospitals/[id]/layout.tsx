import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getHospitalById } from '@/lib/hospitals'; // Implement this

type Props = {
    params: { id: string };
    children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const hospital = await getHospitalById(params.id);

    const specialties = (await getDoctorsByHospital(params.id)) // Implement this
        .map(d => d.specialty)
        .filter((v, i, a) => a.indexOf(v) === i) // Unique values
        .join(', ');

    return {
        title: `${hospital.fullName} - ${hospital.location.city} | DocZappoint`,
        description: `${hospital.fullName} located at ${hospital.location.address}, ${hospital.location.city}. ${hospital.about || ''}`,
        keywords: [
            hospital.fullName,
            `Hospitals in ${hospital.location.city}`,
            `${hospital.fullName} ${hospital.location.city}`,
            `Best hospital in ${hospital.location.city}`,
            specialties,
            hospital.ayushmanCardAvailable ? 'Ayushman Bharat hospital' : '',
            hospital.phone,
        ],
        openGraph: {
            title: `${hospital.fullName} - ${hospital.location.city}`,
            description: `${hospital.fullName} located at ${hospital.location.address}, ${hospital.location.city}`,
            url: `https://yourwebsite.com/hospitals/${params.id}`,
            type: 'website',
            images: hospital.imageUrl ? [
                {
                    url: hospital.imageUrl,
                    width: 800,
                    height: 600,
                    alt: hospital.fullName,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${hospital.fullName} - ${hospital.location.city}`,
            description: `${hospital.fullName} located at ${hospital.location.address}, ${hospital.location.city}`,
            images: hospital.imageUrl ? [hospital.imageUrl] : undefined,
        },
    };
}

export default function HospitalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-white min-h-screen">
            {children}
        </div>
    );
}
