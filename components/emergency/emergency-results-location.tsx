// components/emergency/emergency-results-location.tsx
'use client'

import { useEffect, useState, useCallback } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import EmergencyCard from "./emergency-card"
import { Skeleton } from "@/components/ui/skeleton"
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
}

export default function EmergencyResultsLocation({
                                                     emergencyType,
                                                     location
                                                 }: {
    emergencyType: string
    location: {
        district: string
        state: string
    }
}) {
    const [hospitals, setHospitals] = useState<HospitalWithEmergency[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)
    const totalPages = Math.ceil(hospitals.length / itemsPerPage)

    const fetchHospitals = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const hospitalsRef = collection(db, "hospitals")
            let q = query(
                hospitalsRef,
                where("status", "==", "active"),
                where("emergencyServices", "!=", []),
                where("location.state", "==", location.state),
                where("location.district", "==", location.district)
            )

            const snapshot = await getDocs(q)
            const hospitalsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as HospitalWithEmergency[]

            setHospitals(hospitalsData)

        } catch (err) {
            console.error("Error fetching hospitals:", err)
            setError("Failed to load emergency services. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [location.state, location.district])

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
            )
        }

        return results
    }, [hospitals, emergencyType])

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
        setCurrentPage(1)
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
                    No emergency services found in {location.district}
                </h3>
                <p className="text-gray-600">
                    {emergencyType ? `for "${emergencyType}"` : ""}
                    Try checking nearby districts or contact support
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHospitals.length)}
                    of {filteredHospitals.length} hospitals in {location.district}
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
