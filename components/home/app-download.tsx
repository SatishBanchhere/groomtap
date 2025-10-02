"use client"
import Link from "next/link"
import { Download, AppleIcon, SmartphoneNfc, Sparkles, Star, Heart, ArrowRight, Play } from "lucide-react"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";
import { motion } from "framer-motion";

type data = {
  playstoreLink: string,
  appstoreLink: string,
}

const initialData = {
  playstoreLink: "",
  appstoreLink: "",
}

export default function AppDownload() {
  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      playstoreLink: "",
      appstoreLink: "",
    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "playstoreLink"){
        tempData.playstoreLink = doc.data().content
      }
      if(doc.id === "appstoreLink"){
        tempData.appstoreLink = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }

  return (
    <section className="relative py-24 bg-gradient-to-tr from-emerald-900 via-green-800 to-teal-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 right-32 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl">
            <Download size={20} />
            MOBILE EXPERIENCE
            <Sparkles size={20} />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Beauty at Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300">
              Fingertips
            </span>
          </h2>
          
          <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            Transform your beauty routine with our award-winning mobile app. Book instantly, discover trends, and glow up effortlessly.
          </p>
        </motion.div>

        {/* Main Content - Vertical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Enhanced Phone Mockup */}
          <motion.div 
            className="flex justify-center lg:order-2"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative">
              {/* Glowing effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-[50px] blur-2xl scale-110"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Phone Container */}
              <div className="relative w-80 h-[640px] bg-gradient-to-br from-gray-900 to-black rounded-[50px] p-4 border-4 border-gray-700 shadow-2xl">
                
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50 rounded-[42px] relative overflow-hidden">
                  
                  {/* App Interface */}
                  <div className="absolute inset-0 flex flex-col">
                    
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-4 text-green-800">
                      <span className="font-bold">9:41</span>
                      <div className="flex gap-2">
                        <div className="w-6 h-3 bg-green-600 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Header */}
                    <div className="px-6 py-8 text-center">
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <Heart size={40} className="text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-black text-green-800 mb-2">BeautyGlow</h3>
                      <p className="text-sm text-green-600 font-medium">Your Beauty Companion</p>
                    </div>
                    
                    {/* Feature Cards */}
                    <div className="flex-1 px-6 space-y-4">
                      {[
                        { icon: "💄", title: "Book Services", desc: "Instant appointments" },
                        { icon: "✨", title: "Beauty Tips", desc: "Expert advice daily" },
                        { icon: "🎨", title: "Style Gallery", desc: "Trending looks" }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-green-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 }}
                        >
                          <div className="text-2xl">{feature.icon}</div>
                          <div>
                            <h4 className="font-bold text-green-800">{feature.title}</h4>
                            <p className="text-sm text-green-600">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Home Indicator */}
                    <div className="flex justify-center py-4">
                      <div className="w-32 h-1 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star size={24} className="text-white" />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center shadow-xl"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles size={28} className="text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section - Enhanced */}
          <motion.div 
            className="space-y-8 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { icon: <Heart size={24} />, title: "5M+ Users", desc: "Trusted worldwide" },
                { icon: <Star size={24} />, title: "4.9 Rating", desc: "Top-rated app" },
                { icon: <Sparkles size={24} />, title: "24/7 Support", desc: "Always here for you" },
                { icon: <Download size={24} />, title: "Free Download", desc: "No hidden fees" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-green-300/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-green-400 mb-3 flex justify-center">{stat.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-1">{stat.title}</h4>
                  <p className="text-green-200 text-sm">{stat.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">
                Experience Beauty Like Never Before
              </h3>
              <p className="text-green-100 text-lg leading-relaxed">
                Join millions who trust our app for seamless beauty bookings, personalized recommendations, and exclusive member benefits. Your perfect look is just a tap away.
              </p>
            </div>

            {/* Download Buttons - Enhanced */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={impData.appstoreLink.match(/href="(.*?)"/)?.[1] || "#"}
                    className="inline-flex items-center gap-4 bg-black hover:bg-gray-900 text-white px-8 py-5 rounded-2xl transition-all duration-300 shadow-xl border border-gray-700 group"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <AppleIcon size={24} className="text-black" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300 group-hover:text-gray-200">Download on the</div>
                      <div className="text-lg font-bold">App Store</div>
                    </div>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={impData.playstoreLink.match(/href="(.*?)"/)?.[1] || "#"}
                    className="inline-flex items-center gap-4 bg-black hover:bg-gray-900 text-white px-8 py-5 rounded-2xl transition-all duration-300 shadow-xl border border-gray-700 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Play size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300 group-hover:text-gray-200">GET IT ON</div>
                      <div className="text-lg font-bold">Google Play</div>
                    </div>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
              
              {/* Additional CTA */}
              <div className="flex items-center gap-4 text-green-200">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-green-400 bg-gradient-to-r from-green-400 to-emerald-500" />
                  ))}
                </div>
                <span className="text-sm font-medium">Join 5M+ happy users today!</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
