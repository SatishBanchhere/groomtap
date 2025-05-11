import Head from 'next/head';
import { Lab, Test } from '@/types/lab'; // Define your types

interface LabSEOTagsProps {
    lab: Lab;
    tests: Test[];
}

export const LabSEOTags = ({ lab, tests }: LabSEOTagsProps) => {
    const pageUrl = `https://yourwebsite.com/labs/${lab.id}`;
    const pageTitle = `${lab.fullName} - Lab Tests in ${lab.location.address} | DocZappoint`;
    const pageDescription = `${lab.fullName} located at ${lab.location.address}. Book lab tests including ${tests.slice(0, 3).map(t => t.name).join(', ')} and more.`;
    const testNames = tests.map(t => t.name).join(', ');

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{pageTitle}</title>
            <meta name="title" content={pageTitle} />
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={getKeywords(lab, testNames)} />
            <link rel="canonical" href={pageUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            {lab.imageUrl && <meta property="og:image" content={lab.imageUrl} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={pageUrl} />
            <meta property="twitter:title" content={pageTitle} />
            <meta property="twitter:description" content={pageDescription} />
            {lab.imageUrl && <meta property="twitter:image" content={lab.imageUrl} />}
        </Head>
    );
};

// Helper function to generate keywords
const getKeywords = (lab: Lab, testNames: string) => {
    return [
        lab.fullName,
        `Lab in ${lab.location.address}`,
        `Book lab tests in ${lab.location.address}`,
        `Home collection lab tests`,
        testNames,
        lab.whatsapp ? `Lab contact ${lab.whatsapp}` : '',
    ].filter(Boolean).join(', ');
};

// Structured Data Component
export const LabStructuredData = ({
                                      lab,
                                      reviews,
                                      averageRating,
                                      tests
                                  }: {
    lab: Lab;
    reviews: Review[];
    averageRating: number;
    tests: Test[];
}) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "MedicalLaboratory",
                    "name": lab.fullName,
                    "description": lab.about || `Medical laboratory in ${lab.location.address}`,
                    "url": `https://yourwebsite.com/labs/${lab.id}`,
                    "telephone": lab.whatsapp,
                    "image": lab.imageUrl || undefined,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": lab.location.address,
                        "addressLocality": lab.location.address,
                        "addressCountry": "IN"
                    },
                    "availableTest": tests.map(test => ({
                        "@type": "MedicalTest",
                        "name": test.name,
                        "description": test.name,
                        "offers": {
                            "@type": "Offer",
                            "price": test.charge || test.homeCharge || test.visitCharge,
                            "priceCurrency": "INR"
                        }
                    })),
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
