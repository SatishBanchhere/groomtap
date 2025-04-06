"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { Lab } from '@/types/lab'
import { useSearchParams } from "next/navigation"

type LabResultsProps = {
    labs: Lab[];
}

export default function LabResults({ labs }: LabResultsProps) {
    const searchParams = useSearchParams()
    const testFilter = searchParams.get('test') || 'All'

    // Get unique test types for filter dropdown
    const testTypes = ['All', ...new Set(labs.flatMap(lab => lab.tests || []))]

    // Filter labs based on search and test type
    const filteredLabs = labs.filter(lab => {
        const searchTerm = searchParams.get('search')?.toLowerCase() || ''
        const matchesSearch =
            lab.fullName.toLowerCase().includes(searchTerm) ||
            lab.location.city.toLowerCase().includes(searchTerm) ||
            lab.location.state.toLowerCase().includes(searchTerm) ||
            (lab.tests?.some(test => test.toLowerCase().includes(searchTerm))) ||
            lab.serviceType.toLowerCase().includes(searchTerm)

        const matchesTest = testFilter === 'All' || lab.tests?.includes(testFilter)

        return matchesSearch && matchesTest
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Showing {filteredLabs.length} Results</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm">Filter by:</span>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"
                        value={testFilter}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams.toString())
                            params.set('test', e.target.value)
                            window.location.search = params.toString()
                        }}
                    >
                        {testTypes.map(test => (
                            <option key={test} value={test}>{test}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLabs.map((lab) => (
                    <LabCard
                        key={lab.id}
                        fullName={lab.fullName}
                        imageUrl={lab.imageUrl}
                        location={lab.location}
                        tests={lab.tests || []}
                        status={lab.status}
                        id={lab.id}
                    />
                ))}
            </div>
        </div>
    )
}

function LabCard({
                     fullName,
                     imageUrl,
                     location,
                     tests,
                     status,
                     id
                 }: {
    fullName: string;
    imageUrl: string;
    location: {
        address: string;
        city: string;
        district: string;
        pincode?: string;
        state: string;
    };
    tests: string[];
    status: string;
    id: string;
}) {
    const fullLocation = `${location.address}, ${location.city}, ${location.state} - ${location.pincode}`;

    return (
        <div className="doctor-card">
            <div className="relative">
                <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={fullName}
                            className="w-full h-full object-cover object-top rounded-t-lg"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center text-[#1e293b] font-bold text-xl rounded-t-lg">
                            {fullName
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold">{fullName}</h3>
                <div className="text-sm text-gray-600">
                    <p className="mb-1">Available Tests:</p>
                    <div className="flex flex-wrap gap-1">
                        {tests.slice(0, 3).map(test => (
                            <span key={test} className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {test}
                    </span>
                        ))}
                        {tests.length > 3 && (
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      +{tests.length - 3} more
                    </span>
                        )}
                    </div>
                </div>
                <div className="flex items-start space-x-1 mt-2">
                    <MapPin size={14} className="text-[#ff8a3c] mt-1" />
                    <span className="text-xs text-gray-600">{fullLocation}</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                    Status: <span className={`font-medium ${status === 'active' ? 'text-green-600' : 'text-red-500'}`}>{status}</span>
                </div>
                <Link href={`/labs/${id}`} className="btn-outline text-sm mt-3 w-full">
                    View Details
                </Link>
            </div>
        </div>
    );
}
