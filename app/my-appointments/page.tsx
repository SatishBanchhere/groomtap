"use client"

import { useEffect, useState } from "react"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, Clock, User, Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react"

type Appointment = {
  id: string
  doctorId: string
  doctorName: string
  patientName: string
  patientEmail: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled"
  bookedAt: string
  bookedBy: {
    email: string
    name: string | null
  }
}

export default function MyAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return

      try {
        const appointmentsRef = collection(db, "appointments")
        const q = query(
          appointmentsRef,
          where("bookedBy.email", "==", user.email),
          orderBy("date", "desc"),
          orderBy("time", "desc")
        )
        
        const querySnapshot = await getDocs(q)
        const appointmentsData: Appointment[] = []
        
        querySnapshot.forEach((doc) => {
          appointmentsData.push({ id: doc.id, ...doc.data() } as Appointment)
        })

        setAppointments(appointmentsData)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user])

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "text-green-500"
      case "cancelled":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600">You need to be signed in to view your appointments.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        My Appointments
      </motion.h1>

      {appointments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-600">You haven't booked any appointments yet.</p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{appointment.doctorName}</h2>
                <div className="flex items-center gap-2">
                  {getStatusIcon(appointment.status)}
                  <span className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary-500" />
                  <span>{appointment.patientName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <span>{appointment.patientEmail}</span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Booked on {format(new Date(appointment.bookedAt), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 