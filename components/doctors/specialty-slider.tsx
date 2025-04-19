// components/doctors/specialty-slider.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Specialty = {
    id: string
    title: string
    imageUrl?: string
}

export default function SpecialtySlider({
                                            specialties,
                                            selectedSpecialty,
                                        }: {
    specialties: Specialty[]
    selectedSpecialty: string | null
}) {
    const searchParams = useSearchParams()
    const searchTerm = searchParams.get('q') || ''

    return (
        <div className="w-full overflow-x-auto py-4">
            <div className="flex space-x-4 px-4">
                <Link
                    href={`/doctors/search?q=${searchTerm}`}
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-fit ${
                        !selectedSpecialty
                            ? 'bg-blue-100 border border-blue-500'
                            : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                        <span className="text-lg">👨‍⚕️</span>
                    </div>
                    <span className="text-sm font-medium">All</span>
                </Link>

                {specialties.map((specialty) => (
                    <motion.div
                        key={specialty.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href={`/doctors/search?q=${searchTerm}&specialty=${encodeURIComponent(
                                specialty.title
                            )}`}
                            className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-fit ${
                                selectedSpecialty === specialty.title
                                    ? 'bg-blue-100 border border-blue-500'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            } transition-colors`}
                        >
                            {specialty.imageUrl ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                                    <Image
                                        src={specialty.imageUrl}
                                        alt={specialty.title}
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                    <span className="text-lg">🏥</span>
                                </div>
                            )}
                            <span className="text-sm font-medium text-center">
                {specialty.title}
              </span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
