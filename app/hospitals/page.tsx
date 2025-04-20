// app/hospitals/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Hospital = {
    id: string
    fullName: string
    services: string[]
    imageUrl?: string
    ayushmanCardAvailable: boolean
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

type Service = {
    id: string
    name: string
    imageUrl?: string
}

interface HospitalWithDistance extends Hospital {
    distance?: string
    distanceValue?: number
}

interface Coordinates {
    lat: number
    lng: number
}

export default function HospitalPage() {
    const searchParams = useSearchParams()
    const [hospitals, setHospitals] = useState<HospitalWithDistance[]>([])
    const [filteredHospitals, setFilteredHospitals] = useState<HospitalWithDistance[]>([])
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [locationAvailable, setLocationAvailable] = useState(false)
    const [services, setServices] = useState<Service[]>([])
    const [selectedService, setSelectedService] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)

    const searchTerm = searchParams.get('q') || ''
    const serviceParam = searchParams.get('service') || ''

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => setLocationAvailable(true),
                () => setLocationAvailable(false),
                { timeout: 5000 }
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
        const fetchServices = async () => {
            try {
                const servicesRef = collection(db, 'allServices')
                const snapshot = await getDocs(servicesRef)
                const servicesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Service[]
                setServices(servicesData)

                if (serviceParam) {
                    const matchedService = servicesData.find(s =>
                        s.name.toLowerCase() === serviceParam.toLowerCase()
                    )
                    if (matchedService) {
                        setSelectedService(matchedService.name)
                    }
                }
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }

        fetchServices()
    }, [serviceParam])

    const geocodeHospitalLocation = async (hospital: Hospital): Promise<Coordinates | null> => {
        try {
            if (hospital.location?.lat && hospital.location?.lng) {
                return {
                    lat: hospital.location.lat,
                    lng: hospital.location.lng
                }
            }

            const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            if (!API_KEY || !hospital.location) return null

            const location = hospital.location
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

    const processHospitalsWithDistances = async (hospitals: Hospital[]): Promise<HospitalWithDistance[]> => {
        if (!userCoords) {
            return hospitals.map(hospital => ({ ...hospital }))
        }

        const hospitalsWithCoordinates = []
        const BATCH_SIZE = 5

        for (let i = 0; i < hospitals.length; i += BATCH_SIZE) {
            const batch = hospitals.slice(i, i + BATCH_SIZE)
            const batchResults = await Promise.all(
                batch.map(async (hospital) => {
                    const hospitalCoords = await geocodeHospitalLocation(hospital)
                    if (hospitalCoords) {
                        const distanceResult = calculateDistance(userCoords, hospitalCoords)
                        return {
                            ...hospital,
                            distance: distanceResult.text,
                            distanceValue: distanceResult.value
                        }
                    }
                    return { ...hospital }
                })
            )
            hospitalsWithCoordinates.push(...batchResults)
        }

        return hospitalsWithCoordinates
    }

    const fetchHospitals = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const hospitalsRef = collection(db, 'hospitals')
            let q = query(hospitalsRef, where('status', '==', 'active'))

            if (searchTerm) {
                q = query(
                    q,
                    where('fullName', '>=', searchTerm),
                    where('fullName', '<=', searchTerm + '\uf8ff')
                )
            }

            if (selectedService) {
                q = query(q, where('services', 'array-contains', selectedService))
            }

            q = query(q, orderBy('createdAt', 'desc'))

            const querySnapshot = await getDocs(q)
            const hospitalsData: Hospital[] = []

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                hospitalsData.push({
                    id: doc.id,
                    fullName: data.fullName || 'Unknown Hospital',
                    services: data.services || [],
                    imageUrl: data.imageUrl,
                    ayushmanCardAvailable: data.ayushmanCardAvailable,
                    about: data.about,
                    email: data.email,
                    phone: data.phone,
                    createdAt: data.createdAt,
                    location: data.location
                })
            })

            if (!locationAvailable) {
                setHospitals(hospitalsData)
                setFilteredHospitals(hospitalsData)
                return
            }

            const processedHospitals = await processHospitalsWithDistances(hospitalsData)
            const nearbyHospitals = processedHospitals.filter(hospital =>
                hospital.distanceValue !== undefined && hospital.distanceValue <= 100000
            )

            if (nearbyHospitals.length > 0) {
                const sortedHospitals = nearbyHospitals.sort((a, b) => {
                    if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                        return a.distanceValue - b.distanceValue
                    }
                    return 0
                })
                setHospitals(sortedHospitals)
                setFilteredHospitals(sortedHospitals)
            } else {
                const sortedHospitals = processedHospitals.sort((a, b) => {
                    if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                        return a.distanceValue - b.distanceValue
                    }
                    return 0
                })
                setHospitals(sortedHospitals)
                setFilteredHospitals(sortedHospitals)
            }
        } catch (err) {
            console.error('Error fetching hospitals:', err)
            setError('Failed to load hospitals. Please try again later.')
        } finally {
            setLoading(false)
        }
    }, [searchTerm, userCoords, selectedService, locationAvailable])

    useEffect(() => {
        fetchHospitals()
    }, [fetchHospitals])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (searchQuery) params.set('q', searchQuery)
        if (selectedService) params.set('service', selectedService)
        window.location.href = `/hospitals?${params.toString()}`
    }

    const getFullLocation = (hospital: Hospital) => {
        if (!hospital.location) return null
        const location = hospital.location
        const addressParts = [
            location.address,
            location.city,
            location.state,
            location.pincode
        ].filter(Boolean)
        return addressParts.join(', ')
    }

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentHospitals = filteredHospitals.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage)

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
                            placeholder="Search hospitals by name or services..."
                            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

            {/* Services Slider */}
            <div className="mb-8">
                <div className="w-full overflow-x-auto py-4">
                    <div
                        onClick={()=>{
                            setSelectedService(null)
                        }}
                        className="flex space-x-4 px-4">
                        <Link
                            href={`/hospitals`}
                            className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-fit ${
                                !selectedService
                                    ? 'bg-blue-100 border border-blue-500'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            } transition-colors`}
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                <span className="text-lg">🏥</span>
                            </div>

                            <span className="text-sm font-medium">All</span>
                        </Link>

                        {services.map((service) => (
                            <motion.div
                                key={service.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={`/hospitals?q=${searchTerm}&service=${encodeURIComponent(
                                        service.name
                                    )}`}
                                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-fit ${
                                        selectedService === service.name
                                            ? 'bg-blue-100 border border-blue-500'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    } transition-colors`}
                                >
                                    {service.imageUrl ? (
                                        <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                                            <Image
                                                src={service.imageUrl}
                                                alt={service.name}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                            <span className="text-lg">🩺</span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-center">
                                        {service.name}
                                    </span>
                                </Link>
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
                    <p>⚠️ Location not available - showing all hospitals</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <span className="ml-3">Loading nearby hospitals...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
                <>
                    <div className="mb-4">
                        {filteredHospitals.length > 0 && (
                            <p className="text-sm text-gray-600">
                                {userCoords ? (
                                    <>
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHospitals.length)} of {filteredHospitals.length} hospitals
                                        {filteredHospitals.some(d => d.distanceValue && d.distanceValue <= 10000)
                                            ? ' within 10km of your location'
                                            : ' (none within 100km, showing all hospitals)'}
                                        {searchTerm ? ` matching "${searchTerm}"` : ''}
                                        {selectedService ? ` with ${selectedService} service` : ''}
                                    </>
                                ) : (
                                    <>
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHospitals.length)} of {filteredHospitals.length} hospitals
                                        {searchTerm ? ` matching "${searchTerm}"` : ''}
                                        {selectedService ? ` with ${selectedService} service` : ''}
                                    </>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentHospitals.length > 0 ? (
                            currentHospitals.map((hospital) => (
                                <div key={hospital.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {hospital.imageUrl ? (
                                                    <Image
                                                        src={hospital.imageUrl}
                                                        alt={hospital.fullName}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                        {hospital.fullName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{hospital.fullName}</h3>
                                                {hospital.distance && (
                                                    <div className="flex items-center mt-1">
                                                        <MapPin className="w-4 h-4 text-blue-500 mr-1"/>
                                                        <span className="text-xs text-blue-600">{hospital.distance} away</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            {hospital.about && (
                                                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                                                    {hospital.about}
                                                </p>
                                            )}

                                            {hospital.location && (
                                                <div className="flex items-start gap-2 mb-3">
                                                    <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                                                    <p className="text-sm text-gray-600">
                                                        {getFullLocation(hospital)}
                                                    </p>
                                                </div>
                                            )}

                                            {hospital.services && hospital.services.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Services:</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {hospital.services.slice(0, 3).map((service, index) => (
                                                            <span
                                                                key={`${service}-${index}`}
                                                                className="bg-gray-50 px-2 py-1 rounded text-xs border border-gray-200"
                                                            >
                                                                {service}
                                                            </span>
                                                        ))}
                                                        {hospital.services.length > 3 && (
                                                            <span className="bg-gray-50 px-2 py-1 rounded text-xs border border-gray-200">
                                                                +{hospital.services.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {(hospital.phone || hospital.email) && (
                                                <div className="space-y-2 mb-4">
                                                    {hospital.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={16} className="text-green-500 flex-shrink-0"/>
                                                            <a
                                                                href={`tel:${hospital.phone}`}
                                                                className="text-sm text-green-600 hover:underline"
                                                            >
                                                                {hospital.phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {hospital.email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={16} className="text-purple-500 flex-shrink-0"/>
                                                            <a
                                                                href={`mailto:${hospital.email}`}
                                                                className="text-sm text-purple-600 hover:underline"
                                                            >
                                                                {hospital.email}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {hospital.ayushmanCardAvailable && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-green-600 font-medium text-sm">
                                                                ✅ Ayushman Card Accepted
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex justify-end mt-4">
                                                <Link
                                                    href={`/hospitals/${hospital.id}`}
                                                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No hospitals found {searchTerm ? `matching "${searchTerm}"` : ''}
                                    {selectedService ? ` with ${selectedService} service` : ''}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredHospitals.length > itemsPerPage && (
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
                                        <SelectValue placeholder={itemsPerPage} />
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

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
