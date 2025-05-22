"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { Lab } from '@/types/lab'
import { useSearchParams } from "next/navigation"

type LabResultsProps = {
    labs: (Lab & {
        distance?: string;
        distanceValue?: number;
    })[];
}

export default function LabResults({ labs }: LabResultsProps) {
    // const searchParams = useSearchParams()
    // const testFilter = searchParams.get('test') || 'All'
    //
    // // Get unique test types for filter dropdown
    // const testTypes = ['All', ...new Set(labs?.flatMap(lab => lab.tests || []))]
    //
    // // Filter labs based on search and test type
    // const filteredLabs = labs?.filter(lab => {
    //     const searchTerm = searchParams.get('search')?.toLowerCase() || ''
    //     const matchesSearch =
    //         lab.fullName?.toLowerCase().includes(searchTerm) ||
    //         lab.location?.city?.toLowerCase().includes(searchTerm) ||
    //         lab.location?.state?.toLowerCase().includes(searchTerm) ||
    //         (lab.specialties?.some(test => test.name.toLowerCase().includes(searchTerm))) ||
    //         lab.serviceType?.toLowerCase().includes(searchTerm)
    //
    //     const matchesTest = testFilter === 'All' || lab.tests?.includes(testFilter)
    //
    //     return matchesSearch && matchesTest
    // })

    const filteredLabs = labs;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Showing {filteredLabs?.length} Results</h2>
                {/*<div className="flex items-center space-x-2">*/}
                {/*    <span className="text-sm">Filter by:</span>*/}
                {/*    <select*/}
                {/*        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"*/}
                {/*        value={testFilter}*/}
                {/*        onChange={(e) => {*/}
                {/*            const params = new URLSearchParams(searchParams.toString())*/}
                {/*            params.set('test', e.target.value)*/}
                {/*            window.location.search = params.toString()*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {testTypes.map(test => (*/}
                {/*            <option key={test} value={test}>{test}</option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*</div>*/}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLabs?.map((lab) => (
                    <LabCard
                        key={lab.id}
                        fullName={lab.fullName}
                        imageUrl={lab.imageUrl}
                        location={lab.location}
                        tests={lab.tests || []}
                        status={lab.status}
                        id={lab.id}
                        specialties={lab.specialties}
                        distance={lab.distance}
                    />
                ))}
            </div>
        </div>
    )
}

type Specialty = {
    name: string;
    visitCharge: number;
    homeCharge: number;
    serviceType: string;
    charge: number;
};

type Location = {
    address: string;
    city: string;
    district: string;
    pincode?: string;
    state: string;
};

type LabCardProps = {
    fullName: string;
    imageUrl: string;
    location: Location;
    specialties?: Specialty[];
    tests: string[];
    status: string;
    id: string;
    distance?: string;
};

export function LabCard({
                            fullName,
                            imageUrl,
                            location,
                            specialties = [],
                            tests,
                            status,
                            id,
                            distance
                        }: LabCardProps) {
    const fullLocation = location ?
        `${location.address || ''}, ${location.city || ''}, ${location.district ? location.district + ', ' : ''}${location.state || ''}${location.pincode ? ' - ' + location.pincode : ''}`
        : '';

    return (
        <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <Link href={`/labs/${id}`} passHref>
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

                        {/* Distance Badge (Positioned in top-right of image) */}
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
                        {/* Lab Name */}
                        <h3 className="font-bold text-lg text-gray-900 mb-3">{fullName}</h3>

                        {/* Tests and Pricing */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Available Tests:</p>
                            {specialties && specialties.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {specialties.slice(0, 3).map((test, index) => (
                                        <span
                                            key={`${test.name}-${index}`}
                                            className="bg-gray-50 px-2 py-1 rounded text-xs border border-gray-200"
                                        >
                                            {test.name} – ₹
                                            {test.serviceType === "both"
                                                ? `${test.homeCharge}-${test.visitCharge}`
                                                : test.charge}
                                        </span>
                                    ))}
                                    {specialties.length > 3 && (
                                        <span className="bg-gray-50 px-2 py-1 rounded text-xs border border-gray-200">
                                            +{specialties.length - 3} more
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500">No tests available</p>
                            )}
                        </div>

                        {/* Location Section */}
                        <div className="flex items-start gap-2">
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
                    </div>
                </div>
            </Link>
        </div>
    )
}
