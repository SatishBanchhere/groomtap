"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"
import PageHeader from "@/components/shared/page-header"

type Hospital = {
  id: string
  fullName: string
  imageUrl: string
  location: {
    address: string
    city: string
    state: string
  }
  phone: string
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalsRef = collection(db, "hospitals")
        const snapshot = await getDocs(hospitalsRef)
        const hospitalsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Hospital[]
        setHospitals(hospitalsData)
      } catch (error) {
        console.error("Error fetching hospitals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [])

  return (
    <AnimatedLayout>
      <PageHeader title="Our Hospitals" breadcrumb={["Home", "Hospitals"]} />
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="slideUp" delay={0.2}>
          <h1 className="text-3xl font-bold mb-8">Find the Best Hospitals</h1>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-4">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital, index) => (
              <AnimatedSection
                key={hospital.id}
                animation="scale"
                delay={0.2 + index * 0.1}
              >
                <Link 
                  href={`/hospitals/${hospital.id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={hospital.imageUrl || "/placeholder-hospital.jpg"}
                      alt={hospital.fullName}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{hospital.fullName}</h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{hospital.location.address}, {hospital.location.city}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{hospital.phone}</span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </AnimatedLayout>
  )
} 