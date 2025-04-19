// components/emergency/emergency-results.tsx
'use client'

import { useEffect, useState, useCallback } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import EmergencyCard from "./emergency-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type HospitalWithEmergency = {
    id: string
    fullName: string
    imageUrl?: string
    emergencyServices: {
        is24x7: boolean
        name: string
        startTime: string
        endTime: string
        fees: number
    }[]
    location: {
        address: string
        city: string
        district: string
        state: string
        pincode?: string
        lat?: number
        lng?: number
    }
    status: string
    distance?: string
    distanceValue?: number
}

interface Coordinates {
    lat: number
    lng: number
}

export default function EmergencyResults({ emergencyType }: { emergencyType: string }) {
    const searchParams = useSearchParams()
    const location = searchParams.get('location') || ''
    const [hospitals, setHospitals] = useState<HospitalWithEmergency[]>([])
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)
    const totalPages = Math.ceil(hospitals.length / itemsPerPage)

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
                setError("Location access was denied or unavailable. Distances will not be shown.")
            }
        }

        getUserLocation()
    }, [])

    const geocodeHospitalAddress = async (hospital: HospitalWithEmergency): Promise<Coordinates | null> => {
        try {
            if (hospital.location.lat && hospital.location.lng) {
                return {
                    lat: hospital.location.lat,
                    lng: hospital.location.lng
                }
            }

            const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            if (!API_KEY) return null

            const location = hospital.location
            const addressParts = [
                location.address,
                location.city,
                location.district,
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

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        const distance = R * c

        let distanceText
        if (distance < 1000) {
            distanceText = `${Math.round(distance)} m`
        } else {
            distanceText = `${(distance/1000).toFixed(1)} km`
        }

        return {
            text: distanceText,
            value: distance
        }
    }

    const processHospitalsWithDistances = async (hospitals: HospitalWithEmergency[]): Promise<HospitalWithEmergency[]> => {
        if (!userCoords) {
            return hospitals.map(hospital => ({ ...hospital }))
        }

        const hospitalsWithCoordinates = []
        const BATCH_SIZE = 5

        for (let i = 0; i < hospitals.length; i += BATCH_SIZE) {
            const batch = hospitals.slice(i, i + BATCH_SIZE)
            const batchResults = await Promise.all(
                batch.map(async (hospital) => {
                    const hospitalCoords = await geocodeHospitalAddress(hospital)
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

            const hospitalsRef = collection(db, "hospitals")
            let q = query(
                hospitalsRef,
                where("status", "==", "active"),
                where("emergencyServices", "!=", [])
            )

            const snapshot = await getDocs(q)
            const hospitalsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as HospitalWithEmergency[]

            const processedHospitals = await processHospitalsWithDistances(hospitalsData)

            const nearbyHospitals = processedHospitals.filter(hospital =>
                hospital.distanceValue !== undefined && hospital.distanceValue <= 100000
            )

            if(nearbyHospitals.length === 0){
                const sortedHospitals = processedHospitals.sort((a, b) => {
                    if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                        return a.distanceValue - b.distanceValue
                    }
                    return 0
                })

                setHospitals(sortedHospitals)
            }
            else{
                const sortedHospitals = nearbyHospitals.sort((a, b) => {
                    if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                        return a.distanceValue - b.distanceValue
                    }
                    return 0
                })

                setHospitals(sortedHospitals)
            }

        } catch (err) {
            console.error("Error fetching hospitals:", err)
            setError("Failed to load emergency services. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [userCoords])

    useEffect(() => {
        fetchHospitals()
    }, [fetchHospitals])

    const filterHospitals = useCallback(() => {
        let results = hospitals

        if (emergencyType) {
            results = results.filter(hospital =>
                hospital.emergencyServices.some(s =>
                    s.name.toLowerCase().includes(emergencyType.toLowerCase())
                )
            );
        }

        if (location) {
            const locationLower = location.toLowerCase();
            results = results.filter(hospital =>
                hospital.location.district?.toLowerCase().includes(locationLower) ||
                hospital.location.city?.toLowerCase().includes(locationLower) ||
                hospital.location.state?.toLowerCase().includes(locationLower)
            );
        }

        return results
    }, [hospitals, emergencyType, location])

    const filteredHospitals = filterHospitals()

    // Get current hospitals for pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentHospitals = filteredHospitals.slice(indexOfFirstItem, indexOfLastItem)

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    // Handle items per page change
    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1) // Reset to first page when changing items per page
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                <p>{error}</p>
            </div>
        )
    }

    if (filteredHospitals.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No emergency services found within 100km
                </h3>
                <p className="text-gray-600">
                    {emergencyType || location ? "matching your criteria" : ""}
                    Try expanding your search area or check back later
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                    {hospitals.some(d => d.distanceValue && d.distanceValue <= 10000) ?
                        (`Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredHospitals.length)} of ${filteredHospitals.length} hospitals within 15km of your location`) :
                        (`Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredHospitals.length)} of ${filteredHospitals.length} hospitals`)
                    }
                    {emergencyType ? ` for "${emergencyType}"` : ''}
                </p>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Items per page:</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={handleItemsPerPageChange}
                    >
                        <SelectTrigger className="w-20 bg-white">
                            <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentHospitals.map((hospital) => (
                    <EmergencyCard key={hospital.id} hospital={hospital} user={user}/>
                ))}
            </div>

            {/* Pagination controls */}
            {filteredHospitals.length > itemsPerPage && (
                <div className="flex justify-center mt-8 space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
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
                                onClick={() => paginate(pageNum)}
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
                            onClick={() => paginate(totalPages)}
                        >
                            {totalPages}
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    )
}
