"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Star, Award, Sparkles, Heart, Users, Calendar, Filter, Search } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"
import PageHeader from "@/components/shared/page-header"
import { motion } from "framer-motion"

type Specialty = {
  id: string
  name: string
  imageUrl: string
  description?: string
}

export default function SpecialistPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([])

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialtiesRef = collection(db, "specialties")
        const snapshot = await getDocs(specialtiesRef)
        const specialtiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Specialty[]
        setSpecialties(specialtiesData)
        setFilteredSpecialties(specialtiesData)
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSpecialties(specialties)
    } else {
      const filtered = specialties.filter(specialty =>
        specialty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialty.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredSpecialties(filtered)
    }
  }, [searchQuery, specialties])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        
        {/* TOP HERO SECTION */}
        <div className="pt-20 pb-16">
          <motion.div 
            className="container mx-auto px-6 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={20} />
              PREMIUM SERVICES
              <Award size={20} />
            </motion.div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              Beauty
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
                Services
              </span>
            </h1>
            
            <p className="text-2xl text-green-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              Discover expert beauty professionals and premium grooming services tailored just for you
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { icon: <Users size={32} />, value: "500+", label: "Expert Freelancers" },
                { icon: <Star size={32} />, value: "4.9", label: "Average Rating" },
                { icon: <Award size={32} />, value: "20+", label: "Beauty Services" },
                { icon: <Heart size={32} />, value: "10K+", label: "Happy Clients" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-green-300/20 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div className="text-green-300 mb-4 flex justify-center">{stat.icon}</div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-green-200 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* MIDDLE SEARCH SECTION */}
        <motion.div 
          className="bg-white/95 backdrop-blur-lg shadow-2xl py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold text-green-800 mb-4">
                Find Your Perfect Service
              </h2>
              <p className="text-xl text-green-600">
                Search through our curated selection of premium beauty services
              </p>
            </div>

            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for beauty services, treatments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-8 py-6 pl-16 text-xl rounded-3xl border-3 border-emerald-300 focus:border-emerald-500 focus:outline-none text-green-800 shadow-xl"
                />
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-emerald-500 w-6 h-6" />
                <motion.button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-2xl hover:from-emerald-700 hover:to-green-700 font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
            </motion.div>

            {/* Filter Results Info */}
            {searchQuery && (
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-green-700 text-lg font-medium">
                  Found {filteredSpecialties.length} service{filteredSpecialties.length !== 1 ? 's' : ''} 
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* SERVICES GRID SECTION */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="animate-pulse bg-white rounded-3xl shadow-xl p-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-32 h-32 bg-emerald-200 rounded-full mx-auto mb-6"></div>
                      <div className="h-8 bg-emerald-200 rounded-2xl w-3/4 mx-auto mb-4"></div>
                      <div className="h-6 bg-emerald-100 rounded-xl w-1/2 mx-auto"></div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {filteredSpecialties.map((specialty, index) => (
                    <motion.div
                      key={specialty.id}
                      initial={{ opacity: 0, y: 50, rotate: -5 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ 
                        y: -15, 
                        rotate: 2,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      className="group"
                    >
                      <Link
                        href={`/specialist/${specialty.id}`}
                        className="block bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 text-center relative overflow-hidden border-2 border-emerald-100 hover:border-emerald-300"
                      >
                        {/* Background Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Service Image */}
                        <div className="relative z-10 mb-8">
                          <div className="relative w-32 h-32 mx-auto">
                            {specialty.imageUrl ? (
                              <Image
                                src={specialty.imageUrl}
                                alt={specialty.name}
                                fill
                                className="object-cover rounded-full shadow-xl border-4 border-emerald-200 group-hover:border-emerald-400 transition-colors"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-green-200 rounded-full flex items-center justify-center shadow-xl border-4 border-emerald-200 group-hover:border-emerald-400 transition-colors">
                                <Sparkles size={40} className="text-emerald-600" />
                              </div>
                            )}
                            
                            {/* Floating Badge */}
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <Star size={16} className="text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Service Info */}
                        <div className="relative z-10">
                          <h2 className="text-2xl font-bold mb-4 text-green-800 group-hover:text-emerald-700 transition-colors">
                            {specialty.name}
                          </h2>
                          
                          {specialty.description && (
                            <p className="text-green-600 text-lg mb-6 leading-relaxed">
                              {specialty.description}
                            </p>
                          )}

                          {/* Action Button */}
                          <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full p-4 shadow-xl group-hover:shadow-2xl group-hover:from-emerald-600 group-hover:to-green-600 transition-all duration-300">
                              <ArrowRight size={24} className="group-hover:translate-x-1 group-hover:scale-110 transition-transform" />
                            </div>
                          </div>

                          {/* Decorative Elements */}
                          <div className="flex justify-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-80"></div>
                            <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
                          </div>
                        </div>

                        {/* Corner Decoration */}
                        <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* No Results State */}
              {!loading && filteredSpecialties.length === 0 && (
                <motion.div 
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-8xl mb-6">💄</div>
                  <h3 className="text-3xl font-bold text-green-800 mb-4">No Services Found</h3>
                  <p className="text-xl text-green-600 mb-8">
                    We couldn't find any services matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl hover:from-emerald-700 hover:to-green-700 font-bold text-lg shadow-xl"
                  >
                    View All Services
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM CTA SECTION */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Glow?
              </h2>
              <p className="text-2xl text-green-100 mb-12 max-w-3xl mx-auto">
                Browse our complete directory of expert freelancers and book your perfect beauty session today
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/freelancers" 
                    className="inline-flex items-center gap-4 bg-white text-green-700 px-10 py-6 rounded-2xl hover:bg-green-50 font-bold text-xl shadow-2xl transition-all duration-300"
                  >
                    <Users size={24} />
                    <span>View All Freelancers</span>
                    <ArrowRight size={24} />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/salons" 
                    className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-6 rounded-2xl hover:bg-white/20 font-bold text-xl shadow-2xl transition-all duration-300"
                  >
                    <Calendar size={24} />
                    <span>Partner Salons</span>
                    <ArrowRight size={24} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
