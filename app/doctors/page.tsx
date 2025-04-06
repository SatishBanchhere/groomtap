"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SearchBar from "@/components/shared/search-bar"
import DoctorResults from "@/components/doctors/doctor-results"
// import HospitalResults from "@/components/"
import LabResults from "@/components/labs/lab-results"
import EmergencyResults from "@/components/emergency/emergency-results"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type SearchCategory = 'all' | 'doctors' | 'hospitals' | 'labs' | 'emergency'

export default function HealthcareSearchPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<SearchCategory>('all')
  const searchTerm = searchParams.get('q') || ''

  useEffect(() => {
    const category = searchParams.get('category') as SearchCategory
    if (category && ['all', 'doctors', 'hospitals', 'labs', 'emergency'].includes(category)) {
      setActiveTab(category)
    }
  }, [searchParams])

  return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <SearchBar
              type="healthcare"
              showFilters
              placeholder={searchTerm || "Search doctors, hospitals, labs..."}
              defaultValue={searchTerm}
          />
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SearchCategory)}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-8">
              <Section title="Doctors">
                <DoctorResults />
              </Section>
              {/*<Section title="Hospitals">*/}
              {/*  <HospitalResults />*/}
              {/*</Section>*/}
              <Section title="Diagnostic Labs">
                <LabResults />
              </Section>
              <Section title="Emergency Services">
                <EmergencyResults />
              </Section>
            </div>
          </TabsContent>
          <TabsContent value="doctors">
            <DoctorResults />
          </TabsContent>
          {/*<TabsContent value="hospitals">*/}
          {/*  <HospitalResults />*/}
          {/*</TabsContent>*/}
          <TabsContent value="labs">
            <LabResults />
          </TabsContent>
          <TabsContent value="emergency">
            <EmergencyResults />
          </TabsContent>
        </Tabs>
      </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
      <section>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </section>
  )
}
