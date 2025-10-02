import { ReactNode } from 'react';
import { Metadata } from 'next';
import { getHospitalById, getDoctorsByHospital } from '@/lib/hospitals';

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
    children: ReactNode;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    let hospital;
    let specialties: string[] = [];
    const serviceType = searchParams?.service ?
        (Array.isArray(searchParams.service) ? searchParams.service[0] : searchParams.service) :
        undefined;

    try {
        hospital = await getHospitalById(params.id);

        if (hospital) {
            const doctors = await getDoctorsByHospital(params.id);
            specialties = [...new Set(doctors.map(d => d.specialty))]; // Unique specialties
        }
    } catch (error) {
        console.error('Error fetching hospital data:', error);
        return notFoundMetadata();
    }

    if (!hospital) {
        return notFoundMetadata();
    }

    const { fullName, location, about, ayushmanCardAvailable, phone, imageUrl } = hospital;
    const locationString = `${location?.address || ''}${location?.city ? `, ${location.city}` : ''}`;
    const serviceTypeString = serviceType ? `Specializing in ${serviceType} services` : '';
    const specialtiesString = specialties.slice(0, 5).join(', ');

    // Base metadata
    const baseMetadata: Metadata = {
        title: `${fullName} - ${serviceType || 'Salon'} in ${location?.city || ''} | GroomTap`,
        description: `${fullName} ${serviceTypeString} located at ${locationString}. ${about || ''}`,
        keywords: [
            fullName,
            serviceType ? `${serviceType} salon` : 'Salon',
            location?.city ? `Salons in ${location.city}` : 'Salon',
            location?.city ? `Best ${serviceType || 'salon'} in ${location.city}` : 'Salon',
            ...specialties,
            // ...(ayushmanCardAvailable ? ['Ayushman Bharat hospital'] : []),
            ...(phone ? [phone] : []),
        ].filter(Boolean),
        alternates: {
            canonical: serviceType
                ? `https://groomtap.in/salons/${params.id}?service=${encodeURIComponent(serviceType)}`
                : `https://groomtap.in/salons/${params.id}`,
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
        title: 'Salon Not Found | GroomTap',
        description: 'The hospital you are looking for could not be found. Browse our list of partner hospitals.',
        robots: {
            index: false,
            follow: false,
        },
        alternates: undefined
    };
}

export default function HospitalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-white min-h-screen">
            {children}
        </div>
    );
}
