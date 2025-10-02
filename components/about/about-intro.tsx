"use client"
import Image from "next/image"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";
import { motion } from "framer-motion"
import { Sparkles, Heart, Star, Award, Users, Target, CheckCircle, ArrowRight } from "lucide-react"

type data = {
  aboutUs: string
}

const initialData = {
  aboutUs: ""
}

export default function AboutIntro() {
  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      aboutUs: "",
    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "aboutUs"){
        tempData.aboutUs = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden">
      
      {/* Background Decorative Elements */}
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
        
        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-emerald-300 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-teal-400 rounded-full opacity-50 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* TOP SECTION: Centered Header */}
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
            <Heart size={20} />
            ABOUT BEAUTYGLOW
            <Sparkles size={20} />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black text-green-800 mb-6 leading-tight">
            Bringing Beauty
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
              To Your Doorstep
            </span>
          </h2>
          
          <p className="text-2xl text-green-600 max-w-4xl mx-auto leading-relaxed">
            Experience premium grooming services in the comfort of your own home
          </p>
        </motion.div>

        {/* MAIN CONTENT: Vertical Layout */}
        <div className="max-w-6xl mx-auto">
          
          {/* IMAGE SECTION - Moved to Top with Enhanced Design */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-200">
                <Image
                  src="https://i.ibb.co/Y7RskQrP/image.png"
                  alt="Premium grooming services"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent" />
                
                {/* Floating stats badges */}
                <motion.div 
                  className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-800">500+</div>
                      <div className="text-sm text-green-600">Expert Artists</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Star size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-800">4.9</div>
                      <div className="text-sm text-green-600">Rating</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center">
                      <Award size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-800">Premium Quality</div>
                      <div className="text-sm text-green-600">Guaranteed</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl opacity-15"></div>
            </div>
          </motion.div>

          {/* CONTENT SECTION - Enhanced with Cards */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            
            {/* Left: About Content */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border-2 border-emerald-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Target size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-800">Our Mission</h3>
                    <p className="text-green-600">Excellence in every service</p>
                  </div>
                </div>
                
                <div 
                  className="text-green-700 text-lg leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{__html: impData.aboutUs}}
                />
              </div>
            </div>

            {/* Right: Features Grid */}
            <div className="space-y-6">
              {[
                { 
                  icon: <CheckCircle size={28} />, 
                  title: "Professional Excellence", 
                  desc: "Certified beauty professionals with years of experience",
                  color: "from-green-500 to-emerald-500"
                },
                { 
                  icon: <Heart size={28} />, 
                  title: "Personalized Care", 
                  desc: "Tailored services to match your unique style and preferences",
                  color: "from-emerald-500 to-teal-500"
                },
                { 
                  icon: <Sparkles size={28} />, 
                  title: "Premium Products", 
                  desc: "Only the finest, salon-grade products for exceptional results",
                  color: "from-teal-500 to-green-500"
                },
                { 
                  icon: <Star size={28} />, 
                  title: "Convenience First", 
                  desc: "Professional beauty services delivered to your doorstep",
                  color: "from-green-600 to-emerald-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-emerald-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-green-800 mb-3 group-hover:text-emerald-700 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-green-600 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* BOTTOM CTA SECTION */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 shadow-2xl text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              
              <div className="relative z-10">
                <h3 className="text-4xl font-bold mb-6">Ready to Experience Beauty Excellence?</h3>
                <p className="text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                  Join thousands of satisfied clients who trust us with their beauty needs
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.button
                    className="bg-white text-green-700 px-10 py-4 rounded-2xl hover:bg-green-50 font-bold text-xl shadow-xl flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Book Your Session</span>
                    <ArrowRight size={24} />
                  </motion.button>
                  
                  <motion.button
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-2xl hover:bg-white/30 font-bold text-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
