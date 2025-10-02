"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Heart, Sparkles, Star, MessageCircle, User, Mail, FileText, PenTool, Gift, Award, Zap } from "lucide-react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

type FormData = {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error("Please fill in all fields")
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      // Submit to Firebase
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: new Date().toISOString()
      })

      // Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* TOP SECTION: Hero Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <MessageCircle size={20} />
            GET IN TOUCH
            <Sparkles size={20} />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Let's Create
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
              Beauty Magic
            </span>
          </h1>
          
          <p className="text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            Have a question, want to book a session, or just say hello? We'd love to hear from you!
          </p>
        </motion.div>

        {/* MAIN SECTION: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          
          {/* LEFT SIDE: Contact Form - Enhanced */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-green-300/20 shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Send Us a Message</h2>
              <p className="text-green-200">We'll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <label htmlFor="name" className="block text-lg font-bold text-green-200 mb-3">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-emerald-300/30 focus:border-emerald-400 focus:outline-none text-white placeholder-green-300 text-lg transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <label htmlFor="email" className="block text-lg font-bold text-green-200 mb-3">
                    Your Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-emerald-300/30 focus:border-emerald-400 focus:outline-none text-white placeholder-green-300 text-lg transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Subject */}
              <motion.div 
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <label htmlFor="subject" className="block text-lg font-bold text-green-200 mb-3">
                  Subject
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-emerald-300/30 focus:border-emerald-400 focus:outline-none text-white placeholder-green-300 text-lg transition-all"
                    placeholder="What's this about?"
                  />
                </div>
              </motion.div>

              {/* Message */}
              <motion.div 
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <label htmlFor="message" className="block text-lg font-bold text-green-200 mb-3">
                  Your Message
                </label>
                <div className="relative">
                  <PenTool className="absolute left-4 top-6 text-emerald-400 w-5 h-5" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-emerald-300/30 focus:border-emerald-400 focus:outline-none text-white placeholder-green-300 text-lg transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
              </motion.div>

              {/* Status Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 text-red-200"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 text-center"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-green-200 text-xl font-bold mb-2">Message Sent Successfully!</p>
                  <p className="text-green-300">We'll get back to you within 24 hours.</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 font-bold text-xl"
              >
                {loading ? (
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={24} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT SIDE: Information & Features */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            
            {/* Why Contact Us */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-green-300/20 shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Us?</h3>
              <div className="space-y-6">
                {[
                  { icon: <Zap size={28} />, title: "Quick Response", desc: "We reply within 24 hours", color: "from-yellow-400 to-orange-500" },
                  { icon: <Award size={28} />, title: "Expert Team", desc: "Certified beauty professionals", color: "from-purple-400 to-pink-500" },
                  { icon: <Heart size={28} />, title: "Personalized Care", desc: "Tailored to your unique needs", color: "from-pink-400 to-red-500" },
                  { icon: <Star size={28} />, title: "5-Star Service", desc: "Rated excellent by 1000+ clients", color: "from-blue-400 to-indigo-500" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex items-start gap-4 p-6 bg-white/10 rounded-2xl border border-green-300/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                      <p className="text-green-200 leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Special Offer */}
            <motion.div 
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-10 border-2 border-green-400/30 shadow-2xl text-center relative overflow-hidden"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 40px rgba(34, 197, 94, 0.5)",
                  "0 0 20px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10" />
              
              <motion.div 
                className="relative z-10"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-6xl mb-6">🎁</div>
                <h3 className="text-3xl font-bold text-white mb-4">Special Offer!</h3>
                <p className="text-green-200 text-xl mb-6 leading-relaxed">
                  Get 20% off your first booking when you contact us through this form
                </p>
                <div className="flex justify-center">
                  <div className="bg-white text-green-700 px-8 py-3 rounded-full font-bold text-lg shadow-xl">
                    Use Code: WELCOME20
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Info Quick Access */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-green-300/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Need Immediate Help?</h3>
              <div className="space-y-4">
                <motion.a
                  href="tel:+1234567890"
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Heart size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Call Us Now</p>
                    <p className="text-green-200">+1 (234) 567-8900</p>
                  </div>
                  <div className="ml-auto text-green-400 group-hover:translate-x-2 transition-transform">→</div>
                </motion.a>

                <motion.a
                  href="mailto:hello@beautyglow.com"
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Email Us</p>
                    <p className="text-green-200">hello@beautyglow.com</p>
                  </div>
                  <div className="ml-auto text-green-400 group-hover:translate-x-2 transition-transform">→</div>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
