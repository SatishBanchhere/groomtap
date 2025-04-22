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
                <title>Find Doctors Near You | Book Appointments Online</title>
                <meta
                    name="description"
                    content="Easily find doctors near you and book appointments online with our secure, fast doctor search platform."
                />
                <meta name="keywords" content="doctors near me, book doctor appointment, online doctor booking, nearby clinics, health checkup" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Find Doctors Near You" />
                <meta property="og:description" content="Book appointments with nearby doctors in just a few clicks." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://doczappoint.com/doctors" />
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
