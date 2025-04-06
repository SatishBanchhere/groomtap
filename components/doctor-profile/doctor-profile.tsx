"use client"

import Image from "next/image"
import { Heart, MapPin, Phone } from "lucide-react"
import { motion } from "framer-motion"

export default function DoctorProfile({ doctor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <Image
          src={doctor.imageUrl || "/placeholder-doctor.jpg"}
          alt={doctor.fullName}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-primary">{doctor.fullName}</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="hover:text-primary-500 transition-colors"
          >
            <Heart size={20} className="ml-2" />
          </motion.button>
        </div>
        <p className="text-text-secondary mb-4">{doctor.specialty}</p>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin size={16} className="text-primary-500 mt-1" />
            <div className="ml-2">
              <p className="text-text-secondary">{doctor.location.address}</p>
              <motion.a
                whileHover={{ scale: 1.02 }}
                href="#"
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                Get Directions
              </motion.a>
            </div>
          </div>
          <div className="flex items-start">
            <Phone size={16} className="text-primary-500 mt-1" />
            <div className="ml-2">
              <p className="text-text-secondary">{doctor.phone}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                Call Now
              </motion.button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
          >
            Book Appointment
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

