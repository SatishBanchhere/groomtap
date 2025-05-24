import { Suspense } from "react"
import Head from "next/head";

interface SearchLayoutProps {
    children: React.ReactNode;
    params: {
        state?: string;
        district?: string;
        test?: string;
    };
    searchParams: {
        state?: string;
        district?: string;
        test?: string;
    };
}

export default function SearchLayout({
                                         children,
                                         params,
                                         searchParams,
                                     }: SearchLayoutProps) {
    // Get the actual values from either params or searchParams
    const state = params.state || searchParams?.state;
    const district = params.district || searchParams?.district;
    const test = params.test || searchParams?.test;

    // Helper function to format text (replace hyphens with spaces and capitalize)
    const formatText = (text?: string) => {
        if (!text) return '';
        return text.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Generate dynamic title and description
    const generateMetadata = () => {
        const formattedState = formatText(state);
        const formattedDistrict = formatText(district);
        const formattedTest = formatText(test);

        let title = 'Find Diagnostic Labs Near You | Book Tests Online';
        let description = 'Search and book diagnostic lab tests near you. Fast, secure, and trusted labs for blood tests, health checkups, and more.';
        let keywords = 'diagnostic labs near me, book lab tests, blood test centers, health checkup, pathology labs';

        if (formattedTest) {
            title = `${formattedTest} Tests`;
            description = `Find the best labs for ${formattedTest.toLowerCase()} tests near you. ${description}`;
            keywords = `${formattedTest.toLowerCase()} test near me, ${keywords}`;
        }

        if (formattedState) {
            title = `${title} in ${formattedState}`;
            description = `${description} Serving ${formattedState}.`;
            keywords = `${keywords}, labs in ${formattedState.toLowerCase()}`;
        }

        if (formattedDistrict) {
            title = `${title}, ${formattedDistrict}`;
            description = `${description} Find local labs in ${formattedDistrict}.`;
            keywords = `${keywords}, labs in ${formattedDistrict.toLowerCase()}`;
        }

        return { title, description, keywords };
    };

    const { title, description, keywords } = generateMetadata();

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://doczappoint.com/labs" />

                {/* Canonical URL - important for SEO */}
                <link
                    rel="canonical"
                    href={`https://doczappoint.com/labs${
                        state ? `/${state}` : ''
                    }${district ? `/${district}` : ''}${
                        test ? `?test=${test}` : ''
                    }`}
                />
            </Head>
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <Suspense fallback={<div>Loading search results...</div>}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </>
    )
}
