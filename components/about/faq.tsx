"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, HelpCircle, Sparkles, Star, MessageCircle, Users, Award, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What makes BeautyGlow different?",
      answer: "BeautyGlow is a premium beauty services platform that brings salon-quality treatments directly to your home. We connect you with certified beauty professionals who use only the finest products to deliver exceptional results in the comfort of your own space.",
      icon: <Star size={24} />
    },
    {
      question: "How do I book a beauty session?",
      answer: "Booking is incredibly simple! Browse our curated selection of beauty experts, choose your preferred service and time slot, and confirm your booking instantly. You'll receive confirmation via email and SMS, plus our beauty artist will contact you before the appointment.",
      icon: <Heart size={24} />
    },
    {
      question: "Can I reschedule my beauty appointment?",
      answer: "Absolutely! We understand life happens. You can reschedule or cancel your appointment up to 4 hours before the scheduled time through your personal dashboard. Our flexible booking system makes changes hassle-free.",
      icon: <Sparkles size={24} />
    },
    {
      question: "Are your beauty professionals certified?",
      answer: "Yes! All our beauty artists are thoroughly vetted, certified professionals with extensive training and experience. We conduct background checks and require proof of certification to ensure you receive only the highest quality service.",
      icon: <Award size={24} />
    },
    {
      question: "What safety measures do you follow?",
      answer: "Your safety is our priority. All our professionals follow strict hygiene protocols, use sanitized equipment, and maintain the highest safety standards. We also provide contactless payment options for your peace of mind.",
      icon: <Users size={24} />
    },
    {
      question: "Do you offer packages and memberships?",
      answer: "Yes! We offer various beauty packages and VIP memberships with exclusive perks like priority booking, discounted rates, and access to premium services. Check our packages section for current offers and savings.",
      icon: <MessageCircle size={24} />
    }
  ]

  return (
    <div className="relative py-24 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-emerald-300 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/6 w-5 h-5 bg-green-300 rounded-full animate-pulse delay-1500"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* TOP SECTION: Hero Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating Question Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8"
          >
            <motion.div 
              className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl"
              animate={{ y: [-5, 5, -5], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <HelpCircle size={60} className="text-white" />
            </motion.div>
            
            {/* Decorative rings around icon */}
            <motion.div 
              className="absolute inset-0 border-4 border-green-400/30 rounded-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -inset-4 border-2 border-emerald-400/20 rounded-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>

          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles size={20} />
            FREQUENTLY ASKED
            <MessageCircle size={20} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Got
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
              Questions?
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Find answers to everything you need to know about our premium beauty services
          </motion.p>
        </motion.div>

        {/* MAIN SECTION: FAQ Cards - Enhanced Layout */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl border border-green-300/20 shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className="w-full flex items-start justify-between p-8 text-left"
                  >
                    <div className="flex items-start gap-6 flex-1">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        {faq.icon}
                      </div>
                      
                      {/* Question */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-200 transition-colors">
                          {faq.question}
                        </h3>
                        {activeIndex !== index && (
                          <p className="text-green-300 text-sm opacity-70">
                            Click to expand answer
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center ml-4"
                    >
                      <ChevronDown size={24} className="text-green-300" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8">
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20">
                            <p className="text-green-100 text-lg leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: CTA */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-green-300/20 shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">Still Have Questions?</h3>
            <p className="text-2xl text-green-100 mb-8 leading-relaxed">
              Our beauty experts are here to help you 24/7
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-4 rounded-2xl hover:from-green-600 hover:to-emerald-600 font-bold text-xl shadow-xl flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={24} />
                <span>Contact Support</span>
              </motion.button>
              
              <motion.button
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-2xl hover:bg-white/30 font-bold text-xl flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users size={24} />
                <span>Live Chat</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
