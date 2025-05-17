// app/doctors/search/page.tsx
'use client'

import {useEffect, useState, useCallback} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import Link from 'next/link'
import {ArrowLeft, MapPin, Phone, Mail} from 'lucide-react'
import Image from 'next/image'
import {motion} from 'framer-motion'
import {collection, getDocs, query, where, orderBy} from 'firebase/firestore'
import {db} from '@/lib/firebase'
import {Button} from '@/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'

type Doctor = {
    id: string
    fullName: string
    specialty: string
    imageUrl?: string
    consultationFees?: string
    experience?: string
    ayushmanCardAvailable: boolean
    qualification?: string
    status?: string
    about?: string
    email?: string
    phone?: string
    createdAt?: string
    location?: {
        address?: string
        city?: string
        state?: string
        pincode?: string
        lat?: number
        lng?: number
    }
}

type Specialty = {
    id: string
    name: string
    imageUrl: string
}

interface DoctorWithDistance extends Doctor {
    distance?: string
    distanceValue?: number
}

interface Coordinates {
    lat: number
    lng: number
}

export default function DoctorSearchPage() {
    const [doctors, setDoctors] = useState<DoctorWithDistance[]>([])
    const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithDistance[]>([])
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [locationAvailable, setLocationAvailable] = useState(false)
    const [specialties, setSpecialties] = useState<Specialty[]>([])
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)


    useEffect(() => {
        const specialityFromUrl = searchParams.get('speciality')
        if (specialityFromUrl) {
            setSearchQuery(specialityFromUrl)
        }
    }, [searchParams]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => setLocationAvailable(true),
                () => setLocationAvailable(false),
                {timeout: 5000}
            )
        }
    }, [])

    useEffect(() => {
        const getUserLocation = async () => {
            try {
                if (!navigator.geolocation) {
                    throw new Error('Geolocation not supported by your browser')
                }

                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 10000,
                        maximumAge: 0,
                        enableHighAccuracy: true
                    })
                })

                setUserCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            } catch (err) {
                console.log(err)
                setLocationAvailable(false)
            }
        }

        getUserLocation()
    }, [])

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const specialtiesRef = collection(db, 'specialties')
                const snapshot = await getDocs(specialtiesRef)
                const specialtiesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Specialty[]
                setSpecialties(specialtiesData)
                console.log(specialtiesData)
            } catch (error) {
                console.error('Error fetching specialties:', error)
            }
        }

        fetchSpecialties()
    }, [])

    useEffect(() => {
        if (!selectedSpecialty) {
            setFilteredDoctors(doctors)
        } else {
            const filtered = doctors.filter(doctor =>
                doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
            )
            setFilteredDoctors(filtered)
        }
        setCurrentPage(1)
    }, [doctors, selectedSpecialty])

    const geocodeDoctorLocation = async (doctor: Doctor): Promise<Coordinates | null> => {
        try {
            if (doctor.location?.lat && doctor.location?.lng) {
                return {
                    lat: doctor.location.lat,
                    lng: doctor.location.lng
                }
            }

            const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            if (!API_KEY || !doctor.location) return null

            const location = doctor.location
            const addressParts = [
                location.address,
                location.city,
                location.state,
                location.pincode
            ].filter(Boolean)

            const fullAddress = addressParts.join(', ')

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}`
            )

            if (!response.ok) return null

            const data = await response.json()
            if (data.status === 'OK' && data.results.length > 0) {
                const location = data.results[0].geometry.location
                return {
                    lat: location.lat,
                    lng: location.lng
                }
            }

            return null
        } catch (err) {
            return null
        }
    }

    const calculateDistance = (coords1: Coordinates, coords2: Coordinates): { text: string, value: number } => {
        const R = 6371e3
        const φ1 = coords1.lat * Math.PI / 180
        const φ2 = coords2.lat * Math.PI / 180
        const Δφ = (coords2.lat - coords1.lat) * Math.PI / 180
        const Δλ = (coords2.lng - coords1.lng) * Math.PI / 180

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c

        let distanceText
        if (distance < 1000) {
            distanceText = `${Math.round(distance)} m`
        } else {
            distanceText = `${(distance / 1000).toFixed(1)} km`
        }

        return {
            text: distanceText,
            value: distance
        }
    }

    const processDoctorsWithDistances = async (doctors: Doctor[]): Promise<DoctorWithDistance[]> => {
        if (!userCoords) {
            return doctors.map(doctor => ({...doctor}))
        }

        const doctorsWithCoordinates = []
        const BATCH_SIZE = 5

        for (let i = 0; i < doctors.length; i += BATCH_SIZE) {
            const batch = doctors.slice(i, i + BATCH_SIZE)
            const batchResults = await Promise.all(
                batch.map(async (doctor) => {
                    const doctorCoords = await geocodeDoctorLocation(doctor)
                    if (doctorCoords) {
                        const distanceResult = calculateDistance(userCoords, doctorCoords)
                        return {
                            ...doctor,
                            distance: distanceResult.text,
                            distanceValue: distanceResult.value
                        }
                    }
                    return {...doctor}
                })
            )
            doctorsWithCoordinates.push(...batchResults)
        }

        return doctorsWithCoordinates
    }

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const doctorsRef = collection(db, 'doctors')
            let q = query(doctorsRef, where('status', '==', 'active'))
            q = query(q, orderBy('createdAt', 'desc'))

            const querySnapshot = await getDocs(q)
            let doctorsData: Doctor[] = []

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                doctorsData.push({
                    id: doc.id,
                    fullName: data.fullName || 'Unknown Doctor',
                    specialty: data.specialty,
                    imageUrl: data.imageUrl,
                    consultationFees: data.consultationFees,
                    experience: data.experience,
                    ayushmanCardAvailable: data.ayushmanCardAvailable,
                    qualification: data.qualification,
                    about: data.about,
                    email: data.email,
                    phone: data.phone,
                    createdAt: data.createdAt,
                    location: data.location
                })
            })

            const processedDoctors = await processDoctorsWithDistances(doctorsData)
            const sortedDoctors = processedDoctors.sort((a, b) => {
                if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                    return a.distanceValue - b.distanceValue
                }
                return 0
            })

            setDoctors(sortedDoctors)
        } catch (err) {
            console.error('Error fetching doctors:', err)
            setError('Failed to load doctors. Please try again later.')
        } finally {
            setLoading(false)
        }
    }, [userCoords, locationAvailable])

    useEffect(() => {
        fetchDoctors()
    }, [fetchDoctors])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery) {
            const filtered = doctors.filter(doctor =>
                doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredDoctors(filtered)
        } else {
            setFilteredDoctors(doctors)
        }
        setCurrentPage(1)
    }

    const getFullLocation = (doctor: Doctor) => {
        if (!doctor.location) return null
        const location = doctor.location
        const addressParts = [
            location.address,
            location.city,
            location.state,
            location.pincode
        ].filter(Boolean)
        return addressParts.join(', ')
    }

    const handleSpecialitySelect = (specialityName: string | null) => {
        setSelectedSpecialty(specialityName);
        setCurrentPage(1);

        const params = new URLSearchParams(searchParams.toString())
        if (specialityName) {
            params.set('speciality', specialityName)
        } else {
            params.delete('speciality')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

        // Pagination calculations
        const indexOfLastItem = currentPage * itemsPerPage
        const indexOfFirstItem = indexOfLastItem - itemsPerPage
        const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem)
        const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5 mr-2"/>
                        Back to Home
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search doctors by name or specialty..."
                                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Specialty Slider - Updated with Larger Boxes */}
                <div className="mb-8">
                    <div className="w-full overflow-x-auto py-4">
                        <div className="flex space-x-4 px-4">
                            {/* All Specialties Button */}
                            <motion.div
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Button
                                    onClick={() => handleSpecialitySelect(null)}
                                    className={`flex flex-col items-center justify-center px-6 py-4 rounded-xl min-w-[120px] ${
                                        !selectedSpecialty
                                            ? 'bg-blue-100 border-2 border-blue-500'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    } transition-colors h-full`}
                                >
                                    <div
                                        className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                                        <span className="text-2xl">👨‍⚕️</span>
                                    </div>
                                    <span className="text-base font-medium">All</span>
                                </Button>
                            </motion.div>

                            {/* Specialty Buttons */}
                            {specialties.map((specialty) => (
                                <motion.div
                                    key={specialty.id}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    <Button
                                        onClick={() => handleSpecialitySelect(specialty.name)}
                                        className={`flex flex-col items-center justify-center px-6 py-4 rounded-xl min-w-[120px] ${
                                            selectedSpecialty === specialty.name
                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        } transition-colors h-full`}
                                    >
                                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 relative">
                                            {specialty.imageUrl ? (
                                                <Image
                                                    src={specialty.imageUrl}
                                                    alt={specialty.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                    onError={(e) => {
                                                        console.error('Failed to load image:', specialty.imageUrl);
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-2xl">🏥</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-base font-medium text-center">
                            {specialty.name}
                        </span>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>


                {error && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                        <p>{error}</p>
                    </div>
                )}

                {!locationAvailable && (
                    <div className="bg-blue-100 text-blue-800 p-3 mb-4 rounded">
                        <p>⚠️ Location not available - showing all doctors</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                        <span className="ml-3">Loading doctors...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : (
                    <>
                        <div className="mb-4">
                            {filteredDoctors.length > 0 && (
                                <p className="text-sm text-gray-600">
                                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredDoctors.length)} of {filteredDoctors.length} doctors
                                    {selectedSpecialty ? ` in ${selectedSpecialty}` : ''}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentDoctors.length > 0 ? (
                                currentDoctors.map((doctor) => (
                                    <div key={doctor.id}
                                         className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    {doctor.imageUrl ? (
                                                        <Image
                                                            src={doctor.imageUrl}
                                                            alt={doctor.fullName}
                                                            width={80}
                                                            height={80}
                                                            className="rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                            {doctor.fullName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">{doctor.fullName}</h3>
                                                    <p className="text-gray-600">{doctor.specialty}</p>
                                                    {doctor.experience && (
                                                        <p className="text-sm text-gray-500">
                                                            {doctor.experience} years experience
                                                        </p>
                                                    )}
                                                    {doctor.distance && (
                                                        <div className="flex items-center mt-1">
                                                            <MapPin className="w-4 h-4 text-blue-500 mr-1"/>
                                                            <span
                                                                className="text-xs text-blue-600">{doctor.distance} away</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                {doctor.about && (
                                                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                                                        {doctor.about}
                                                    </p>
                                                )}

                                                {doctor.location && (
                                                    <div className="flex items-start gap-2 mb-3">
                                                        <MapPin size={16}
                                                                className="text-blue-500 mt-0.5 flex-shrink-0"/>
                                                        <p className="text-sm text-gray-600">
                                                            {getFullLocation(doctor)}
                                                        </p>
                                                    </div>
                                                )}

                                                {(doctor.phone || doctor.email) && (
                                                    <div className="space-y-2 mb-4">
                                                        {doctor.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone size={16}
                                                                       className="text-green-500 flex-shrink-0"/>
                                                                <a
                                                                    href={`tel:${doctor.phone}`}
                                                                    className="text-sm text-green-600 hover:underline"
                                                                >
                                                                    {doctor.phone}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {doctor.email && (
                                                            <div className="flex items-center gap-2">
                                                                <Mail size={16}
                                                                      className="text-purple-500 flex-shrink-0"/>
                                                                <a
                                                                    href={`mailto:${doctor.email}`}
                                                                    className="text-sm text-purple-600 hover:underline"
                                                                >
                                                                    {doctor.email}
                                                                </a>
                                                            </div>
                                                        )}

                                                        {doctor.ayushmanCardAvailable && (
                                                            <div className="flex items-center gap-2">
                                                            <span className="text-green-600 font-medium text-sm">
                                                                ✅ Ayushman Card Accepted
                                                            </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center mt-4">
                                                    {doctor.consultationFees ? (
                                                        <span className="text-primary-600 font-medium">
                                                        ₹{doctor.consultationFees} consultation fee
                                                    </span>
                                                    ) : (
                                                        <span className="text-gray-500">Fee not specified</span>
                                                    )}

                                                    <Link
                                                        href={`/doctors/${doctor.id}`}
                                                        className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                                                    >
                                                        View Profile
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 text-lg">
                                        No doctors found {searchQuery ? `matching "${searchQuery}"` : ''}
                                        {selectedSpecialty ? ` in ${selectedSpecialty}` : ''}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {filteredDoctors.length > itemsPerPage && (
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Items per page:</span>
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(value) => {
                                            setItemsPerPage(Number(value))
                                            setCurrentPage(1)
                                        }}
                                    >
                                        <SelectTrigger className="w-20 bg-white border border-gray-200">
                                            <SelectValue placeholder={itemsPerPage}/>
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-gray-200">
                                            <SelectItem value="6">6</SelectItem>
                                            <SelectItem value="12">12</SelectItem>
                                            <SelectItem value="18">18</SelectItem>
                                            <SelectItem value="24">24</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>

                                    {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                                        let pageNum
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = currentPage - 2 + i
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}

                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <span className="px-3 py-1 flex items-center">...</span>
                                    )}

                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentPage(totalPages)}
                                        >
                                            {totalPages}
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        )
    }
