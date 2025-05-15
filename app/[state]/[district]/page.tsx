// app/[state]/[district]/page.tsx
'use client'

import EmergencyResults from "@/components/emergency/emergency-results-location"
import PageHeader from "@/components/shared/page-header"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"
import { useState } from "react"
import EmergencyTypesSlider from "@/components/emergency/emergency-types-slider"
import { useParams } from 'next/navigation'

export default function LocationEmergencyPage() {
    const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null)
    const params = useParams()
    const district = Array.isArray(params.district) ? params.district[0] : params.district
    const state = Array.isArray(params.state) ? params.state[0] : params.state

    const formattedState = state.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    const formattedDistrict = district.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return (
        <AnimatedLayout>
            <PageHeader
                title={`Emergency Services in ${formattedDistrict}`}
                breadcrumb={["Home", formattedState, formattedDistrict, "Emergency"]}
            />
            <div className="bg-gray-50 py-6">
                <div className="container mx-auto px-4">
                    <AnimatedSection animation="slideUp" delay={0.2}>
                        <EmergencyTypesSlider
                            selectedEmergency={selectedEmergency}
                            onSelectEmergency={setSelectedEmergency}
                        />
                    </AnimatedSection>
                    <AnimatedSection animation="fadeIn" delay={0.4}>
                        <EmergencyResults
                            emergencyType={selectedEmergency || ''}
                            location={{
                                district: formattedDistrict,
                                state: formattedState
                            }}
                        />
                    </AnimatedSection>
                </div>
            </div>
        </AnimatedLayout>
    )
}
