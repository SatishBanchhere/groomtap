"use client"
import { use, useEffect, useState } from "react"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, ArrowLeft, Star, Clock } from "lucide-react"
import { useParams } from "next/navigation"

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

type Doctor = {
  id: string
  name: string
  imageUrl: string
  specialty: string
  hospitalUid: string
  experience: string
  rating: number
  consultationFee: number
}

export default function HospitalDetailPage({ params }: { params: { id: string } }) {
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  //@ts-ignore
  const {id} = use(params);

  useEffect(() => {
    const fetchHospitalAndDoctors = async () => {
      try {
        // Fetch hospital details
        const hospitalDoc = await getDoc(doc(db, "hospitals", id))
        if (hospitalDoc.exists()) {
          setHospital({
            id: hospitalDoc.id,
            ...hospitalDoc.data()
          } as Hospital)

          // Fetch doctors associated with this hospital
          const doctorsRef = collection(db, "doctors")
          const doctorsQuery = query(doctorsRef, where("hospitalUid", "==", id))
          const doctorsSnapshot = await getDocs(doctorsQuery)
          const doctorsData = doctorsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Doctor[]
          setDoctors(doctorsData)
        }
      } catch (error) {
        console.error("Error fetching hospital and doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitalAndDoctors()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Hospital not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/hospitals" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Hospitals
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="relative h-64 w-full">
          <Image
            src={hospital.imageUrl || "/placeholder-hospital.jpg"}
            alt={hospital.fullName}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{hospital.fullName}</h1>
          <div className="flex flex-col gap-3 text-gray-600 mb-6">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{hospital.location.address}, {hospital.location.city}, {hospital.location.state}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>{hospital.phone}</span>
            </div>
          </div>
          <p className="text-gray-700">{hospital.about}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Doctors at {hospital.fullName}</h2>
          <Link href="/doctors" className="text-[#ff8a3c] hover:text-[#e67a34]">
            View all doctors
          </Link>
        </div>

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
                    alt={doctor.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
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
                  <div className="mt-2 text-[#ff8a3c] font-medium">
                    ₹{doctor.consultationFee} Consultation
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 