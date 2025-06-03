"use client"
import { use, useEffect, useState } from "react"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image"
import { MapPin, ArrowLeft, Star, Clock } from "lucide-react"

type Specialty = {
  id: string
  name: string
  imageUrl: string
  description?: string
}

type Doctor = {
  id: string
  fullName: string
  imageUrl: string
  specialty: string
  experienceInYears: string
  rating: number
  consultationFees: number
  location: {
    address: string
    city: string
  }
}

export default function SpecialtyDetailPage({ params }: { params: { id: string } }) {
  const [specialty, setSpecialty] = useState<Specialty | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  //@ts-ignore
  const { id } = use(params);

  useEffect(() => {
    const fetchSpecialtyAndDoctors = async () => {
      try {
        // Fetch specialty details
        const specialtyDoc = await getDoc(doc(db, "specialties", id))
        if (specialtyDoc.exists()) {
          setSpecialty({
            id: specialtyDoc.id,
            ...specialtyDoc.data()
          } as Specialty)

          // Fetch doctors with this specialty
          const doctorsRef = collection(db, "doctors")
          const doctorsQuery = query(doctorsRef, where("specialty", "==", specialtyDoc.data().name))
          const doctorsSnapshot = await getDocs(doctorsQuery)
          const doctorsData = doctorsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Doctor[]
          setDoctors(doctorsData)
        }
      } catch (error) {
        console.error("Error fetching specialty and doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialtyAndDoctors()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!specialty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Specialty not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/specialist" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Specialties
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 p-6">
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <Image
              src={specialty.imageUrl || "/placeholder-specialty.jpg"}
              alt={`${specialty.name} Specialist`}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{specialty.name}</h1>
            {specialty.description && (
              <p className="text-gray-700">{specialty.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{specialty.name} Specialists</h2>
          <Link href="/doctors" className="text-[#ff8a3c] hover:text-[#e67a34]">
            View all doctors
          </Link>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No doctors found for this specialty.</p>
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
                          src={doctor.imageUrl || "/placeholder-doctor.png"}
                          alt={doctor.fullName || "Doctor Name"}
                          fill
                          className="object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{doctor.fullName}</h3>
                      <p className="text-gray-600 text-sm mb-2">{doctor.specialty}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {/*<div className="flex items-center">*/}
                        {/*  <Star className="w-4 h-4 text-yellow-400 mr-1" />*/}
                        {/*  <span>{doctor.rating}</span>*/}
                        {/*</div>*/}


                        {/*<span>•</span>*/}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{doctor.experienceInYears} years of experience</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[#ff8a3c] font-medium">
                        ₹{doctor.consultationFees} Consultation
                      </div>
                      {doctor.ayushmanCardAvailable && (
                          <div className="flex items-center gap-2">
                                                            <span className="text-green-600 font-medium text-sm">
                                                              ✅ Ayushman Card Accepted
                                                            </span>
                          </div>
                      )}
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
