'use client'

import EmergencySearch from "@/components/emergency/emergency-search"
import EmergencyResults from "@/components/emergency/emergency-results"
import PageHeader from "@/components/shared/page-header"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"

export default function EmergencyPage() {
    return (
        <AnimatedLayout>
            <PageHeader title="Emergency Services" breadcrumb={["Home", "Emergency"]} />
            <div className="bg-gray-50 py-6">
                <div className="container mx-auto px-4">
                    {/*<AnimatedSection animation="slideUp" delay={0.2}>*/}
                    {/*    <EmergencySearch />*/}
                    {/*</AnimatedSection>*/}
                    <AnimatedSection animation="fadeIn" delay={0.4}>
                        <EmergencyResults />
                    </AnimatedSection>
                </div>
            </div>
        </AnimatedLayout>
    )
}
