"use client"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs, orderBy, startAt, endAt } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, ArrowLeft } from "lucide-react"
import SearchBar from "@/components/shared/search-bar"

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
  about: string
}

export default function HospitalSearchPage() {
  const searchParams = useSearchParams()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true)
        const hospitalsRef = collection(db, "hospitals")
        let q = query(hospitalsRef)

        // Apply filters based on search params
        const searchQuery = searchParams.get("q")
        const city = searchParams.get("city")

        if (searchQuery) {
          // Search by name (case-insensitive)
          q = query(
            hospitalsRef,
            orderBy("fullName"),
            startAt(searchQuery.toLowerCase()),
            endAt(searchQuery.toLowerCase() + "\uf8ff")
          )
        }

        if (city) {
          q = query(q, where("location.city", "==", city))
        }

        const snapshot = await getDocs(q)
        const hospitalsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Hospital[]

        setHospitals(hospitalsData)
      } catch (error) {
        console.error("Error searching salons:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/salons" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Salons
        </Link>
      </div>

      <div className="mb-8">
        <SearchBar 
          type="hospitals" 
          showFilters 
          placeholder="Search salons by name, location..."
        />
      </div>

      <div className="mb-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-md">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No salons found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <Link 
                href={`/hospitals/${hospital.id}`} 
                key={hospital.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 