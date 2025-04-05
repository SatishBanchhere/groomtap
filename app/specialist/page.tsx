"use client"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"

type Specialty = {
  id: string
  name: string
  imageUrl: string
  description?: string
}

export default function SpecialistPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialtiesRef = collection(db, "specialties")
        const snapshot = await getDocs(specialtiesRef)
        const specialtiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Specialty[]
        setSpecialties(specialtiesData)
      } catch (error) {
        console.error("Error fetching specialties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Medical Specialties</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 8].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {specialties.map((specialty) => (
            <Link 
              href={`/specialist/${specialty.id}`} 
              key={specialty.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={specialty.imageUrl || "/placeholder-specialty.jpg"}
                  alt={specialty.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{specialty.name}</h2>
              {specialty.description && (
                <p className="text-gray-600 text-sm">{specialty.description}</p>
              )}
              <div className="mt-4 bg-[#fff2e7] rounded-full p-2 w-8 h-8 flex items-center justify-center mx-auto">
                <ArrowRight size={16} className="text-[#ff8a3c]" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/doctors" className="btn-primary inline-flex">
          <span>View All Doctors</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

