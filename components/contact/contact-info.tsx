"use client"
import React, {useEffect, useState} from "react"
import { Mail, MapPin, Phone, Heart, Sparkles, Star, ArrowRight, MessageCircle, Clock, Award } from "lucide-react"
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";
import { motion } from 'framer-motion';

type data = {
  address: string;
  email: string;
  phoneNumber: string;
}

const initialData = {
  address: "",
  email: "",
  phoneNumber: ""
}

export default function ContactInfo() {
  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      address: "",
      email: "",
      phoneNumber: "",
    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "address"){
        tempData.address = doc.data().content
      }
      if(doc.id === "email"){
        tempData.email = doc.data().content
      }
      if(doc.id === "phoneNumber"){
        console.log(doc.data())
        tempData.phoneNumber = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
      
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* TOP SECTION: Header with Floating Elements */}
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
            LET'S CONNECT
            <Sparkles size={20} />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Ready to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
              Glow Up?
            </span>
          </h2>
          
          <p className="text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            Get in touch with our beauty experts and start your transformation journey today
          </p>
        </motion.div>

        {/* MIDDLE SECTION: Contact Cards - Horizontal Layout */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          
          {/* Phone Card - Enhanced */}
          <motion.div
            className="group"
            whileHover={{ y: -10, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center border border-green-300/20 shadow-2xl hover:bg-white/15 transition-all duration-300 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Container */}
              <motion.div 
                className="relative z-10 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Phone className="w-12 h-12 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </motion.div>

              <h3 className="text-3xl font-bold mb-6 text-white">Call Us Now</h3>
              <p 
                dangerouslySetInnerHTML={{__html: impData.phoneNumber}}
                className="text-green-200 text-xl leading-relaxed mb-8"
              />
              
              <motion.a
                href={`tel:${impData.phoneNumber?.replace(/<[^>]*>?/gm, '')}`}
                className="inline-flex items-center gap-3 bg-white text-green-700 px-8 py-4 rounded-2xl hover:bg-green-50 font-bold text-lg shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Call Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          {/* Email Card - Enhanced */}
          <motion.div
            className="group"
            whileHover={{ y: -10, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center border border-green-300/20 shadow-2xl hover:bg-white/15 transition-all duration-300 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Container */}
              <motion.div 
                className="relative z-10 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Mail className="w-12 h-12 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Heart size={12} className="text-emerald-500" />
                </div>
              </motion.div>

              <h3 className="text-3xl font-bold mb-6 text-white">Email Us</h3>
              <p 
                dangerouslySetInnerHTML={{__html: impData.email}}
                className="text-green-200 text-xl leading-relaxed mb-8"
              />
              
              <motion.a
                href={`mailto:${impData.email?.replace(/<[^>]*>?/gm, '')}`}
                className="inline-flex items-center gap-3 bg-white text-emerald-700 px-8 py-4 rounded-2xl hover:bg-emerald-50 font-bold text-lg shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Send Email</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          {/* Location Card - Enhanced */}
          <motion.div
            className="group"
            whileHover={{ y: -10, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center border border-green-300/20 shadow-2xl hover:bg-white/15 transition-all duration-300 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Container */}
              <motion.div 
                className="relative z-10 w-24 h-24 bg-gradient-to-br from-teal-500 to-green-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <MapPin className="w-12 h-12 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Star size={12} className="text-teal-500" />
                </div>
              </motion.div>

              <h3 className="text-3xl font-bold mb-6 text-white">Visit Us</h3>
              <p 
                dangerouslySetInnerHTML={{__html: impData.address}}
                className="text-green-200 text-xl leading-relaxed mb-8"
              />
              
              <motion.button
                className="inline-flex items-center gap-3 bg-white text-teal-700 px-8 py-4 rounded-2xl hover:bg-teal-50 font-bold text-lg shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Directions</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM SECTION: Additional Info & CTA */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-green-300/20 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Business Hours & Info */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Clock size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Business Hours</h3>
                  <p className="text-green-200 text-lg">We're here when you need us</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
                  { day: "Saturday", time: "9:00 AM - 6:00 PM" },
                  { day: "Sunday", time: "10:00 AM - 5:00 PM" }
                ].map((schedule, index) => (
                  <motion.div
                    key={schedule.day}
                    className="flex justify-between items-center p-4 bg-white/10 rounded-2xl border border-green-300/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <span className="text-white font-bold text-lg">{schedule.day}</span>
                    <span className="text-green-200 font-medium">{schedule.time}</span>
                  </motion.div>
                ))}
              </div>

              {/* Awards/Features */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <Award size={20} />, text: "Award Winning" },
                  { icon: <Star size={20} />, text: "5-Star Rated" },
                  { icon: <Heart size={20} />, text: "Client Favorite" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-green-300/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <div className="text-green-400">{feature.icon}</div>
                    <span className="text-white font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side: CTA */}
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-6">
                Ready to Book?
              </h3>
              <p className="text-green-200 text-xl mb-8 leading-relaxed">
                Join thousands of satisfied clients and experience the difference of premium beauty services
              </p>
              
              <div className="space-y-4">
                <motion.button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-6 rounded-2xl hover:from-green-600 hover:to-emerald-600 font-bold text-xl shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Appointment Now
                </motion.button>
                
                <motion.button
                  className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-2xl hover:bg-white/20 font-bold text-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Browse Services
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
