"use client"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

type SearchBarProps = {
  type: "doctors" | "hospitals"
  placeholder?: string
  className?: string
  showFilters?: boolean
}

type FilterOptions = {
  specialties: string[]
  cities: string[]
}

export default function SearchBar({ type, placeholder, className = "", showFilters = false }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState({
    specialty: "",
    city: "",
    minRating: "",
    maxFee: ""
  })
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    specialties: [],
    cities: []
  })

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch specialties
        const specialtiesRef = collection(db, "specialties")
        const specialtiesSnap = await getDocs(specialtiesRef)
        const specialties = specialtiesSnap.docs.map(doc => doc.data().title)

        // Fetch unique cities from both doctors and hospitals
        const doctorsRef = collection(db, "doctors")
        const hospitalsRef = collection(db, "hospitals")
        
        const [doctorsSnap, hospitalsSnap] = await Promise.all([
          getDocs(doctorsRef),
          getDocs(hospitalsRef)
        ])

        const doctorCities = doctorsSnap.docs.map(doc => doc.data().location?.city || "")
        const hospitalCities = hospitalsSnap.docs.map(doc => doc.data().location?.city || "")
        
        // Combine and deduplicate cities
        const allCities = [...new Set([...doctorCities, ...hospitalCities])].filter(Boolean)

        setFilterOptions({
          specialties: specialties.filter(Boolean),
          cities: allCities.sort()
        })
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    if (showFilters) {
      fetchFilterOptions()
    }
  }, [showFilters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams()
    
    if (query) {
      searchParams.set("q", query)
    }

    // Add filters to search params if they have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value)
      }
    })

    router.push(`/${type}/search?${searchParams.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`w-full ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || `Search ${type}...`}
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8a3c] focus:border-transparent"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ff8a3c] text-white p-2 rounded-md hover:bg-[#e67a34] transition-colors"
        >
          <Search size={20} />
        </button>
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {type === "doctors" && (
            <>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8a3c]"
              >
                <option value="">All Specialties</option>
                {filterOptions.specialties.map((specialty) => (
                  <option key={specialty} value={specialty.toLowerCase()}>
                    {specialty}
                  </option>
                ))}
              </select>
            </>
          )}

          <select
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8a3c]"
          >
            <option value="">All Cities</option>
            {filterOptions.cities.map((city) => (
              <option key={city} value={city.toLowerCase()}>
                {city}
              </option>
            ))}
          </select>

          {type === "doctors" && (
            <>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8a3c]"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>

              <select
                value={filters.maxFee}
                onChange={(e) => setFilters(prev => ({ ...prev, maxFee: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8a3c]"
              >
                <option value="">Any Fee</option>
                <option value="500">Under ₹500</option>
                <option value="1000">Under ₹1000</option>
                <option value="2000">Under ₹2000</option>
              </select>
            </>
          )}
        </div>
      )}
    </form>
  )
} 