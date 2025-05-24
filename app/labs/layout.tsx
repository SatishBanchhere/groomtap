// app/labs/layout.tsx (Server Component)
import { Metadata } from 'next';
import SearchLayout from './SearchLayout';

export async function generateMetadata({
                                           searchParams,
                                       }: {
    searchParams: URLSearchParams;
}): Promise<Metadata> {
    const state = searchParams?.get('state');
    const district = searchParams?.get('district');
    const test = searchParams?.get('test');

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

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            images: [
                {
                    url: 'https://doczappoint.com/images/labs-og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['https://doczappoint.com/images/labs-twitter-image.jpg'],
        },
    };
}

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    return <SearchLayout searchParams={searchParams} />;
}
