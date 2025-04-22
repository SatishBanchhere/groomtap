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
                <title>Emergency Services Near You | 24x7 Ambulance & Medical Help</title>
                <meta
                    name="description"
                    content="Find 24/7 emergency medical services, ambulance support, and trauma care centers near you. Fast and reliable help when you need it most."
                />
                <meta
                    name="keywords"
                    content="emergency services, ambulance near me, emergency hospital, 24x7 trauma center, urgent care, medical emergency"
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="24x7 Emergency Medical Services" />
                <meta
                    property="og:description"
                    content="Search for emergency services near you including ambulance, trauma care, and emergency hospitals."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://doczappoint.com/emergency" />
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
