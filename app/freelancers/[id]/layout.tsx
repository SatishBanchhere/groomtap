import {ReactNode} from 'react';
import {Metadata} from 'next';
import {getDoctorById} from '@/lib/doctors';

type Props = {
    params: { id: string };
    children: ReactNode;
};

// Helper function to format the doctor's name
const formatDoctorName = (fullName: string) => {
    // Remove any existing "Dr." or "Dr " prefix (case insensitive)
    const cleanedName = fullName.replace(/^Dr\.?\s*/i, '').trim();
    return cleanedName;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    console.log('generateMetadata called for groomer ID:', params.id);

    let doctor;

    try {
        doctor = await getDoctorById(params.id);
    } catch (error) {
        console.error('Error fetching groomer:', error);
    }

    console.log('Generated metadata:', {
        title: doctor ? `${doctor.fullName}` : 'Groomer Not Found',
        doctorId: params.id
    });

    // Fallback metadata when doctor is not found
    if (!doctor) {
        return {
            title: 'Groomer Not Found | GroomTap',
            description: 'The groomer you are looking for could not be found. Browse our list of available groomers.',
            robots: {
                index: false,
                follow: false,
            },
            alternates: undefined
        };
    }

    // Format the doctor's name to ensure proper "Dr." prefix
    const formattedName = formatDoctorName(doctor.fullName);

    // Create base title and description variations
    const nameTitle = `${formattedName} | GroomTap`;
    const specialtyTitle = `${formattedName} - ${doctor.specialty} | GroomTap`;

    const nameDescription = `Book appointments with ${formattedName} in ${doctor.location.city}. ${doctor.about || ''}`;
    const specialtyDescription = `Book appointments with ${formattedName}, ${doctor.specialty} in ${doctor.location.city}. ${doctor.about || ''}`;

    return {
        // Use both title variations with pipe separator
        title: `${nameTitle} | ${specialtyTitle.replace('GroomTap', '')}`,
        description: `${nameDescription} ${specialtyDescription}`,
        keywords: [
            `${formattedName}`,
            `${formattedName} doctor`,
            `${formattedName} ${doctor.location.city}`,
            `${doctor.specialty} in ${doctor.location.city}`,
            `${formattedName} appointment`,
            `Book ${doctor.specialty} online`,
            `Doctor in ${doctor.location.city}`,
            doctor.qualifications,
        ],
        openGraph: {
            // Use both title variations
            title: `${nameTitle} | ${specialtyTitle.replace('GroomTap', '')}`,
            description: `${nameDescription} ${specialtyDescription}`,
            url: `https://groomtap.in/freelancers/${params.id}`,
            type: 'profile',
            // @ts-ignore - TypeScript doesn't recognize the profile property by default
            profile: {
                firstName: formattedName.split(' ')[1], // Skip "Dr." for first name
                lastName: formattedName.split(' ').slice(2).join(' '),
                username: formattedName.replace(/\s+/g, '-').toLowerCase(),
            },
            images: doctor.imageUrl ? [
                {
                    url: doctor.imageUrl,
                    width: 300,
                    height: 300,
                    alt: `${formattedName}`,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary',
            // Use both title variations
            title: `${nameTitle} | ${specialtyTitle.replace('GroomTap', '')}`,
            description: `${nameDescription} ${specialtyDescription}`,
            images: doctor.imageUrl ? [doctor.imageUrl] : undefined,
        },
        // Add alternate titles for SEO
        alternates: {
            canonical: `https://groomtap.in/freelancers/${params.id}`,
        },
        // Additional metadata to help with both variations
        metadataBase: new URL('https://groomtap.in'),
        other: {
            'name:title': nameTitle,
            'specialty:title': specialtyTitle,
        }
    };
}

export default function DoctorLayout({children}: { children: ReactNode }) {
    return (
        <div className="bg-[#f8f5ef] min-h-screen">
            {children}
        </div>
    );
}