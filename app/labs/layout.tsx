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
                <title>Find Diagnostic Labs Near You | Book Lab Tests Online</title>
                <meta
                    name="description"
                    content="Search and book diagnostic lab tests near you. Fast, secure, and trusted labs for blood tests, health checkups, and more."
                />
                <meta
                    name="keywords"
                    content="labs near me, diagnostic labs, pathology lab, book lab tests online, health checkup labs"
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Top Diagnostic Labs Near You" />
                <meta
                    property="og:description"
                    content="Easily find and book lab tests online at trusted diagnostic centers near you."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://doczappoint.com/labs" />
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
