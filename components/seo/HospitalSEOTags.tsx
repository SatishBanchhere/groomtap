import Head from 'next/head';
import { Hospital, Doctor, Review } from '@/types/hospital'; // Define your types

interface HospitalSEOTagsProps {
    hospital: Hospital;
    doctors: Doctor[];
}

export const HospitalSEOTags = ({ hospital, doctors }: HospitalSEOTagsProps) => {
    const pageUrl = `https://groomtap.in/salons/${hospital.id}`;
    const pageTitle = `${hospital.fullName} - ${hospital.location.city} | GroomTap`;
    const pageDescription = `${hospital.fullName} located at ${hospital.location.address}, ${hospital.location.city}. ${hospital.about || ''}`;
    const specialties = [...new Set(doctors.map(d => d.specialty))].join(', ');

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{pageTitle}</title>
            <meta name="title" content={pageTitle} />
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={getKeywords(hospital, specialties)} />
            <link rel="canonical" href={pageUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            {hospital.imageUrl && <meta property="og:image" content={hospital.imageUrl} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={pageUrl} />
            <meta property="twitter:title" content={pageTitle} />
            <meta property="twitter:description" content={pageDescription} />
            {hospital.imageUrl && <meta property="twitter:image" content={hospital.imageUrl} />}
        </Head>
    );
};

// Helper function to generate keywords
const getKeywords = (hospital: Hospital, specialties: string) => {
    return [
        hospital.fullName,
        `Salons in ${hospital.location.city}`,
        `${hospital.fullName} ${hospital.location.city}`,
        `Best salon in ${hospital.location.city}`,
        specialties,
        // hospital.ayushmanCardAvailable ? 'Ayushman Bharat hospital' : '',
        hospital.phone,
    ].filter(Boolean).join(', ');
};

// Structured Data Component
export const HospitalStructuredData = ({
                                           hospital,
                                           reviews,
                                           averageRating,
                                           doctors
                                       }: {
    hospital: Hospital;
    reviews: Review[];
    averageRating: number;
    doctors: Doctor[];
}) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BeautySalon",
                    "name": hospital.fullName,
                    "description": hospital.about || `Hospital in ${hospital.location.city}`,
                    "url": `https://groomtap.in/salons/${hospital.id}`,
                    "telephone": hospital.phone,
                    "image": hospital.imageUrl || undefined,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": hospital.location.address,
                        "addressLocality": hospital.location.city,
                        "addressRegion": hospital.location.state,
                        "postalCode": "", // Add if available
                        "addressCountry": "IN"
                    },
                    "medicalSpecialty": [...new Set(doctors.map(d => d.specialty))],
                    "hasOfferCatalog": {
                        "@type": "OfferCatalog",
                        "name": "Beauty Services",
                        "itemListElement": doctors.map(doctor => ({
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": `${doctor.specialty} Service`,
                                "description": `Service with ${doctor.fullName}`,
                                "provider": {
                                    "@type": "Person",
                                    "name": `${doctor.fullName}`,
                                    "medicalSpecialty": doctor.specialty
                                }
                            }
                        }))
                    },
                    "aggregateRating": reviews.length > 0 ? {
                        "@type": "AggregateRating",
                        "ratingValue": averageRating,
                        "reviewCount": reviews.length,
                        "bestRating": "5",
                        "worstRating": "1"
                    } : undefined
                })
            }}
        />
    );
};
