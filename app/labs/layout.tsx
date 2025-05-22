import { Suspense } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { state, district, test } = router.query;

    // Base metadata
    let title = "Find Diagnostic Labs Near You | Book Lab Tests Online";
    let description = "Search and book diagnostic lab tests near you. Fast, secure, and trusted labs for blood tests, health checkups, and more.";
    let keywords = "labs near me, diagnostic labs, pathology lab, book lab tests online, health checkup labs";
    let canonicalUrl = "https://doczappoint.com/labs";

    // Dynamic metadata based on URL params
    if (state && district && test) {
        const formattedState = decodeURIComponent(state as string).replace(/-/g, ' ');
        const formattedDistrict = decodeURIComponent(district as string).replace(/-/g, ' ');
        const formattedTest = decodeURIComponent(test as string).replace(/-/g, ' ');

        title = `Best ${formattedTest} Labs in ${formattedDistrict}, ${formattedState} | Book Online`;
        description = `Find top-rated ${formattedTest} labs in ${formattedDistrict}, ${formattedState}. Book tests online with home sample collection and get accurate results.`;
        keywords = `${formattedTest} test, ${formattedDistrict} labs, ${formattedState} pathology centers, ${formattedTest} near me, diagnostic centers in ${formattedDistrict}`;
        canonicalUrl = `https://doczappoint.com/labs?state=${state}&district=${district}&test=${test}`;
    } else if (state && district) {
        const formattedState = decodeURIComponent(state as string).replace(/-/g, ' ');
        const formattedDistrict = decodeURIComponent(district as string).replace(/-/g, ' ');

        title = `Diagnostic Labs in ${formattedDistrict}, ${formattedState} | Book Tests Online`;
        description = `Find and book lab tests at trusted diagnostic centers in ${formattedDistrict}, ${formattedState}. Blood tests, health packages, and more.`;
        keywords = `${formattedDistrict} labs, ${formattedState} pathology centers, diagnostic centers in ${formattedDistrict}, blood test labs near me`;
        canonicalUrl = `https://doczappoint.com/labs?state=${state}&district=${district}`;
    } else if (test) {
        const formattedTest = decodeURIComponent(test as string).replace(/-/g, ' ');

        title = `Best ${formattedTest} Labs Near You | Book Online Tests`;
        description = `Find top-rated labs for ${formattedTest} near you. Book tests online with quick results and home sample collection available.`;
        keywords = `${formattedTest} test, ${formattedTest} near me, ${formattedTest} lab centers, book ${formattedTest} online`;
        canonicalUrl = `https://doczappoint.com/labs?test=${test}`;
    }

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="robots" content="index, follow" />

                {/* Open Graph / Facebook */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content="https://doczappoint.com/images/labs-og-image.jpg" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="https://doczappoint.com/images/labs-twitter-image.jpg" />

                {/* Canonical URL */}
                <link rel="canonical" href={canonicalUrl} />

                {/* Schema.org markup */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "MedicalOrganization",
                        "name": "DoczAppoint Diagnostic Labs",
                        "description": description,
                        "url": canonicalUrl,
                        "sameAs": [
                            "https://www.facebook.com/doczappoint",
                            "https://www.twitter.com/doczappoint"
                        ]
                    })}
                </script>
            </Head>
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <Suspense fallback={<div>Loading search results...</div>}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </>
    );
}
