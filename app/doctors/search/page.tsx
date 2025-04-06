"use client"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  ArrowLeft, Search, Star, MapPin, Clock, Bed, Ambulance,
  FlaskConical, Heart, ChevronLeft, ChevronRight, Filter
} from "lucide-react"
import Image from "next/image"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"; // Ensure you have firebase setup in your project

type Doctor = {
  id: string
  fullName: string
  specialty: string
  imageUrl: string
  experienceInYears: number
  consultationFees: number
  location: {
    city: string
    address: string
  }
}

type Hospital = {
  id: string
  fullName: string
  imageUrl: string
  beds: number
  emergencyServices: boolean
  location: {
    city: string
    address: string
  }
  specialties: string[]
}

type Lab = {
  id: string
  fullName: string
  imageUrl: string
  tests: string[]
  openingHours: string
  location: {
    city: string
    address: string
  }
}

type EmergencyService = {
  id: string
  name: string
  hospitalId: string
  is24x7: boolean
  contactNumber: string
  hasAmbulance: boolean
  location: {
    city: string
    address: string
  }
}

export default function HealthcareSearchPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State for all data
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [labs, setLabs] = useState<Lab[]>([])
  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([])
  const [loading, setLoading] = useState(true)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState<'all' | 'doctors' | 'hospitals' | 'labs' | 'emergency'>(
      (searchParams.get('category') as any) || 'all'
  )

  // Filter states
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [priceFilter, setPriceFilter] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Filter options derived from data
  const [specialties, setSpecialties] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        // Fetch doctors from Firebase
        const doctorsRef = collection(db, "doctors")
        const doctorsSnapshot = await getDocs(doctorsRef)
        const doctorsData = doctorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Doctor))
        setDoctors(doctorsData)

        // Fetch hospitals from Firebase
        const hospitalsRef = collection(db, "hospitals")
        const hospitalsSnapshot = await getDocs(hospitalsRef)
        const hospitalsData = hospitalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Hospital))
        setHospitals(hospitalsData)

        // Fetch labs from Firebase
        const labsRef = collection(db, "lab_form")
        const labsSnapshot = await getDocs(labsRef)
        const labsData = labsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Lab))
        setLabs(labsData)

        // Fetch emergency services from Firebase
        // We could either have a separate collection for emergency services,
        // or get them from hospitals that have emergency services



        const emergencyServicesData: EmergencyService[] = []

        for (const hospital of hospitalsData) {
          if (hospital.emergencyServices) {
            // Find the emergency details in a subcollection or in the hospital document
            const emergencyRef = collection(db, `hospitals/${hospital.id}/emergencyDetails`)
            const emergencySnapshot = await getDocs(emergencyRef)

            if (!emergencySnapshot.empty) {
              const emergencyData = emergencySnapshot.docs[0].data()
              emergencyServicesData.push({
                id: emergencySnapshot.docs[0].id,
                name: `${hospital.fullName} Emergency`,
                hospitalId: hospital.id,
                is24x7: emergencyData.is24x7 || true,
                contactNumber: emergencyData.contactNumber || '',
                hasAmbulance: emergencyData.hasAmbulance || false,
                location: hospital.location
              })
            }
          }
        }

        setEmergencyServices(emergencyServicesData)

        // Extract unique specialties and cities for filters
        const allSpecialties = [
          ...new Set([
            ...doctorsData.map(d => d.specialty),
            ...hospitalsData.flatMap(h => h.specialties)
          ])
        ]

        const allCities = [
          ...new Set([
            ...doctorsData.map(d => d.location?.city),
            ...hospitalsData.map(h => h.location?.city),
            ...labsData.map(l => l.location?.city)
          ])
        ]

        setSpecialties(allSpecialties)
        setCities(allCities)

      } catch (error) {
        console.error("Error fetching data:", error)
        // Implement error handling
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply search and filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === '' ||
        doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity = cityFilter ? doctor.location.city === cityFilter : true
    const matchesSpecialty = specialtyFilter ? doctor.specialty === specialtyFilter : true
    const matchesPrice = priceFilter ? doctor.consultationFees <= priceFilter : true

    return matchesSearch && matchesCity && matchesSpecialty && matchesPrice
  })

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = searchQuery === '' ||
        hospital.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCity = cityFilter ? hospital.location.city === cityFilter : true
    const matchesSpecialty = specialtyFilter ? hospital.specialties?.includes(specialtyFilter) : true

    return matchesSearch && matchesCity && matchesSpecialty
  })

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = searchQuery === '' ||
        lab.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.tests?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCity = cityFilter ? lab.location?.city === cityFilter : true

    return matchesSearch && matchesCity
  })

  const filteredEmergency = emergencyServices.filter(service => {
    const matchesSearch = searchQuery === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity = cityFilter ? service.location.city === cityFilter : true

    return matchesSearch && matchesCity
  })

  // Pagination logic
  const paginatedDoctors = filteredDoctors.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )
  const paginatedHospitals = filteredHospitals.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )
  const paginatedLabs = filteredLabs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )
  const paginatedEmergency = filteredEmergency.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(
      activeTab === 'doctors' ? filteredDoctors.length / itemsPerPage :
          activeTab === 'hospitals' ? filteredHospitals.length / itemsPerPage :
              activeTab === 'labs' ? filteredLabs.length / itemsPerPage :
                  activeTab === 'emergency' ? filteredEmergency.length / itemsPerPage : 1
  )

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', searchQuery)
    params.set('category', activeTab)
    router.push(`${pathname}?${params.toString()}`)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Reset filters
  const resetFilters = () => {
    setSpecialtyFilter('')
    setCityFilter('')
    setRatingFilter(0)
    setPriceFilter(0)
    setCurrentPage(1)
  }

  return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header and back button */}
          <div className="flex items-center gap-4 mb-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-8 relative">
            <div className="flex gap-2">
              <input
                  type="text"
                  placeholder="Search doctors, hospitals, labs..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>

          {/* Filters panel */}
          {showFilters && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={specialtyFilter}
                        onChange={(e) => setSpecialtyFilter(e.target.value)}
                    >
                      <option value="">All Specialties</option>
                      {[...new Set(specialties)].map((specialty, index) => (
                          <option key={`${specialty}-${index}`} value={specialty}>
                            {specialty}
                          </option>
                      ))}

                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Rating: {ratingFilter}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                        className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price: {priceFilter || 'Any'}
                    </label>
                    <input
                        type="number"
                        placeholder="Any"
                        min="0"
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4 gap-2">
                  <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Reset Filters
                  </button>
                  <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
                className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
                className={`px-4 py-2 font-medium ${activeTab === 'doctors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('doctors')}
            >
              Doctors
            </button>
            <button
                className={`px-4 py-2 font-medium ${activeTab === 'hospitals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('hospitals')}
            >
              Hospitals
            </button>
            <button
                className={`px-4 py-2 font-medium ${activeTab === 'labs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('labs')}
            >
              Labs
            </button>
            {/*<button*/}
            {/*    className={`px-4 py-2 font-medium ${activeTab === 'emergency' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}*/}
            {/*    onClick={() => setActiveTab('emergency')}*/}
            {/*>*/}
            {/*  Emergency*/}
            {/*</button>*/}
          </div>

          {/* Results count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {activeTab === 'all' ? filteredDoctors.length + filteredHospitals.length + filteredLabs.length + filteredEmergency.length :
                activeTab === 'doctors' ? filteredDoctors.length :
                    activeTab === 'hospitals' ? filteredHospitals.length :
                        activeTab === 'labs' ? filteredLabs.length :
                            filteredEmergency.length} results
            </p>
          </div>

          {/* Loading state */}
          {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-4">
                      <div className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-lg"></div>
                        <div className="mt-4 space-y-2">
                          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                          <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* Results */}
          {!loading && (
              <>
                {/* All results */}
                {activeTab === 'all' && (
                    <div className="space-y-8">
                      {filteredDoctors.length > 0 && (
                          <div>
                            <h2 className="text-xl font-bold mb-4">Doctors</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {paginatedDoctors.map(doctor => (
                                  <DoctorCard key={doctor.id} doctor={doctor} />
                              ))}
                            </div>
                          </div>
                      )}

                      {filteredHospitals.length > 0 && (
                          <div>
                            <h2 className="text-xl font-bold mb-4">Hospitals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {paginatedHospitals.map(hospital => (
                                  <HospitalCard key={hospital.id} hospital={hospital} />
                              ))}
                            </div>
                          </div>
                      )}

                      {filteredLabs.length > 0 && (
                          <div>
                            <h2 className="text-xl font-bold mb-4">Diagnostic Labs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {paginatedLabs.map(lab => (
                                  <LabCard key={lab.id} lab={lab} />
                              ))}
                            </div>
                          </div>
                      )}

                      {filteredEmergency.length > 0 && (
                          <div>
                            <h2 className="text-xl font-bold mb-4">Emergency Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {paginatedEmergency.map(service => (
                                  <EmergencyCard key={service.id} service={service} />
                              ))}
                            </div>
                          </div>
                      )}

                      {(filteredDoctors.length === 0 && filteredHospitals.length === 0 &&
                          filteredLabs.length === 0 && filteredEmergency.length === 0) && (
                          <div className="text-center py-12">
                            <p className="text-gray-600">No results found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Doctors results */}
                {activeTab === 'doctors' && (
                    <div>
                      {filteredDoctors.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedDoctors.map(doctor => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))}
                          </div>
                      ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-600">No doctors found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Hospitals results */}
                {activeTab === 'hospitals' && (
                    <div>
                      {filteredHospitals.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedHospitals.map(hospital => (
                                <HospitalCard key={hospital.id} hospital={hospital} />
                            ))}
                          </div>
                      ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-600">No hospitals found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Labs results */}
                {activeTab === 'labs' && (
                    <div>
                      {filteredLabs.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedLabs.map(lab => (
                                <LabCard key={lab.id} lab={lab} />
                            ))}
                          </div>
                      ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-600">No labs found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Emergency results */}
                {activeTab === 'emergency' && (
                    <div>
                      {filteredEmergency.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedEmergency.map(service => (
                                <EmergencyCard key={service.id} service={service} />
                            ))}
                          </div>
                      ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-600">No emergency services found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Pagination */}
                {(activeTab !== 'all' && totalPages > 1) && (
                    <div className="flex justify-center mt-8">
                      <nav className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}
                            >
                              {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </nav>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  )
}
// Card components
function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
      <Link href={`/doctors/${doctor.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4 flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
                src={doctor.imageUrl || "/placeholder-doctor.jpg"}
                alt={`Dr. ${doctor.fullName}`}
                width={80}
                height={80}
                className="object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{doctor.fullName}</h3>
                <p className="text-gray-600 text-sm">{doctor.specialty}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Doctor
            </span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm">
              {/*<div className="flex items-center text-yellow-600">*/}
              {/*  <Star className="w-4 h-4 mr-1" />*/}
              {/*  <span>{doctor.rating.toFixed(1)}</span>*/}
              {/*</div>*/}
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{doctor.experienceInYears} yrs exp</span>
              </div>
            </div>

            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{doctor.location?.city}</span>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <span className="font-medium text-blue-600">₹{doctor.consultationFees}</span>
              <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                Book
              </button>
            </div>
          </div>
        </div>
      </div>
      </Link>
  )
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
      <Link href={`/hospitals/${hospital.id}`}>

      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
              src={hospital.imageUrl || "/placeholder-hospital.jpg"}
              alt={hospital.fullName}
              width={400}
              height={192}
              className="object-cover w-full h-full"
          />
          <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          Hospital
        </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{hospital.fullName}</h3>

          {/*<div className="flex items-center gap-2 text-sm mb-2">*/}
          {/*  <div className="flex items-center text-yellow-600">*/}
          {/*    <Star className="w-4 h-4 mr-1" />*/}
          {/*    <span>{hospital.rating.toFixed(1)}</span>*/}
          {/*  </div>*/}
          {/*  <div className="flex items-center text-gray-500">*/}
          {/*    <Bed className="w-4 h-4 mr-1" />*/}
          {/*    <span>{hospital.beds} beds</span>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="flex items-start text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>{hospital.location.address}, {hospital.location.city}</span>
          </div>

          {hospital.emergencyServices && (
              <div className="mt-2">
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              24/7 Emergency
            </span>
              </div>
          )}

          <div className="mt-4 flex flex-wrap gap-1">
            {hospital.specialties?.slice(0, 3).map(specialty => (
                <span key={specialty} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {specialty}
            </span>
            ))}
            {hospital.specialties?.length > 3 && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              +{hospital.specialties?.length - 3} more
            </span>
            )}
          </div>

          <button className="mt-4 w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            View Details
          </button>
        </div>
      </div>
      </Link>
  )
}

function LabCard({ lab }: { lab: Lab }) {
  return (
      <Link href={`/labs/${lab.id}`}>

      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4 flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
                src={lab.imageUrl || "/placeholder-lab.jpg"}
                alt={lab.fullName}
                width={80}
                height={80}
                className="object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{lab.fullName}</h3>
                <p className="text-gray-600 text-sm">Diagnostic Lab</p>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              Lab
            </span>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {lab.tests?.slice(0, 3).join(', ')}{lab.tests?.length > 3 ? '...' : ''}
              </p>
            </div>

            <div className="flex items-center text-gray-500 text-sm mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{lab.location?.city}</span>
            </div>

            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Clock className="w-4 h-4 mr-1" />
              <span>Open {lab.openingHours}</span>
            </div>

            <button className="mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
              Book Test
            </button>
          </div>
        </div>
      </div>

      </Link>
  )
}

function EmergencyCard({ service }: { service: EmergencyService }) {
  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-red-500">
        <div className="p-4 flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
            <Ambulance className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-gray-600 text-sm">Emergency Service</p>
              </div>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Emergency
            </span>
            </div>

            <div className="mt-2 flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>{service.is24x7 ? '24/7 Available' : 'Limited Hours'}</span>
            </div>

            <div className="mt-2 flex items-start text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{service.location.address}</span>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm font-medium">Ambulance: {service.hasAmbulance ? 'Yes' : 'No'}</span>
              <button className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}
