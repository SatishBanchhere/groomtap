"use client"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs, orderBy, startAt, endAt } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Clock, ArrowLeft } from "lucide-react"
import SearchBar from "@/components/shared/search-bar"

type Doctor = {
  id: string
  fullName: string
  imageUrl: string
  specialty: string
  experience: string
  rating: number
  consultationFee: number
  location: {
    address: string
    city: string
  }
}

export default function DoctorSearchPage() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('q')
  console.log('Search term:', searchTerm)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const doctorsRef = collection(db, "doctors")
        let q = query(doctorsRef)

        // Apply filters based on search params
        const searchQuery = searchParams.get("q")
        const specialty = searchParams.get("specialty")
        const city = searchParams.get("city")
        const minRating = searchParams.get("minRating")
        const maxFee = searchParams.get("maxFee")

        if (searchQuery) {
          // Search by name (case-insensitive)
          q = query(
            doctorsRef,
            orderBy("fullName"),
            startAt(searchQuery.toLowerCase()),
            endAt(searchQuery.toLowerCase() + "\uf8ff")
          )
        }

        if (specialty) {
          q = query(q, where("specialty", "==", specialty))
        }

        if (city) {
          q = query(q, where("location.city", "==", city))
        }

        if (minRating) {
          q = query(q, where("rating", ">=", parseFloat(minRating)))
        }

        if (maxFee) {
          q = query(q, where("consultationFee", "<=", parseInt(maxFee)))
        }

        const snapshot = await getDocs(q)
        const doctorsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Doctor[]

        setDoctors(doctorsData)
      } catch (error) {
        console.error("Error searching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/doctors" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Doctors
        </Link>
      </div>

      <div className="mb-8">
        <SearchBar 
          type="doctors" 
          showFilters 
          placeholder="Search doctors by name, specialty..."
        />
      </div>

      <div className="mb-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-200 h-20 w-20 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No doctors found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Link
                href={`/doctors/${doctor.id}`}
                key={doctor.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={doctor.imageUrl || "/placeholder-doctor.jpg"}
                      alt={`Dr. ${doctor.fullName}`}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{doctor.fullName}</h3>
                    <p className="text-gray-600 text-sm mb-2">{doctor.specialty}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{doctor.rating}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{doctor.experience} years</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{doctor.location?.city}</span>
                    </div>
                    <div className="mt-2 text-[#ff8a3c] font-medium">
                      ₹{doctor.consultationFee} Consultation
                    </div>
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