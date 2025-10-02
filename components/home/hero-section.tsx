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
            router.push(`/freelancers/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <section className="min-h-screen bg-gradient-to-tr from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
            {/* COMPLETELY NEW LAYOUT: Vertical Split Design */}
            
            {/* TOP SECTION: Search Bar as Header */}
            <div className="relative z-20 pt-8 px-8">
                <AnimatedContainer animation="slideUp" delay={0.2}>
                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
                        <motion.div
                            className="absolute -inset-2 bg-gradient-to-r from-green-300 to-emerald-300 rounded-2xl blur-xl"
                            animate={{
                                opacity: isInputFocused ? 0.6 : 0.2,
                                scale: isInputFocused ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="relative flex items-center bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-3">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                placeholder="Ex. Doctor Name"
                                className="flex-1 px-6 py-4 text-xl bg-transparent border-none outline-none text-green-900 placeholder-green-600/70"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 flex items-center gap-2 font-semibold"
                            >
                                Search <ArrowRight size={20} />
                            </button>
                        </div>
                    </form>
                </AnimatedContainer>
            </div>

            {/* MIDDLE SECTION: Diagonal Split Layout */}
            <div className="relative flex-1 flex items-center justify-center py-16">
                
                {/* Left Diagonal: Text Content */}
                <div className="w-1/2 relative z-10 pl-16 pr-8">
                    <AnimatedContainer animation="slideIn" delay={0.4}>
                        <div className="transform -rotate-6 bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-green-300/30">
                            <h1 className="text-6xl font-black text-white mb-8 leading-tight">
                                Book Your
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                                    Glow!
                                </span>
                            </h1>
                            <p className="text-2xl text-green-100 mb-8 font-light">
                                Find Expert Freelancers, Anytime, Anywhere!
                            </p>
                            
                            {/* Circular Stats Layout */}
                            <div className="grid grid-cols-2 gap-6 mt-12">
                                {[
                                    { number: doctorsCount, label: "Expert Freelancers", color: "from-green-400 to-emerald-500" },
                                    { number: hospitalsCount, label: "Partner Salons", color: "from-emerald-400 to-teal-500" },
                                    { number: specialtiesCount, label: "Beauty Services", color: "from-teal-400 to-green-500" },
                                    { number: appointmentsCount, label: "Happy Clients", color: "from-green-500 to-emerald-600" }
                                ].map((stat, index) => (
                                    <AnimatedContainer
                                        key={stat.label}
                                        animation="bounce"
                                        delay={0.6 + index * 0.1}
                                    >
                                        <motion.div
                                            className={`relative w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-xl`}
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <span className="text-white font-bold text-lg">{stat.number}+</span>
                                        </motion.div>
                                        <p className="text-green-200 text-sm text-center font-medium">{stat.label}</p>
                                    </AnimatedContainer>
                                ))}
                            </div>
                        </div>
                    </AnimatedContainer>
                </div>

                {/* Right Diagonal: Image */}
                <div className="w-1/2 relative z-10 pr-16 pl-8">
                    <AnimatedContainer animation="slideIn" delay={0.6}>
                        <div className="transform rotate-6 relative">
                            <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-green-300/50">
                                <Image
                                    src="/images/doctor-patient.jpg"
                                    alt="Beauty stylist working with client"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Green overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-green-800/30" />
                            </div>
                            
                            {/* Floating elements around image */}
                            <motion.div 
                                className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-xl"
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <motion.div 
                                className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-teal-400 to-green-500 rounded-full shadow-xl"
                                animate={{ y: [10, -10, 10] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </div>
                    </AnimatedContainer>
                </div>
            </div>

            {/* BOTTOM SECTION: Floating Action Cards */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <AnimatedContainer animation="scale" delay={0.8}>
                    <div className="flex gap-6">
                        <motion.button 
                            className="bg-white/90 backdrop-blur-lg text-green-800 px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all"
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Browse Services
                        </motion.button>
                        <motion.button 
                            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all"
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Book Now
                        </motion.button>
                    </div>
                </AnimatedContainer>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"
                    animate={{ scale: [1.5, 1, 1.5], rotate: [360, 180, 0] }}
                    transition={{ duration: 25, repeat: Infinity }}
                />
            </div>

            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }} />
            </div>
        </section>
    )
}
