// "use client"
import PageHeader from "@/components/shared/page-header"
import LabSearch from "@/components/labs/lab-search"
import LabResults from "@/components/labs/lab-results"
import Pagination from "@/components/shared/pagination"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"
import { getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Lab } from '@/types/lab'

async function getLabs(): Promise<Lab[]> {
    const doctorsRef = collection(db, "lab_form")
    const snapshot = await getDocs(doctorsRef)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Lab[]
}

export default async function DoctorsPage() {
    const labs = await getLabs()

    return (
        <AnimatedLayout>
            <PageHeader title="Search Labs" breadcrumb={["Home", "Search Labs"]} />
            <div className="bg-background py-6">
                <div className="container mx-auto px-4">
                    <AnimatedSection animation="slideUp" delay={0.2}>
                        <LabSearch />
                    </AnimatedSection>

                    <AnimatedSection animation="fadeIn" delay={0.4}>
                        <LabResults labs={labs} />
                    </AnimatedSection>

                    <AnimatedSection animation="slideUp" delay={0.6}>
                        <Pagination />
                    </AnimatedSection>
                </div>
            </div>
        </AnimatedLayout>
    )
}
