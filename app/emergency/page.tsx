// app/emergency/page.tsx
'use client'

import EmergencyResults from "@/components/emergency/emergency-results"
import PageHeader from "@/components/shared/page-header"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"
import { useState } from "react"
import EmergencyTypesSlider from "@/components/emergency/emergency-types-slider"

export default function EmergencyPage() {
    const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null)

    return (
        <AnimatedLayout>
            <PageHeader title="Emergency Services" breadcrumb={["Home", "Emergency"]} />
            <div className="bg-gray-50 py-6">
                <div className="container mx-auto px-4">
                    <AnimatedSection animation="slideUp" delay={0.2}>
                        <EmergencyTypesSlider
                            selectedEmergency={selectedEmergency}
                            onSelectEmergency={setSelectedEmergency}
                        />
                    </AnimatedSection>
                    <AnimatedSection animation="fadeIn" delay={0.4}>
                        <EmergencyResults emergencyType={selectedEmergency || ''} />
                    </AnimatedSection>
                </div>
            </div>
        </AnimatedLayout>
    )
}
