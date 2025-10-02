"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, Sparkles, Award, Heart, ArrowUp, Instagram, Facebook, Twitter } from "lucide-react"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";
import { motion } from "framer-motion";

type data = {
  aboutUs: string;
  address: string;
  email: string;
  phoneNumber: string;
}

const initialData = {
  aboutUs: "",
  address: "",
  email: "",
  phoneNumber: ""
}

export default function Footer() {
  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      aboutUs: "",
      address: "",
      email: "",
      phoneNumber: "",
    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "aboutUs"){
        tempData.aboutUs = doc.data().content
      }
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-32 right-32 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 0.8, 1.2], rotate: [180, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Top Wave Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  className="fill-emerald-50"></path>
          </svg>
        </div>

        {/* Main Footer Content */}
        <div className="pt-24 pb-16">
          
          {/* Top Section - Brand & Newsletter */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            {/* Brand Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-3 shadow-xl">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white">Beauty Glow</h3>
                  <p className="text-green-300 font-medium">Premium Grooming Services</p>
                </div>
              </div>
              
              <div
                dangerouslySetInnerHTML={{ __html: impData.aboutUs }}
                className="text-green-100 text-lg leading-relaxed max-w-lg"
              />
              
              {/* Social Media with Animation */}
              {/* <div className="flex gap-4">
                {[
                  { icon: <Instagram size={20} />, color: "from-pink-500 to-rose-500" },
                  { icon: <Facebook size={20} />, color: "from-blue-500 to-indigo-500" },
                  { icon: <Twitter size={20} />, color: "from-sky-400 to-blue-500" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div> */}
            </div>

            {/* Newsletter Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-green-300/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white">Stay Beautiful</h4>
                  <p className="text-green-200">Get weekly beauty tips & exclusive offers</p>
                </div>
              </div>
              
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-green-300/30 focus:border-green-400 focus:outline-none text-white placeholder-green-300 transition-all duration-300"
                />
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart size={20} />
                  Subscribe to Beauty Tips
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Links Grid - Redesigned */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Services Links */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Award size={20} className="text-white" />
                </div>
                <h4 className="text-xl font-bold text-white">Our Services</h4>
              </div>
              
              <div className="space-y-3">
                {[
                  { href: "/specialist", text: "Expert Stylists" },
                  { href: "/freelancers", text: "Freelance Artists" },
                  { href: "/tool", text: "Join As Partner Salon" },
                ].map((link) => (
                  <motion.div
                    key={link.text}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      href={link.href} 
                      className="flex items-center gap-3 text-green-200 hover:text-white transition-colors group"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full group-hover:bg-white transition-colors" />
                      {link.text}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h4 className="text-xl font-bold text-white">Company</h4>
              </div>
              
              <div className="space-y-3">
                {[
                  { href: "/aboutus", text: "About Beauty Glow" },
                  { href: "/contactus", text: "Contact & Location" },
                  { href: "/", text: "Mobile Apps" },
                  { href: "/helpcenter", text: "Help & Support" },
                ].map((link) => (
                  <motion.div
                    key={link.text}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      href={link.href} 
                      className="flex items-center gap-3 text-green-200 hover:text-white transition-colors group"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:bg-white transition-colors" />
                      {link.text}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Info - Enhanced */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
                  <Phone size={20} className="text-white" />
                </div>
                <h4 className="text-xl font-bold text-white">Get In Touch</h4>
              </div>
              
              <div className="space-y-4">
                <motion.a
                  href={`tel:${impData.phoneNumber.replace(/<\/?p>/g, "")}`}
                  className="flex items-center gap-4 text-green-200 hover:text-white transition-colors group bg-white/5 rounded-2xl p-4 hover:bg-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Phone size={18} className="text-green-400" />
                  </div>
                  <span dangerouslySetInnerHTML={{__html: impData.phoneNumber}} />
                </motion.a>
                
                <motion.a
                  href={`mailto:${impData.email.replace(/<\/?p>/g, "")}`}
                  className="flex items-center gap-4 text-green-200 hover:text-white transition-colors group bg-white/5 rounded-2xl p-4 hover:bg-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <Mail size={18} className="text-emerald-400" />
                  </div>
                  <span dangerouslySetInnerHTML={{__html: impData.email}} />
                </motion.a>
                
                <div className="flex items-center gap-4 text-green-200 bg-white/5 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-teal-400" />
                  </div>
                  <span dangerouslySetInnerHTML={{__html: impData.address}} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 pt-8 border-t border-green-700/30">
            {[
              { href: "/privacypolicy", text: "Privacy Policy" },
              { href: "/reviewpolicy", text: "Review Policy" },
              { href: "/termsandconditions", text: "Terms & Conditions" },
              { href: "/accountdeletion", text: "Account Management" }
            ].map((link) => (
              <Link 
                key={link.text}
                href={link.href} 
                className="text-green-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-green-700/30">
            <p className="text-green-300 text-sm flex items-center gap-2">
              <Heart size={16} />
              Beauty Glow © 2025 - Crafted with love for beautiful you
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
