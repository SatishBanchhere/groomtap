// components/emergency/emergency-search.tsx
"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"

export default function EmergencySearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [emergencyType, setEmergencyType] = useState(searchParams.get('type') || '')
    const [location, setLocation] = useState(searchParams.get('location') || '')

    const handleSearch = (e: FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (emergencyType) params.set('type', emergencyType)
        if (location) params.set('location', location)
        router.push(`/emergency?${params.toString()}`)
    }

    const emergencyTypes = [
        "Cardiac Emergency",
        "Trauma Center",
        "Stroke Unit",
        "Pediatric Emergency",
        "Burn Unit",
        "Neurological Emergency"
    ]

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Find Emergency Services</h2>
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="emergencyType" className="block text-sm font-medium text-gray-700 mb-1">
                            Emergency Type
                        </label>
                        <select
                            id="emergencyType"
                            value={emergencyType}
                            onChange={(e) => setEmergencyType(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff8a3c] focus:ring-[#ff8a3c]"
                        >
                            <option value="">All Emergency Types</option>
                            {emergencyTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City or District"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff8a3c] focus:ring-[#ff8a3c]"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full bg-[#ff8a3c] hover:bg-[#e67a2e] text-white py-2 px-4 rounded-md flex items-center justify-center"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
