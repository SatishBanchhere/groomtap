"use client"

import { useEffect, useState } from "react"
import { Phone, Mail, Sparkles, Award, CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { addDoc, collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

type data = {
  phoneNumber: string;
}

const initialData = {
  phoneNumber: ""
}

export default function EmergencyNewsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      phoneNumber: "",
    }
    for (const doc of webContentSnapshot.docs) {
      if (doc.id === "phoneNumber") {
        console.log(doc.data())
        tempData.phoneNumber = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validate email
      if (!email) {
        throw new Error("Please enter your email address")
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      // Submit to Firebase
      await addDoc(collection(db, "newsletter_subscribers"), {
        email,
        subscribedAt: new Date().toISOString()
      })

      // Clear form
      setEmail("")
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 0.8, 1.2], rotate: [180, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl">
            <Award size={20} />
            STAY CONNECTED
            <Sparkles size={20} />
          </div>
          
          <h2 className="text-5xl font-black text-white mb-4 leading-tight">
            Get In 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
              Touch
            </span>
          </h2>
          
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Connect with our beauty experts or stay updated with exclusive offers and beauty tips
          </p>
        </motion.div>

        {/* Main Content - Vertical Stack Layout */}
        <div className="max-w-4xl mx-auto">
          
          {/* Quick Contact Cards - Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Emergency Call Card - Redesigned */}
            <motion.div
              initial={{ opacity: 0, x: -100, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-green-300/20 shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Phone className="text-white" size={24} />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Quick Call</h3>
                      <p className="text-green-200">Instant beauty consultation</p>
                    </div>
                  </div>
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  </motion.div>
                </div>
                
                <motion.a
                  href={`tel:${impData.phoneNumber.replace(/<\/?p>/g, "")}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all duration-300"
                  dangerouslySetInnerHTML={{ __html: `Call Now ${impData.phoneNumber}` }}
                />
              </div>
            </motion.div>

            {/* Newsletter Card - Redesigned */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-green-300/20 shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl"
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Mail className="text-white" size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Beauty Updates</h3>
                    <p className="text-green-200">Exclusive tips & offers</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-green-300/30 focus:border-green-400 focus:outline-none text-white placeholder-green-300 transition-all duration-300"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Subscribe to Beauty Tips</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Status Messages */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-500/20 border border-green-400/30 rounded-xl text-green-200 text-sm flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Welcome to our beauty community! Check your inbox.
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Bottom Benefits Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Sparkles size={24} />, title: "Expert Tips", desc: "Weekly beauty secrets" },
                { icon: <Award size={24} />, title: "Exclusive Offers", desc: "Member-only discounts" },
                { icon: <CheckCircle size={24} />, title: "Priority Booking", desc: "Skip the waitlist" }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-green-300/10"
                >
                  <div className="text-green-400 mb-3 flex justify-center">{benefit.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{benefit.title}</h4>
                  <p className="text-green-200 text-sm">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
