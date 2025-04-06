'use client'

import { useState, useEffect, useCallback } from 'react'
import PageHeader from "@/components/shared/page-header"
import LabSearch from "@/components/labs/lab-search"
import LabResults from "@/components/labs/lab-results"
import Pagination from "@/components/shared/pagination"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"
import { getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Lab } from '@/types/lab'

interface LabWithDistance extends Lab {
    distance?: string
    distanceValue?: number
}

interface Coordinates {
    lat: number
    lng: number
}

export default function LabPage() {
    const [labs, setLabs] = useState<LabWithDistance[]>([])
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

    const geocodeLabAddress = async (lab: Lab): Promise<Coordinates | null> => {
        try {
            const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            if (!API_KEY) return null

            const location = lab.location
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

    const processLabsWithDistances = async (labs: Lab[]): Promise<LabWithDistance[]> => {
        if (!userCoords) {
            return labs.map(lab => ({ ...lab }))
        }

        const labsWithCoordinates = []
        const BATCH_SIZE = 5

        for (let i = 0; i < labs.length; i += BATCH_SIZE) {
            const batch = labs.slice(i, i + BATCH_SIZE)
            const batchResults = await Promise.all(
                batch.map(async (lab) => {
                    const labCoords = await geocodeLabAddress(lab)
                    if (labCoords) {
                        const distanceResult = calculateDistance(userCoords, labCoords)
                        return {
                            ...lab,
                            distance: distanceResult.text,
                            distanceValue: distanceResult.value
                        }
                    }
                    return { ...lab }
                })
            )
            labsWithCoordinates.push(...batchResults)
        }

        return labsWithCoordinates
    }

    const fetchLabs = useCallback(async () => {
        try {
            setLoading(true)
            const labsRef = collection(db, "lab_form")
            const snapshot = await getDocs(labsRef)
            const labsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Lab[]

            const processedLabs = await processLabsWithDistances(labsData)

            // Filter labs to only show those within 7km (7000 meters)
            const nearbyLabs = processedLabs.filter(lab =>
                lab.distanceValue !== undefined && lab.distanceValue <= 7000
            )

            const sortedLabs = nearbyLabs.sort((a, b) => {
                if (a.distanceValue !== undefined && b.distanceValue !== undefined) {
                    return a.distanceValue - b.distanceValue
                }
                return 0
            })

            setLabs(sortedLabs)
        } catch (err) {
            setError("Failed to load lab data. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [userCoords])

    useEffect(() => {
        fetchLabs()
    }, [userCoords, fetchLabs])

    return (
        <AnimatedLayout>
            <PageHeader title="Search Nearby Labs" breadcrumb={["Home", "Nearby Labs"]} />
            <div className="bg-background py-6">
                <div className="container mx-auto px-4">
                    {error && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                            <p>{error}</p>
                        </div>
                    )}

                    <AnimatedSection animation="slideUp" delay={0.2}>
                        <LabSearch />
                    </AnimatedSection>

                    <AnimatedSection animation="fadeIn" delay={0.4}>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <span className="ml-3">Loading nearby labs...</span>
                            </div>
                        ) : labs.length > 0 ? (
                            <>
                                <p className="text-sm text-gray-600 mb-4">
                                    Showing {labs.length} labs within 7km of your location
                                </p>
                                <LabResults labs={labs} />
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No labs found within 7km
                                </h3>
                                <p className="text-gray-600">
                                    Try expanding your search area or check back later
                                </p>
                            </div>
                        )}
                    </AnimatedSection>

                    <AnimatedSection animation="slideUp" delay={0.6}>
                        <Pagination />
                    </AnimatedSection>
                </div>
            </div>
        </AnimatedLayout>
    )
}
