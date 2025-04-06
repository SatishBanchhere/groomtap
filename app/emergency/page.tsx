// app/emergency/page.tsx
"use client"

import EmergencySearch from "@/components/emergency/emergency-search"
import EmergencyResults from "@/components/emergency/emergency-results"
import { Suspense } from "react"
import PageHeader from "@/components/shared/page-header"

export default function EmergencyPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <PageHeader title="Emergency Services" breadcrumb={["Home", "Emergency"]} />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <EmergencySearch />
                </div>
                <Suspense fallback={<div>Loading emergency services...</div>}>
                    <EmergencyResults />
                </Suspense>
            </div>
        </div>
    )
}
