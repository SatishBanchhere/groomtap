"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/doctors/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#fff2e7]/95 to-[#fff2e7]/90" />
      
      {/* Right side image */}
      <div className="absolute right-0 top-0 w-1/2 h-full">
        <Image
          src="/images/doctor-patient.jpg"
          alt="Doctor consulting patient"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
            Find A Doctor!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Book Your Doctor, Anytime, Anywhere!
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex. Doctor Name"
              className="w-full px-6 py-4 pr-16 text-lg rounded-full border-2 border-gray-200 focus:border-[#ff8a3c] focus:outline-none shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ff8a3c] text-white p-4 rounded-full hover:bg-[#e67a34] transition-colors"
            >
              <ArrowRight size={24} />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

