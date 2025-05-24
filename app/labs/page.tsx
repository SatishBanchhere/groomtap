'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Lab = {
    id: string
    fullName: string
    imageUrl?: string
    specialties?: {
        name: string
        price?: string
    }[]
    about?: string
    email?: string
    phone?: string
    location?: {
        address?: string
        city?: string
        state?: string
        district?: string
        pincode?: string
        lat?: number
        lng?: number
    }
}

export default function LabSearchPage() {
    const [labs, setLabs] = useState<Lab[]>([])
    const [filteredLabs, setFilteredLabs] = useState<Lab[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6)

    const state = searchParams.get("state")?.split('-')?.join(' ')
    const district = searchParams.get("district")?.split('-')?.join(' ')
    const test = searchParams.get("test")?.split('-').join(' ')

    const fetchLabs = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const labsRef = collection(db, "lab_form")
            const filters = [where('status', '==', 'active')]

            if (state) filters.push(where("location.state", "==", state))
            if (district) filters.push(where("location.district", "==", district))

            const q = query(labsRef, ...filters, orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)

            let labsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Lab[]

            if (test) {
                labsData = labsData.filter(lab =>
                    lab.specialties?.some(spec =>
                        spec.name?.toLowerCase().includes(test.toLowerCase())
                    )
                )
            }

            setLabs(labsData)
            setFilteredLabs(labsData)
        } catch (err) {
            console.error("Error fetching labs:", err)
            setError("Failed to load lab data. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [state, district, test])

    useEffect(() => {
        fetchLabs()
    }, [fetchLabs])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery) {
            const filtered = labs.filter(lab =>
                lab.fullName
                    .toLowerCase().includes(searchQuery.toLowerCase()) ||
                lab.specialties?.some(spec =>
                    spec.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setFilteredLabs(filtered)
        } else {
            setFilteredLabs(labs)
        }
        setCurrentPage(1)
    }

    const getFullLocation = (lab: Lab) => {
        if (!lab.location) return null
        const location = lab.location
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
    const currentLabs = filteredLabs.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredLabs.length / itemsPerPage)

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
                            placeholder="Search labs by name or test..."
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

            {error && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <span className="ml-3">Loading labs...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
                <>
                    <div className="mb-4">
                        {filteredLabs.length > 0 && (
                            <p className="text-sm text-gray-600">
                                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLabs.length)} of {filteredLabs.length} labs
                                {test ? ` for ${test}` : ''}
                                {state ? ` in ${state}` : ''}
                                {district ? `, ${district}` : ''}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentLabs.length > 0 ? (
                            currentLabs.map((lab) => (
                                <div key={lab.id}
                                     className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {lab.imageUrl ? (
                                                    <Image
                                                        src={lab.imageUrl}
                                                        alt={lab.fullName}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                        {lab.fullName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{lab.fullName}</h3>
                                                {lab.specialties && lab.specialties.length > 0 && (
                                                    <p className="text-gray-600">
                                                        {lab.specialties.slice(0, 2).map(s => s.name).join(', ')}
                                                        {lab.specialties.length > 2 ? '...' : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            {lab.about && (
                                                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                                                    {lab.about}
                                                </p>
                                            )}

                                            {lab.location && (
                                                <div className="flex items-start gap-2 mb-3">
                                                    <MapPin size={16}
                                                            className="text-blue-500 mt-0.5 flex-shrink-0"/>
                                                    <p className="text-sm text-gray-600">
                                                        {getFullLocation(lab)}
                                                    </p>
                                                </div>
                                            )}

                                            {(lab.phone || lab.email) && (
                                                <div className="space-y-2 mb-4">
                                                    {lab.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={16}
                                                                   className="text-green-500 flex-shrink-0"/>
                                                            <a
                                                                href={`tel:${lab.phone}`}
                                                                className="text-sm text-green-600 hover:underline"
                                                            >
                                                                {lab.phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {lab.email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={16}
                                                                  className="text-purple-500 flex-shrink-0"/>
                                                            <a
                                                                href={`mailto:${lab.email}`}
                                                                className="text-sm text-purple-600 hover:underline"
                                                            >
                                                                {lab.email}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {lab.specialties && lab.specialties.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium mb-2">Available Tests:</h4>
                                                    <div className="space-y-2">
                                                        {lab.specialties.slice(0, 3).map((spec, index) => (
                                                            <div key={index} className="flex justify-between text-sm">
                                                                <span>{spec.name}</span>
                                                                {spec.price && (
                                                                    <span className="text-primary-600">₹{spec.price}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {lab.specialties.length > 3 && (
                                                            <p className="text-xs text-gray-500">
                                                                +{lab.specialties.length - 3} more tests available
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end mt-4">
                                                <Link
                                                    href={`/labs/${lab.id}`}
                                                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                                                >
                                                    View Lab
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No labs found {searchQuery ? `matching "${searchQuery}"` : ''}
                                    {test ? ` for ${test}` : ''}
                                    {state ? ` in ${state}` : ''}
                                    {district ? `, ${district}` : ''}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredLabs.length > itemsPerPage && (
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
