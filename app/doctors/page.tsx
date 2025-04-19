'use client'

import {useEffect, useState, useCallback} from "react"
import {useSearchParams} from "next/navigation"
import Link from "next/link"
import {ArrowLeft, MapPin, Phone, Mail} from "lucide-react"
import SearchBar from "@/components/doctors/search-bar"
import {collection, getDocs, query, where, orderBy} from "firebase/firestore"
import {db} from "@/lib/firebase"
import Image from "next/image"
import Pagination from "@/components/shared/pagination"

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

interface DoctorWithDistance extends Doctor {
    distance?: string
    distanceValue?: number
}

interface Coordinates {
    lat: number
    lng: number
}

export default function DoctorSearchPage() {
    const searchParams = useSearchParams()
    const [doctors, setDoctors] = useState<DoctorWithDistance[]>([])
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [locationAvailable, setLocationAvailable] = useState(false)
    const searchTerm = searchParams.get('q') || ''
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
                    throw new Error("Geolocation not supported by your browser")
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
                console.error(err)
                setLocationAvailable(false);
                // setError("Location access was denied or unavailable. Distances will not be shown.")
            }
        }

        getUserLocation()
    }, [])

    const geocodeDoctorLocation = async (doctor: Doctor): Promise<Coordinates | null> => {
        try {
            // If doctor already has lat/lng, use that
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

            const doctorsRef = collection(db, "doctors")
            let q = query(doctorsRef, where("status", "==", "active"))

            // Add search filter if search term exists
            if (searchTerm) {
                q = query(
                    q,
                    where("fullName", ">=", searchTerm),
                    where("fullName", "<=", searchTerm + '\uf8ff')
                )
            }

            // Add sorting by creation date (newest first)
            q = query(q, orderBy("createdAt", "desc"))

            const querySnapshot = await getDocs(q)
            const doctorsData: Doctor[] = []

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                doctorsData.push({
                    id: doc.id,
                    fullName: data.fullName || 'Unknown Doctor',
                    specialty: data.specialty || 'General Practitioner',
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
            if(!locationAvailable){
                setDoctors(doctorsData)
                return;
            }
            // const processedDoctors = await processDoctorsWithDistances(doctorsData)
            const processedDoctors = await (async () => {
                return locationAvailable
                    ? await processDoctorsWithDistances(doctorsData)
                    : doctorsData
            })()
            console.log(processedDoctors)
            // Filter doctors to only show those within 100km (100000 meters)
            const nearbyDoctors = processedDoctors.filter(doctor =>
                doctor.distanceValue !== undefined && doctor.distanceValue <= 100000
            )

            if (nearbyDoctors.length > 0) {
                const sortedDoctors = nearbyDoctors.sort((a, b) => {
                    if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                        return a.distanceValue - b.distanceValue
                    }
                    return 0
                })

                setDoctors(sortedDoctors)
            } else {
                const sortedDoctors = processedDoctors.sort((a, b) => {
                    if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                        return a.distanceValue - b.distanceValue
                    }
                    return 0
                })
                console.log(sortedDoctors)
                setDoctors(sortedDoctors)
            }

        } catch (err) {
            console.error("Error fetching doctors:", err)
            setError("Failed to load doctors. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [searchTerm, userCoords])

    useEffect(() => {
        fetchDoctors()
    }, [fetchDoctors])

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-5 h-5 mr-2"/>
                    Back to Home
                </Link>
            </div>

            <div className="mb-8">
                <SearchBar
                    type="doctors"
                    showFilters
                    placeholder={searchTerm || "Search doctors by name or specialty..."}
                    //@ts-ignore
                    defaultValue={searchTerm}
                />
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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <span className="ml-3">Loading nearby doctors...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
                <>
                    <div className="mb-4">
                        {doctors.length > 0 && (
                            <p className="text-sm text-gray-600">
                                {userCoords ? (
                                    <>
                                        Showing {doctors.length} doctors
                                        {doctors.some(d => d.distanceValue && d.distanceValue <= 10000)
                                            ? ' within 10km of your location'
                                            : ' (none within 100km, showing all doctors)'}
                                        {searchTerm ? ` matching "${searchTerm}"` : ''}
                                    </>
                                ) : (
                                    <>
                                        Showing {doctors.length} doctors
                                        {searchTerm ? ` matching "${searchTerm}"` : ''}
                                    </>
                                )}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.length > 0 ? (
                            doctors.map((doctor) => (
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
                                                    <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                                                    <p className="text-sm text-gray-600">
                                                        {getFullLocation(doctor)}
                                                    </p>
                                                </div>
                                            )}

                                            {(doctor.phone || doctor.email) && (
                                                <div className="space-y-2 mb-4">
                                                    {doctor.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={16} className="text-green-500 flex-shrink-0"/>
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
                                                            <Mail size={16} className="text-purple-500 flex-shrink-0"/>
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
                                    No doctors found within 100km {searchTerm ? `matching "${searchTerm}"` : ''}
                                </p>

                            </div>
                        )}
                    </div>

                    {doctors.length > 0 && (
                        <div className="mt-8">
                            <Pagination totalItems={doctors.length}/>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
