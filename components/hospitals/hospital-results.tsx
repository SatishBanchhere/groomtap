"use client"

import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { Hospital } from '@/types/hospital'
import { useSearchParams } from "next/navigation"

type HospitalResultsProps = {
    hospitals: Hospital[];
}

export default function HospitalResults({ hospitals }: HospitalResultsProps) {
    const searchParams = useSearchParams()
    const specialtyFilter = searchParams.get('specialty') || 'All'

    // Get unique specialties for filter dropdown
    const specialties = ['All', ...new Set(hospitals?.flatMap(hospital => hospital.specialties || []))]

    // Filter hospitals based on search and specialty
    const filteredHospitals = hospitals?.filter(hospital => {
        const searchTerm = searchParams.get('search')?.toLowerCase() || ''
        const matchesSearch =
            hospital.fullName?.toLowerCase().includes(searchTerm) ||
            hospital.location?.city?.toLowerCase().includes(searchTerm) ||
            hospital.location?.state?.toLowerCase().includes(searchTerm) ||
            (hospital.specialties?.some(specialty => specialty.toLowerCase().includes(searchTerm)))

        const matchesSpecialty = specialtyFilter === 'All' || hospital.specialties?.includes(specialtyFilter)

        return matchesSearch && matchesSpecialty
    })

    return (

        <div>
            <p className="text-sm text-gray-600 mb-4">
                {
                    hospitals.some(d => d.distanceValue && d.distanceValue <= 100000) ?
                        (`Showing ${hospitals.length} hospitals within 100km of your location`)
                    :
                        (`Showing ${hospitals.length} hospitals none within the range`)
                }
            </p>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Showing {filteredHospitals?.length} Results</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm">Filter by:</span>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"
                        value={specialtyFilter}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams.toString())
                            params.set('specialty', e.target.value)
                            window.location.search = params.toString()
                        }}
                    >
                        {specialties.map(specialty => (
                            <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals?.map((hospital) => (
                    <HospitalCard
                        key={hospital.id}
                        fullName={hospital.fullName}
                        imageUrl={hospital.imageUrl}
                        location={hospital.location}
                        specialties={hospital.specialties || []}
                        phone={hospital.phone}
                        id={hospital.id}
                        distance={hospital.distance}
                        ayushmanCardAvailable={hospital.ayushmanCardAvailable}
                    />
                ))}
            </div>
        </div>
    )
}

type Location = {
    address: string;
    city: string;
    district?: string;
    pincode?: string;
    state: string;
    lat?: number;
    lng?: number;
};

type HospitalCardProps = {
    fullName: string;
    imageUrl?: string;
    location: Location;
    specialties: string[];
    phone: string;
    id: string;
    distance?: string;
};

export function HospitalCard({
                                 fullName,
                                 imageUrl,
                                 location,
                                 specialties = [],
                                 phone,
                                 id,
                                 distance,
                                 ayushmanCardAvailable
                             }: HospitalCardProps) {
    const fullLocation = location ?
        `${location.address || ''}, ${location.city || ''}, ${location.district ? location.district + ', ' : ''}${location.state || ''}${location.pincode ? ' - ' + location.pincode : ''}`
        : '';

    return (
        <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <Link href={`/hospitals/${id}`} passHref>
                <div className="cursor-pointer">
                    {/* Image Section */}
                    <div className="relative w-full h-48 bg-gray-100">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={fullName}
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-800">
                                    {fullName
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")}
                                </span>
                            </div>
                        )}

                        {/* Distance Badge */}
                        {distance && (
                            <div className="absolute top-3 right-3">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {distance}
                                </span>
                            </div>
                        )}


                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                        {/* Hospital Name */}
                        <h3 className="font-bold text-lg text-gray-900 mb-3">{fullName}</h3>

                        {/* Specialties */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                            {specialties && specialties.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {specialties.slice(0, 3).map((specialty, index) => (
                                        <span
                                            key={`${specialty}-${index}`}
                                            className="bg-gray-50 px-2 py-1 rounded text-xs border border-gray-200"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                    {specialties.length > 3 && (
                                        <span className="bg-gray-50 px-2 py-1 rounded text-xs border border-gray-200">
                                            +{specialties.length - 3} more
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500">No specialties listed</p>
                            )}
                        </div>

                        {/* Location Section */}
                        <div className="flex items-start gap-2 mb-2">
                            <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-600 line-clamp-2">{fullLocation}</p>
                                {distance && (
                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                        {distance} from your location
                                    </p>
                                )}
                            </div>
                        </div>
                        {ayushmanCardAvailable && (
                            <div className="flex items-center gap-2">
                                <span className="text-green-600 font-medium text-sm">
                                  ✅ Ayushman Card Accepted
                                </span>
                            </div>
                        )}
                        {/* Phone Section */}
                        <div className="flex items-center gap-2 mt-3">
                            <Phone size={16} className="text-green-500 flex-shrink-0" />
                            <div
                                href={`tel:${phone}`}
                                className="text-sm text-green-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {phone}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
