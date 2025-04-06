// components/emergency/emergency-card.tsx
"use client"

import { useState } from "react"
import { MapPin, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

type EmergencyCardProps = {
    hospital: {
        id: string
        fullName: string
        imageUrl?: string
        emergencyServices: {
            is24x7: boolean
            name: string
            startTime: string
            endTime: string
        }[]
        location: {
            address: string
            city: string
            district: string
            state: string
            pincode?: string
        }
        status: string
    }
}

export default function EmergencyCard({ hospital }: EmergencyCardProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [patientName, setPatientName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [selectedService, setSelectedService] = useState("")
    const [additionalDetails, setAdditionalDetails] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleBookEmergency = async () => {
        try {
            setIsSubmitting(true)

            const selectedServiceData = hospital.emergencyServices.find(
                s => s.name === selectedService
            )

            if (!selectedServiceData) {
                throw new Error("Selected service not found")
            }

            const emergencyBooking = {
                hospitalId: hospital.id,
                hospitalName: hospital.fullName,
                emergencyType: selectedService,
                serviceDetails: selectedServiceData,
                hasEmergencyServices: true,
                location: hospital.location,
                patientName,
                phoneNumber,
                additionalDetails,
                status: "Pending",
                timestamp: new Date(),
                // These should come from your auth system:
                userId: "",
                userEmail: ""
            }

            await addDoc(collection(db, "emergencyData"), emergencyBooking)
            router.push("/appointments")
        } catch (error) {
            console.error("Error booking emergency:", error)
        } finally {
            setIsSubmitting(false)
            setIsBookingOpen(false)
        }
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-red-600">{hospital.fullName}</h3>
                            <div className="flex items-center mt-1">
                                <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                                <span className="text-sm font-medium">
                  {hospital.emergencyServices?.length} Emergency Service(s)
                </span>
                            </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            hospital.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
              {hospital.status}
            </span>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{hospital.location.district}, {hospital.location.state}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                <span>
                                  {hospital.emergencyServices?.some(s => s.is24x7)
                                      ? "24/7 Available"
                                      : hospital.emergencyServices && hospital.emergencyServices.length > 0
                                          ? `Open: ${hospital.emergencyServices[0].startTime} - ${hospital.emergencyServices[0].endTime}`
                                          : "Timing not available"}
                                </span>

                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Available Services:</p>
                        <ul className="mt-1 space-y-1">
                            {hospital.emergencyServices.map((service, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                    • {service.name} {service.is24x7 && "(24/7)"}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6">
                        <Button
                            onClick={() => setIsBookingOpen(true)}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            Book Emergency Service
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book Emergency Service</DialogTitle>
                        <DialogDescription>
                            Fill in details for emergency at {hospital.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="patientName" className="text-right">
                                Patient Name
                            </Label>
                            <Input
                                id="patientName"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                                Phone Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="emergencyService" className="text-right">
                                Emergency Service
                            </Label>
                            <select
                                id="emergencyService"
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="col-span-3 border rounded-md px-3 py-2"
                                required
                            >
                                <option value="">Select a service</option>
                                {hospital.emergencyServices.map((service, index) => (
                                    <option key={index} value={service.name}>
                                        {service.name} {service.is24x7 ? '(24/7)' : `(${service.startTime}-${service.endTime})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="additionalDetails" className="text-right">
                                Additional Details
                            </Label>
                            <Input
                                id="additionalDetails"
                                value={additionalDetails}
                                onChange={(e) => setAdditionalDetails(e.target.value)}
                                className="col-span-3"
                                placeholder="Describe the emergency"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleBookEmergency}
                            disabled={isSubmitting || !patientName || !phoneNumber || !selectedService}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? "Booking..." : "Confirm Emergency Booking"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
