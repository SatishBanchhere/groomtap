"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import EmergencyCard from "./emergency-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"

type HospitalWithEmergency = {
    id: string
    name: string
    imageUrl?: string
    emergencyServices: {
        is24x7: boolean
        name: string
        startTime: string
        endTime: string
    }[]
    location: {
        address: string
        city: string
        district: string
        state: string
        pincode?: string
    }
    status: string
}

export default function EmergencyResults() {
    const searchParams = useSearchParams()
    const emergencyType = searchParams.get('type') || ''
    const location = searchParams.get('location') || ''
    const [allHospitals, setAllHospitals] = useState<HospitalWithEmergency[]>([])
    const [filteredHospitals, setFilteredHospitals] = useState<HospitalWithEmergency[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllHospitals = async () => {
            try {
                setLoading(true)
                const snapshot = await getDocs(collection(db, "hospitals"))
                const hospitalsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as HospitalWithEmergency[]
                setAllHospitals(hospitalsData)
            } catch (error) {
                console.error("Error fetching hospitals:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAllHospitals()
    }, [])

    useEffect(() => {
        if (allHospitals.length === 0) return

        // Filter hospitals with emergency services
        let results = allHospitals.filter(hospital =>
            hospital.emergencyServices && hospital.emergencyServices.length > 0
        )

        // Apply emergency type filter if specified
        if (emergencyType) {
            results = results.filter(hospital =>
                hospital.emergencyServices.some(s =>
                    s.name.toLowerCase().includes(emergencyType.toLowerCase())
                )
            )
        }

        // Apply location filter if specified
        if (location) {
            const locationLower = location.toLowerCase()
            results = results.filter(hospital =>
                hospital.location.district?.toLowerCase().includes(locationLower) ||
                hospital.location.city?.toLowerCase().includes(locationLower) ||
                hospital.location.state?.toLowerCase().includes(locationLower)
            )
        }

        setFilteredHospitals(results)
    }, [allHospitals, emergencyType, location])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
            </div>
        )
    }

    if (filteredHospitals.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">
                    {emergencyType || location
                        ? "No hospitals found matching your criteria"
                        : "No hospitals with emergency services available"}
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
                <EmergencyCard key={hospital.id} hospital={hospital} />
            ))}
        </div>
    )
}
