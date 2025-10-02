import type { Metadata } from 'next'
import { Suspense } from "react"

export async function generateMetadata({
                                           searchParams,
                                       }: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
    // Get the search parameters
    const searchQuery = searchParams?.q || ''
    const serviceParam = searchParams?.service || ''
    console.log('service param', serviceParam)
    // Format the service name (e.g., "cardiologist" => "Cardiologist")
    const formatServiceName = (service: string) => {
        return service
            .toString()
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const serviceName = serviceParam ? formatServiceName(serviceParam.toString()) : ''

    // Dynamic title and description
    let title = "Find Salons Near You | GroomTap"
    let description = "Search for salons and book beauty services online"

    if (serviceName) {
        title = `${serviceName} Services | Beauty Experts | GroomTap`
        description = `Find the best ${serviceName.toLowerCase()} hospitals and book appointments`
    }

    if (searchQuery) {
        title = `Salons for "${searchQuery}" | GroomTap`
        description = `Search results for "${searchQuery}" | ${description}`
    }

    // Generate canonical URL with search params
    const urlParams = new URLSearchParams()
    if (searchQuery) urlParams.set('q', searchQuery.toString())
    if (serviceParam) urlParams.set('service', serviceParam.toString())
    const canonicalUrl = `https://groomtap.in/salons${
        urlParams.toString() ? `?${urlParams.toString()}` : ''
    }`

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: 'website',
            images: [{
                url: serviceName
                    ? `https://groomtap.in/images/${serviceParam}-og.jpg`
                    : 'https://groomtap.in/images/hospitals-og.jpg',
                width: 1200,
                height: 630,
                alt: title,
            }],
        },
        // ... rest of your metadata config
    }
}

export default function SearchLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </div>
        </div>
    )
}
