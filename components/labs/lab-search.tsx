"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LabSearch({ initialSearch = "" }: { initialSearch?: string }) {
    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (searchTerm) params.set("search", searchTerm)
        router.push(`/labs?${params.toString()}`)
    }

    return (
        <div className="mb-6">
            <form onSubmit={handleSearch} className="flex">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: Lab Name, Test, Location, etc."
                    className="px-4 py-2 rounded-l-full w-full focus:outline-none border-y border-l border-gray-300"
                />
                <button
                    type="submit"
                    className="bg-[#ff8a3c] text-white p-3 rounded-r-full hover:bg-[#e67a2e] transition-all"
                >
                    <Search size={20} />
                </button>
            </form>
        </div>
    )
}
