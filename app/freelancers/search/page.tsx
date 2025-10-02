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
import Link from "next/link"

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
        const emergencyServicesData: EmergencyService[] = []

        for (const hospital of hospitalsData) {
          if (hospital.emergencyServices) {
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
    setCurrentPage(1)
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
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header and back button - Repositioned to right */}
          <div className="flex items-center justify-end gap-4 mb-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-green-700 hover:text-emerald-800 font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>

          {/* Tabs - Moved to top */}
          <div className="flex border-b-2 border-emerald-200 mb-8 justify-center">
            <button
                className={`px-6 py-3 font-bold text-lg ${activeTab === 'all' ? 'text-emerald-700 border-b-4 border-emerald-600' : 'text-green-600 hover:text-emerald-700'}`}
                onClick={() => setActiveTab('all')}
            >
              All Services
            </button>
            <button
                className={`px-6 py-3 font-bold text-lg ${activeTab === 'doctors' ? 'text-emerald-700 border-b-4 border-emerald-600' : 'text-green-600 hover:text-emerald-700'}`}
                onClick={() => setActiveTab('doctors')}
            >
              Freelancers
            </button>
            <button
                className={`px-6 py-3 font-bold text-lg ${activeTab === 'hospitals' ? 'text-emerald-700 border-b-4 border-emerald-600' : 'text-green-600 hover:text-emerald-700'}`}
                onClick={() => setActiveTab('hospitals')}
            >
              Salons
            </button>
            <button
                className={`px-6 py-3 font-bold text-lg ${activeTab === 'labs' ? 'text-emerald-700 border-b-4 border-emerald-600' : 'text-green-600 hover:text-emerald-700'}`}
                onClick={() => setActiveTab('labs')}
            >
              Labs
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-8 relative">
            <div className="flex gap-3">
              <input
                  type="text"
                  placeholder="Search freelancers, salons, services..."
                  className="flex-1 border-2 border-emerald-300 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-green-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-medium"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white border-2 border-emerald-300 text-emerald-700 px-6 py-4 rounded-xl hover:bg-emerald-50 flex items-center gap-2 font-medium"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
            <Search className="absolute left-4 top-4.5 text-emerald-500 w-5 h-5" />
          </div>

          {/* Filters panel */}
          {showFilters && (
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border-2 border-emerald-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-green-800 mb-2">Specialty</label>
                    <select
                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none text-green-700"
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
                    <label className="block text-sm font-bold text-green-800 mb-2">City</label>
                    <select
                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none text-green-700"
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
                    <label className="block text-sm font-bold text-green-800 mb-2">
                      Minimum Rating: {ratingFilter}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-green-800 mb-2">
                      Max Price: {priceFilter || 'Any'}
                    </label>
                    <input
                        type="number"
                        placeholder="Any"
                        min="0"
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(parseInt(e.target.value) || 0)}
                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none text-green-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 gap-3">
                  <button
                      onClick={resetFilters}
                      className="px-6 py-3 text-sm text-green-700 border-2 border-emerald-300 rounded-lg hover:bg-emerald-50 font-medium"
                  >
                    Reset Filters
                  </button>
                  <button
                      onClick={() => setShowFilters(false)}
                      className="px-6 py-3 text-sm bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
          )}

          {/* Results count - Moved to center */}
          <div className="mb-6 text-center">
            <p className="text-green-700 font-bold text-lg">
              Showing {activeTab === 'all' ? filteredDoctors.length + filteredHospitals.length + filteredLabs.length + filteredEmergency.length :
                activeTab === 'doctors' ? filteredDoctors.length :
                    activeTab === 'hospitals' ? filteredHospitals.length :
                        activeTab === 'labs' ? filteredLabs.length :
                            filteredEmergency.length} results
            </p>
          </div>

          {/* Loading state */}
          {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-100">
                      <div className="animate-pulse">
                        <div className="bg-emerald-100 h-48 rounded-xl"></div>
                        <div className="mt-4 space-y-3">
                          <div className="bg-emerald-100 h-4 rounded w-3/4"></div>
                          <div className="bg-emerald-100 h-4 rounded w-1/2"></div>
                          <div className="bg-emerald-100 h-4 rounded w-1/4"></div>
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
                    <div className="space-y-12">
                      {filteredDoctors.length > 0 && (
                          <div>
                            <h2 className="text-2xl font-bold mb-6 text-green-800">Expert Freelancers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {paginatedDoctors.map(doctor => (
                                  <DoctorCard key={doctor.id} doctor={doctor} />
                              ))}
                            </div>
                          </div>
                      )}

                      {filteredHospitals.length > 0 && (
                          <div>
                            <h2 className="text-2xl font-bold mb-6 text-green-800">Premium Salons</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {paginatedHospitals.map(hospital => (
                                  <HospitalCard key={hospital.id} hospital={hospital} />
                              ))}
                            </div>
                          </div>
                      )}

                      {(filteredDoctors.length === 0 && filteredHospitals.length === 0 &&
                          filteredLabs.length === 0 && filteredEmergency.length === 0) && (
                          <div className="text-center py-16">
                            <p className="text-green-600 text-xl font-medium">No results found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Doctors results */}
                {activeTab === 'doctors' && (
                    <div>
                      {filteredDoctors.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedDoctors.map(doctor => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))}
                          </div>
                      ) : (
                          <div className="text-center py-16">
                            <p className="text-green-600 text-xl font-medium">No freelancers found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Hospitals results */}
                {activeTab === 'hospitals' && (
                    <div>
                      {filteredHospitals.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedHospitals.map(hospital => (
                                <HospitalCard key={hospital.id} hospital={hospital} />
                            ))}
                          </div>
                      ) : (
                          <div className="text-center py-16">
                            <p className="text-green-600 text-xl font-medium">No salons found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Labs results */}
                {activeTab === 'labs' && (
                    <div>
                      {filteredLabs.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedLabs.map(lab => (
                                <LabCard key={lab.id} lab={lab} />
                            ))}
                          </div>
                      ) : (
                          <div className="text-center py-16">
                            <p className="text-green-600 text-xl font-medium">No labs found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Emergency results */}
                {activeTab === 'emergency' && (
                    <div>
                      {filteredEmergency.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedEmergency.map(service => (
                                <EmergencyCard key={service.id} service={service} />
                            ))}
                          </div>
                      ) : (
                          <div className="text-center py-16">
                            <p className="text-green-600 text-xl font-medium">No emergency services found matching your criteria</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Pagination */}
                {(activeTab !== 'all' && totalPages > 1) && (
                    <div className="flex justify-center mt-12">
                      <nav className="flex items-center gap-3">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border-2 border-emerald-300 text-emerald-700 rounded-lg disabled:opacity-50 hover:bg-emerald-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 border-2 rounded-lg font-medium ${currentPage === page ? 'bg-emerald-600 text-white border-emerald-600' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                            >
                              {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border-2 border-emerald-300 text-emerald-700 rounded-lg disabled:opacity-50 hover:bg-emerald-50"
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

// Card components with green theme
function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
      <Link href={`/freelancers/${doctor.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300">
        <div className="p-6 flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
                src={doctor.imageUrl || "/placeholder-doctor.jpg"}
                alt={`Dr. ${doctor.fullName}`}
                width={80}
                height={80}
                className="object-cover rounded-full border-3 border-emerald-200"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-green-800">{doctor.fullName}</h3>
                <p className="text-emerald-600 text-sm font-medium">{doctor.specialty}</p>
              </div>
              <span className="bg-emerald-200 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
              Freelancer
            </span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm">
              <div className="flex items-center text-green-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-medium">{doctor.experienceInYears} yrs exp</span>
              </div>
            </div>

            <div className="flex items-center text-green-600 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="font-medium">{doctor.location?.city}</span>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold text-emerald-700 text-lg">₹{doctor.consultationFees}</span>
              <button className="text-sm bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-medium">
                Book Now
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
      <Link href={`/salons/${hospital.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300">
        <div className="relative h-48">
          <Image
              src={hospital.imageUrl || "/placeholder-hospital.jpg"}
              alt={hospital.fullName}
              width={400}
              height={192}
              className="object-cover w-full h-full"
          />
          <span className="absolute top-3 right-3 bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
          Salon
        </span>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2 text-green-800">{hospital.fullName}</h3>

          <div className="flex items-start text-green-600 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
            <span className="font-medium">{hospital.location.address}, {hospital.location.city}</span>
          </div>

          {hospital.emergencyServices && (
              <div className="mb-4">
            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
              24/7 Service
            </span>
              </div>
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            {hospital.specialties?.slice(0, 3).map(specialty => (
                <span key={specialty} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              {specialty}
            </span>
            ))}
            {hospital.specialties?.length > 3 && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              +{hospital.specialties?.length - 3} more
            </span>
            )}
          </div>

          <button className="w-full text-center bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-bold">
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300">
        <div className="p-6 flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
                src={lab.imageUrl || "/placeholder-lab.jpg"}
                alt={lab.fullName}
                width={80}
                height={80}
                className="object-cover rounded-full border-3 border-emerald-200"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-green-800">{lab.fullName}</h3>
                <p className="text-emerald-600 text-sm font-medium">Diagnostic Lab</p>
              </div>
              <span className="bg-purple-200 text-purple-800 text-xs px-3 py-1 rounded-full font-bold">
              Lab
            </span>
            </div>

            <div className="mt-2">
              <p className="text-sm text-green-600 font-medium">
                {lab.tests?.slice(0, 3).join(', ')}{lab.tests?.length > 3 ? '...' : ''}
              </p>
            </div>

            <div className="flex items-center text-green-600 text-sm mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="font-medium">{lab.location?.city}</span>
            </div>

            <div className="flex items-center text-green-600 text-sm mt-1">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-medium">Open {lab.openingHours}</span>
            </div>

            <button className="mt-4 text-sm bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-medium">
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-l-4 border-red-500 border-2 border-emerald-100">
        <div className="p-6 flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
            <Ambulance className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-green-800">{service.name}</h3>
                <p className="text-emerald-600 text-sm font-medium">Emergency Service</p>
              </div>
              <span className="bg-red-200 text-red-800 text-xs px-3 py-1 rounded-full font-bold">
              Emergency
            </span>
            </div>

            <div className="mt-2 flex items-center text-sm text-green-600">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-medium">{service.is24x7 ? '24/7 Available' : 'Limited Hours'}</span>
            </div>

            <div className="mt-2 flex items-start text-sm text-green-600">
              <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
              <span className="font-medium">{service.location.address}</span>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-green-700">Ambulance: {service.hasAmbulance ? 'Yes' : 'No'}</span>
              <button className="text-sm bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 font-medium">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}
