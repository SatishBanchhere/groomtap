"use client"
import ProcessIcon from "./process-icon"
import { ArrowRight, CheckCircle, Calendar, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function AppointmentProcess() {
  return (
    <section className="py-20 bg-gradient-to-tr from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-32 right-32 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section - Completely New Design */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl">
            <Sparkles size={20} />
            SIMPLE PROCESS
            <CheckCircle size={20} />
          </div>
          
          <h2 className="text-6xl font-black text-white mb-6 leading-tight">
            Appointment
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
              Process
            </span>
          </h2>
          
          <div className="w-40 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
        </motion.div>

        {/* Vertical Timeline Design - Completely New Layout */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 via-emerald-400 to-teal-400 rounded-full shadow-lg"></div>
            
            {/* Process Steps - Alternating Layout */}
            <ProcessStep 
              step={1} 
              title="Browse Expert Freelancers" 
              description="Discover skilled beauty professionals near you with detailed profiles and ratings"
              position="left"
              delay={0.2}
            />
            <ProcessStep 
              step={2} 
              title="View Freelancer Portfolio" 
              description="Explore their previous work, reviews, and available services to make the perfect choice"
              position="right" 
              delay={0.4}
            />
            <ProcessStep 
              step={3} 
              title="Book Beauty Session" 
              description="Select your preferred time slot and confirm your appointment with instant booking"
              position="left"
              delay={0.6}
            />
          </div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl transition-all duration-300 inline-flex items-center gap-3"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar size={20} />
              Start Booking Now
              <ArrowRight size={20} />
            </motion.button>
            
            <motion.button
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-green-400 hover:border-green-300 px-10 py-4 rounded-2xl font-bold transition-all duration-300 inline-flex items-center gap-3"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={20} />
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProcessStep({ 
  step, 
  title, 
  description, 
  position, 
  delay 
}: { 
  step: number; 
  title: string; 
  description: string;
  position: 'left' | 'right';
  delay: number;
}) {
  const isLeft = position === 'left';
  
  return (
    <motion.div 
      className={`relative flex items-center mb-24 ${isLeft ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      {/* Step Card */}
      <motion.div 
        className={`w-96 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-300/20 ${isLeft ? 'mr-8' : 'ml-8'}`}
        whileHover={{ 
          scale: 1.05, 
          y: -10,
          boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.25)"
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={`flex items-center gap-4 mb-6 ${isLeft ? '' : 'flex-row-reverse'}`}>
          {/* Step Number */}
          <div className="relative">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-2xl font-black text-white">{step}</span>
            </motion.div>
            
            {/* Glowing effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-lg opacity-50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          {/* Process Icon */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
            <ProcessIcon step={step} />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-green-100 text-lg leading-relaxed">{description}</p>
        
        {/* Decorative arrow for flow */}
        {step < 3 && (
          <motion.div 
            className={`absolute top-1/2 ${isLeft ? '-right-12' : '-left-12'} transform -translate-y-1/2`}
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg ${isLeft ? '' : 'rotate-180'}`}>
              <ArrowRight size={16} className="text-white" />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Timeline Node */}
      <motion.div 
        className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-xl border-4 border-white/20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
      />
    </motion.div>
  );
}
