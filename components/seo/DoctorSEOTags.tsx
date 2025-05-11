import Head from 'next/head';
import { Doctor } from '@/app/doctors/[id]/page'; // Define your Doctor type in a shared types file

interface DoctorSEOTagsProps {
    doctor: Doctor;
}

export const DoctorSEOTags = ({ doctor }: DoctorSEOTagsProps) => {
    const pageUrl = `https://yourwebsite.com/doctors/${doctor.id}`;
    const pageTitle = `Dr. ${doctor.fullName} - ${doctor.specialty} | DocZappoint`;
    const pageDescription = `Book appointments with Dr. ${doctor.fullName}, ${doctor.specialty} in ${doctor.location.city}. ${doctor.about || ''}`;

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{pageTitle}</title>
            <meta name="title" content={pageTitle} />
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={getKeywords(doctor)} />
            <link rel="canonical" href={pageUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            {doctor.imageUrl && <meta property="og:image" content={doctor.imageUrl} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={pageUrl} />
            <meta property="twitter:title" content={pageTitle} />
            <meta property="twitter:description" content={pageDescription} />
            {doctor.imageUrl && <meta property="twitter:image" content={doctor.imageUrl} />}
        </Head>
    );
};

// Helper function to generate keywords
const getKeywords = (doctor: Doctor) => {
    return [
        `Dr. ${doctor.fullName}`,
        `${doctor.specialty} in ${doctor.location.city}`,
        `${doctor.fullName} appointment`,
        `Book ${doctor.specialty} online`,
        `Doctor in ${doctor.location.city}`,
        doctor.qualifications,
        doctor.ayushmanCardAvailable ? 'Ayushman Bharat doctor' : '',
    ].filter(Boolean).join(', ');
};

// Structured Data Component
export const DoctorStructuredData = ({ doctor, reviews, averageRating }: {
    doctor: Doctor;
    reviews: Review[];
    averageRating: number;
}) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Physician",
                    "name": `Dr. ${doctor.fullName}`,
                    "description": doctor.about || `${doctor.specialty} in ${doctor.location.city}`,
                    "url": `https://yourwebsite.com/doctors/${doctor.id}`,
                    "telephone": doctor.phone,
                    "image": doctor.imageUrl || undefined,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": doctor.location.address,
                        "addressLocality": doctor.location.city,
                        "addressRegion": doctor.location.state,
                        "postalCode": "", // Add if available
                        "addressCountry": "IN"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": "", // Add if available
                        "longitude": "" // Add if available
                    },
                    "medicalSpecialty": doctor.specialty,
                    "priceRange": `₹${doctor.consultationFees}`,
                    "hasOfferCatalog": {
                        "@type": "OfferCatalog",
                        "name": "Consultation Services",
                        "itemListElement": [{
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Consultation",
                                "description": `Consultation with Dr. ${doctor.fullName}`,
                                "price": doctor.consultationFees,
                                "priceCurrency": "INR"
                            }
                        }]
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
