"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ChevronRight, Sparkles, Star, Award, Heart } from "lucide-react"

interface PageHeaderProps {
  title: string
  breadcrumb: string[]
}

export default function PageHeader({ title, breadcrumb }: PageHeaderProps) {
  return (
    <div className="relative py-24 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-10 right-20 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-20 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl"
          animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-400/10 rounded-full blur-xl"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Decorative dots pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-1/3 w-3 h-3 bg-emerald-300 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-1/4 w-4 h-4 bg-green-300 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* TOP SECTION: Floating Badge */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl border border-green-300/30"
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles size={16} />
            PREMIUM EXPERIENCE
            <Award size={16} />
          </motion.div>
        </motion.div>

        {/* MIDDLE SECTION: Title - Centered and Enlarged */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {title.split(' ').slice(0, -1).join(' ')}
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {title.split(' ').slice(-1)[0]}
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Discover premium beauty services tailored just for you
          </motion.p>
        </motion.div>

        {/* BOTTOM SECTION: Breadcrumb - Enhanced with Icons */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-4 border border-green-300/20 shadow-xl">
            <nav className="flex items-center gap-3 text-lg">
              {breadcrumb.map((item, index) => (
                <motion.span 
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                >
                  {index > 0 && (
                    <ChevronRight size={18} className="text-green-300" />
                  )}
                  
                  {index === breadcrumb.length - 1 ? (
                    <span className="flex items-center gap-2 text-white font-bold">
                      {index === 0 && <Home size={18} />}
                      <span>{item}</span>
                    </span>
                  ) : (
                    <Link
                      href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-green-200 hover:text-white transition-colors font-medium group"
                    >
                      {index === 0 && <Home size={18} className="group-hover:scale-110 transition-transform" />}
                      <span className="group-hover:underline">{item}</span>
                    </Link>
                  )}
                </motion.span>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* DECORATIVE ELEMENTS */}
        <div className="absolute top-16 left-12 hidden lg:block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-2 border-green-400/30 rounded-full flex items-center justify-center"
          >
            <Star size={24} className="text-green-400" />
          </motion.div>
        </div>

        <div className="absolute top-20 right-16 hidden lg:block">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-xl"
          >
            <Heart size={20} className="text-white" />
          </motion.div>
        </div>

        <div className="absolute bottom-16 left-20 hidden lg:block">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-8 h-8 bg-teal-400 rounded-full opacity-60"
          />
        </div>

        <div className="absolute bottom-20 right-24 hidden lg:block">
          <motion.div
            animate={{ rotate: [-15, 15, -15] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="w-6 h-6 bg-green-400 transform rotate-45 opacity-70"
          />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-900 to-transparent" />
    </div>
  )
}
