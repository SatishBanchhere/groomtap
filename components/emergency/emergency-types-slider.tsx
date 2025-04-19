// components/emergency/emergency-types-slider.tsx
'use client'

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type EmergencyType = {
    id: string
    name: string
    iconUrl: string
}

export default function EmergencyTypesSlider({
                                                 selectedEmergency,
                                                 onSelectEmergency
                                             }: {
    selectedEmergency: string | null
    onSelectEmergency: (type: string | null) => void
}) {
    const [emergencyTypes, setEmergencyTypes] = useState<EmergencyType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEmergencyTypes = async () => {
            try {
                const emergencyServicesRef = collection(db, "emergencyServices")
                const snapshot = await getDocs(emergencyServicesRef)

                const types = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as EmergencyType[]

                setEmergencyTypes(types)
                setError(null)
            } catch (error) {
                console.error("Error fetching emergency types:", error)
                setError("Failed to load emergency types. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchEmergencyTypes()
    }, [])

    if (error) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
                <p>{error}</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-24 rounded-lg" />
                ))}
            </div>
        )
    }

    return (
        <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Select Emergency Type</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar">
                <div
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all border-2 min-w-[100px]",
                        !selectedEmergency
                            ? "border-primary bg-primary/10"
                            : "border-transparent hover:border-gray-200"
                    )}
                    onClick={() => onSelectEmergency(null)}
                >
                    <div className="bg-gray-100 p-3 rounded-full mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-center">All</span>
                </div>

                {emergencyTypes.map((type) => (
                    <div
                        key={type.id}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all border-2 min-w-[100px]",
                            selectedEmergency === type.name
                                ? "border-primary bg-primary/10"
                                : "border-transparent hover:border-gray-200"
                        )}
                        onClick={() => onSelectEmergency(type.name)}
                    >
                        <div className="bg-gray-100 p-3 rounded-full mb-2">
                            {type.iconUrl ? (
                                <img
                                    src={type.iconUrl}
                                    alt={type.name}
                                    className="h-8 w-8 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/default-emergency-icon.png'
                                    }}
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm font-medium text-center">{type.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
