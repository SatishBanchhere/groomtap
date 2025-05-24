import { Suspense } from "react"
import Head from "next/head";

interface SearchLayoutProps {
    children: React.ReactNode;
    params: {
        state?: string;
        district?: string;
        specialty?: string;
    };
    searchParams: {
        state?: string;
        district?: string;
        specialty?: string;
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
    const specialty = params.specialty || searchParams?.specialty;

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
        const formattedSpecialty = formatText(specialty);

        let title = 'Find Doctors Near You | Book Appointments Online';
        let description = 'Easily find doctors near you and book appointments online with our secure platform.';
        let keywords = 'doctors near me, book doctor appointment, online doctor booking, nearby clinics, health checkup';

        if (formattedSpecialty) {
            title = `${formattedSpecialty} Doctors`;
            description = `Find the best ${formattedSpecialty.toLowerCase()} specialists near you. ${description}`;
            keywords = `${formattedSpecialty.toLowerCase()} doctor near me, ${keywords}`;
        }

        if (formattedState) {
            title = `${title} in ${formattedState}`;
            description = `${description} Serving ${formattedState}.`;
            keywords = `${keywords}, doctors in ${formattedState.toLowerCase()}`;
        }

        if (formattedDistrict) {
            title = `${title}, ${formattedDistrict}`;
            description = `${description} Find local doctors in ${formattedDistrict}.`;
            keywords = `${keywords}, doctors in ${formattedDistrict.toLowerCase()}`;
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
                <meta property="og:url" content="https://doczappoint.com/doctors" />

                {/* Canonical URL - important for SEO */}
                <link
                    rel="canonical"
                    href={`https://doczappoint.com/doctors${
                        state ? `/${state}` : ''
                    }${district ? `/${district}` : ''}${
                        specialty ? `?specialty=${specialty}` : ''
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
