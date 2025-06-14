import { Lab, Review, Test } from '@/types';

export const LabStructuredData = ({ lab, reviews, averageRating, tests }: {
    lab: Lab;
    reviews: Review[];
    averageRating: number;
    tests: Test[]
}) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doczappoint.com';

    const diagnosticLabSchema = {
        "@context": "https://schema.org",
        "@type": "DiagnosticLab",
        "name": lab.fullName,
        "description": lab.about || `Diagnostic lab offering ${tests.map(t => t.name).join(', ') || 'various tests'}`,
        "url": `${baseUrl}/labs/${lab.id}`,
        "logo": lab.imageUrl || `${baseUrl}/logo.png`,
        "image": lab.imageUrl ? [lab.imageUrl] : [`${baseUrl}/images/lab-default.jpg`],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": lab.location?.address,
            "addressLocality": lab.location?.city,
            "addressRegion": lab.location?.state,
            "postalCode": lab.location?.pincode,
        },
        "telephone": lab.whatsapp || lab.contactNumber,
        "openingHours": lab.openingHours || "Mo-Su 08:00-20:00",
        "priceRange": "$$",
        "aggregateRating": reviews.length > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": averageRating,
            "reviewCount": reviews.length,
            "bestRating": 5,
            "worstRating": 1
        } : undefined,
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Diagnostic Tests",
            "itemListElement": tests.map((test, index) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": test.name,
                    "description": test.serviceType,
                    "offeredBy": {
                        "@type": "Organization",
                        "name": lab.fullName
                    }
                }
            }))
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Labs",
                "item": `${baseUrl}/labs`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": lab.fullName,
                "item": `${baseUrl}/labs/${lab.id}`
            }
        ]
    };

    const reviewSchemas = reviews.map(review => ({
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
            "@type": "DiagnosticLab",
            "name": lab.fullName
        },
        "author": {
            "@type": "Person",
            "name": review.userName
        },
        "datePublished": review.createdAt,
        "reviewBody": review.comment,
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.rating,
            "bestRating": 5,
            "worstRating": 1
        }
    }));

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(diagnosticLabSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {reviewSchemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
};
