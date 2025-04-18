'use client'

import {useState, useEffect, useCallback} from 'react'
import PageHeader from "@/components/shared/page-header"
import HospitalSearch from "@/components/hospitals/hospital-search"
import HospitalResults from "@/components/hospitals/hospital-results"
import Pagination from "@/components/shared/pagination"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"
import {getDocs, collection} from "firebase/firestore"
import {db} from "@/lib/firebase"
import {Hospital} from '@/types/hospital'

interface HospitalWithDistance extends Hospital {
    distance?: string
    distanceValue?: number
}

interface Coordinates {
    lat: number
    lng: number
}

export default function HospitalPage() {
    const [hospitals, setHospitals] = useState<HospitalWithDistance[]>([])
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [locationAvailable, setLocationAvailable] = useState(false)
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
                setError("Location access was denied or unavailable. Distances will not be shown.")
            }
        }

        getUserLocation()
    }, [])

    const geocodeHospitalAddress = async (hospital: Hospital): Promise<Coordinates | null> => {
        try {
            // If hospital already has lat/lng, use that
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
            return hospitals.map(hospital => ({...hospital}))
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
                    return {...hospital}
                })
            )
            hospitalsWithCoordinates.push(...batchResults)
        }

        return hospitalsWithCoordinates
    }

    const fetchHospitals = useCallback(async () => {
        try {
            setLoading(true)
            const hospitalsRef = collection(db, "hospitals")
            const snapshot = await getDocs(hospitalsRef)
            const hospitalsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Hospital[]
            if(!locationAvailable){
                setHospitals(hospitalsData)
            }
            const processedHospitals = await processHospitalsWithDistances(hospitalsData)

            // Filter hospitals to only show those within 15km (15000 meters)
            const nearbyHospitals = processedHospitals.filter(hospital =>
                hospital.distanceValue !== undefined && hospital.distanceValue <= 15000
            )

            if (nearbyHospitals.length === 0) {
                const sortedHospitals = processedHospitals.sort((a, b) => {
                    if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                        return a.distanceValue - b.distanceValue
                    }
                    return 0
                })

                setHospitals(sortedHospitals)
            } else {
                const sortedHospitals = nearbyHospitals.sort((a, b) => {
                    if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                        return a.distanceValue - b.distanceValue
                    }
                    return 0
                })

                setHospitals(sortedHospitals)
            }

        } catch (err) {
            setError("Failed to load hospital data. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [userCoords])

    useEffect(() => {
        fetchHospitals()
    }, [userCoords, fetchHospitals])

    return (
        <AnimatedLayout>
            <PageHeader title="Search Nearby Hospitals" breadcrumb={["Home", "Nearby Hospitals"]}/>
            <div className="bg-background py-6">
                <div className="container mx-auto px-4">
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
                    <AnimatedSection animation="slideUp" delay={0.2}>
                        <HospitalSearch/>
                    </AnimatedSection>

                    <AnimatedSection animation="fadeIn" delay={0.4}>
                        <>
                        {loading &&
                            <div className="flex justify-center items-center h-64">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <span className="ml-3">Loading nearby hospitals...</span>
                            </div>
                        }
                        {
                            hospitals.length > 0 &&
                            <>
                                <HospitalResults hospitals={hospitals}/>
                            </>
                        }

                        </>
                        {/*{loading ? (*/}
                        {/*    <div className="flex justify-center items-center h-64">*/}
                        {/*        <div*/}
                        {/*            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>*/}
                        {/*        <span className="ml-3">Loading nearby hospitals...</span>*/}
                        {/*    </div>*/}
                        {/*) : hospitals.length > 0 ? (*/}
                        {/*    <>*/}
                        {/*        <p className="text-sm text-gray-600 mb-4">*/}
                        {/*            {hospitals.some(d => d.distanceValue && d.distanceValue <= 10000 ?*/}
                        {/*                <p>*/}
                        {/*                    Showing {hospitals.length} hospitals within 15km of your location*/}
                        {/*                </p>*/}
                        {/*                :*/}
                        {/*                <p>*/}
                        {/*                    Showing {hospitals.length} hospitals none within the range*/}
                        {/*                </p>*/}
                        {/*            }*/}
                        {/*        </p>*/}
                        {/*        <HospitalResults hospitals={hospitals}/>*/}
                        {/*    </>*/}
                        {/*// )*/}
                        {/*//     : (*/}
                        {/*//     <div className="text-center py-12">*/}
                        {/*//         <h3 className="text-lg font-medium text-gray-900 mb-2">*/}
                        {/*//             No hospitals found within 15km*/}
                        {/*//         </h3>*/}
                        {/*//         <p className="text-gray-600">*/}
                        {/*//             Try expanding your search area or check back later*/}
                        {/*//         </p>*/}
                        {/*//     </div>*/}
                        {/*// )*/}

                        {/*}*/}
                    </AnimatedSection>

                    <AnimatedSection animation="slideUp" delay={0.6}>
                        <Pagination totalItems={hospitals.length}/>
                    </AnimatedSection>
                </div>
            </div>
        </AnimatedLayout>
    )
}
