import { Suspense } from "react"
import Head from "next/head";

export default function SearchLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <>
            <Head>
                <title>Find Hospitals Near You | Book Appointments Online</title>
                <meta
                    name="description"
                    content="Search for hospitals near you and book appointments online. Discover multi-speciality hospitals and emergency services in your area."
                />
                <meta
                    name="keywords"
                    content="hospitals near me, book hospital appointment, multi-speciality hospital, emergency hospital, hospital booking online"
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Hospitals Near You" />
                <meta
                    property="og:description"
                    content="Find top-rated hospitals near you. Book appointments online quickly and securely."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://doczappoint.com/hospitals" />
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
