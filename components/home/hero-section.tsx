"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import AnimatedContainer from "../ui/animated-container"

export default function HeroSection({
                                        doctorsCount = "10,000",
                                        hospitalsCount = "1,000",
                                        specialtiesCount = "50",
                                        appointmentsCount = "100K"
                                    }: {
    doctorsCount?: string
    hospitalsCount?: string
    specialtiesCount?: string
    appointmentsCount?: string
}) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isInputFocused, setIsInputFocused] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/doctors/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <section className="relative min-h-[80vh] flex items-center bg-background">
            {/* Animated background gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-50/90 to-background"
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                    transition: {
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }
                }}
            />

            {/* Floating shapes background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                <div className="absolute top-40 right-20 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-20 left-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
            </div>

            {/* Right side image with animation - hidden on mobile */}
            <AnimatedContainer
                className="hidden md:block absolute right-0 top-0 w-1/2 h-full"
                animation="slideIn"
                delay={0.5}
            >
                <Image
                    src="/images/doctor-patient.jpg"
                    alt="Doctor consulting patient"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background" />
            </AnimatedContainer>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl">
                    <AnimatedContainer animation="slideUp" delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-primary-600 leading-tight">
                            Find A Doctor!
                        </h1>
                    </AnimatedContainer>

                    <AnimatedContainer animation="slideUp" delay={0.4}>
                        <p className="text-xl md:text-2xl text-text-secondary mb-12">
                            Book Your Doctor, Anytime, Anywhere!
                        </p>
                    </AnimatedContainer>

                    {/* Animated Search Bar */}
                    <AnimatedContainer animation="scale" delay={0.6}>
                        <form onSubmit={handleSearch} className="relative group">
                            <motion.div
                                className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary rounded-full blur-md"
                                animate={{
                                    opacity: isInputFocused ? 1 : 0,
                                    scale: isInputFocused ? 1 : 0.95,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    placeholder="Ex. Doctor Name"
                                    className="w-full px-6 py-5 pr-16 text-lg rounded-full border-2 border-primary-100 focus:border-primary-400 focus:outline-none shadow-lg bg-background/80 backdrop-blur-sm transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-4 rounded-full hover:bg-primary-600 transition-colors group"
                                >
                                    <ArrowRight
                                        size={24}
                                        className="transform group-hover:translate-x-1 transition-transform"
                                    />
                                </button>
                            </div>
                        </form>
                    </AnimatedContainer>

                    {/* Stats with animations */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                        {[
                            { number: `${doctorsCount}+`, label: "Verified Doctors" },
                            { number: `${hospitalsCount}+`, label: "Partner Hospitals" },
                            { number: `${specialtiesCount}+`, label: "Medical Specialties" },
                            { number: `${appointmentsCount}+`, label: "Bookings Made" }
                        ].map((stat, index) => (
                            <AnimatedContainer
                                key={stat.label}
                                animation="bounce"
                                delay={0.8 + index * 0.1}
                                className="text-center"
                            >
                                <motion.div
                                    className="text-3xl font-bold text-primary-500 mb-2"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-text-secondary">{stat.label}</div>
                            </AnimatedContainer>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
