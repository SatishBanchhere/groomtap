import { Suspense } from "react"

export default function SearchLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading search results...</div>}>
                    {children}
                </Suspense>
            </div>
        </div>
    )
}
