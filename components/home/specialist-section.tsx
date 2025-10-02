"use client"
import Link from "next/link"
import SpecialtyIcon from "../shared/specialty-icon"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion } from "framer-motion"

type Specialty = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export default function SpecialistSection() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialtiesRef = collection(db, "specialties");
        const snapshot = await getDocs(specialtiesRef);
        const specialtiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Specialty[];
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-bl from-emerald-50 via-green-100 to-teal-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200/40 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section - Completely Redesigned */}
        <div className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={18} />
            PREMIUM SERVICES
            <Star size={18} />
          </motion.div>
          
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-emerald-700 to-teal-800 mb-4 leading-tight">
            Browse by service
          </h2>
          
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Services Grid - Completely New Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {loading ? (
            // Enhanced loading skeleton with green theme
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div 
                key={index} 
                className="animate-pulse bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-r from-green-200 to-emerald-200 w-20 h-20 mx-auto rounded-2xl mb-6"></div>
                <div className="bg-green-100 h-6 w-32 mx-auto rounded-lg mb-3"></div>
                <div className="bg-emerald-100 h-4 w-24 mx-auto rounded-lg"></div>
              </motion.div>
            ))
          ) : specialties.length > 0 ? (
            specialties.map((specialty, index) => (
              <SpecialistCard
                key={specialty.id}
                id={specialty.id}
                name={specialty.name}
                imageUrl={specialty.imageUrl}
                index={index}
              />
            ))
          ) : (
            // Fallback services with green theme
            [
              { name: "Hair Styling", icon: "✂️" },
              { name: "Makeup Artist", icon: "💄" },
              { name: "Nail Art", icon: "💅" },
              { name: "Facial Treatment", icon: "🧴" },
              { name: "Hair Coloring", icon: "🎨" },
              { name: "Eyebrow Threading", icon: "👁️" },
              { name: "Manicure & Pedicure", icon: "🌸" },
              { name: "Massage Therapy", icon: "🤲" }
            ].map((service, index) => (
              <SpecialistCard
                key={service.name}
                name={service.name}
                icon={service.icon}
                index={index}
              />
            ))
          )}
        </div>

        {/* CTA Section - Completely Repositioned */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/services" 
              className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all duration-300 inline-flex items-center gap-3"
            >
              <span>Explore All Services</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/booking" 
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-green-700 hover:text-green-800 px-10 py-4 rounded-2xl font-bold shadow-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 inline-flex items-center gap-3"
            >
              <span>Book Appointment</span>
              <Sparkles size={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SpecialistCard({ 
  name, 
  imageUrl, 
  id, 
  icon, 
  index = 0 
}: { 
  name: string; 
  imageUrl?: string; 
  id?: string; 
  icon?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ 
        y: -10, 
        rotate: 2,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className="group"
    >
      <Link 
        href={`/services/${id || name.toLowerCase().replace(/\s+/g, '-')}`} 
        className="block bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100 hover:border-green-300 transition-all duration-500 hover:shadow-2xl relative overflow-hidden"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Service icon/image */}
        <div className="relative z-10 mb-6">
          {imageUrl ? (
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent rounded-2xl" />
            </div>
          ) : icon ? (
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl transition-shadow">
              {icon}
            </div>
          ) : (
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-200 to-green-200 rounded-2xl flex items-center justify-center shadow-lg">
              <SpecialtyIcon specialty={name} size={32} />
            </div>
          )}
        </div>

        {/* Service name */}
        <h3 className="font-bold text-lg text-center text-green-800 mb-4 group-hover:text-emerald-700 transition-colors">
          {name}
        </h3>

        {/* Action button */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full p-3 shadow-lg group-hover:shadow-xl group-hover:from-emerald-600 group-hover:to-green-600 transition-all duration-300">
            <ArrowRight size={18} className="group-hover:translate-x-1 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
    </motion.div>
  )
}
