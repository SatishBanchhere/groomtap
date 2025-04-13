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
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"
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
            fees: number
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
    user?: {
        uid: string
        email: string
        displayName?: string
    }
}

export default function EmergencyCard({ hospital, user }: EmergencyCardProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [patientName, setPatientName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [selectedService, setSelectedService] = useState("")
    const [additionalDetails, setAdditionalDetails] = useState("")
    const [patientAddress, setPatientAddress] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleBookEmergency = async () => {
        try {
            setIsBookingOpen(false)
            // Validate inputs
            if (!patientName || !phoneNumber || !selectedService || !patientAddress) {
                setError("Please fill all required fields")
                return
            }

            setIsSubmitting(true)
            setError("")

            const selectedServiceData = hospital.emergencyServices.find(
                (s) => s.name === selectedService
            )

            if (!selectedServiceData) {
                throw new Error("Selected service not found")
            }

            // Create initial booking record
            const bookingData = {
                hospitalId: hospital.id,
                hospitalName: hospital.fullName,
                emergencyType: selectedService,
                serviceDetails: selectedServiceData,
                fees: selectedServiceData.fees,
                hasEmergencyServices: true,
                patientName,
                phoneNumber,
                additionalDetails,
                status: "pending_payment",
                timestamp: new Date(),
                userId: user?.uid || "",
                userEmail: user?.email || "",
                patientAddress,
                paymentStatus: "initiated"
            }

            // Add to emergencyData collection
            const bookingRef = await addDoc(collection(db, "emergencyData"), bookingData)

            // Load Razorpay script
            const loadRazorpay = () => {
                return new Promise((resolve) => {
                    const script = document.createElement("script")
                    script.src = "https://checkout.razorpay.com/v1/checkout.js"
                    script.onload = () => resolve(true)
                    script.onerror = () => resolve(false)
                    document.body.appendChild(script)
                })
            }

            const res = await loadRazorpay()
            if (!res) {
                throw new Error("Razorpay SDK failed to load")
            }

            // Create order on backend
            const orderResponse = await fetch('/api/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: selectedServiceData.fees * 100,
                    bookingId: bookingRef.id,
                    serviceName: selectedService,
                    hospitalId: hospital.id
                })
            })

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order')
            }

            const orderData = await orderResponse.json()

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: selectedServiceData.fees * 100,
                currency: "INR",
                order_id: orderData.id,
                name: "Emergency Service Booking",
                description: `Emergency: ${selectedService} at ${hospital.fullName}`,
                image: "/logo.png",
                handler: async function (response) {
                    try {
                        // Update booking status in emergencyData collection
                        await updateDoc(doc(db, "emergencyData", bookingRef.id), {
                            status: "booked",
                            paymentId: response.razorpay_payment_id,
                            paymentStatus: "completed",
                            orderId: orderData.id,
                            updatedAt: new Date()
                        })

                        setIsBookingOpen(false)
                        // router.push(`/bookings/${bookingRef.id}`)
                    } catch (error) {
                        console.error("Failed to update booking:", error)
                        setError("Payment successful but failed to update booking. Please contact support.")
                    }
                },
                prefill: {
                    name: patientName,
                    email: user?.email || "",
                    contact: phoneNumber
                },
                notes: {
                    bookingId: bookingRef.id,
                    hospitalId: hospital.id,
                    service: selectedService
                },
                theme: {
                    color: "#3399cc"
                }
            }

            const paymentObject = new window.Razorpay(options)

            paymentObject.on('payment.failed', function (response) {
                updateDoc(doc(db, "emergencyData", bookingRef.id), {
                    status: "payment_failed",
                    paymentStatus: "failed",
                    failureReason: response.error.description,
                    updatedAt: new Date()
                })
                setError(`Payment failed: ${response.error.description}`)
            })

            paymentObject.open()

        } catch (error) {
            console.error("Booking failed:", error)
            setError(error.message || "An error occurred during booking")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="border rounded-xl p-4 shadow-md bg-white space-y-4">
            {hospital.imageUrl ? (
                <img
                    src={hospital.imageUrl}
                    alt={hospital.fullName}
                    className="w-full h-48 object-cover rounded-lg"
                />
            ) : (
                <img
                    src="/emergency.jpg"
                    alt={hospital.fullName}
                    className="w-full h-48 object-cover rounded-lg"
                />
            )}

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">{hospital.fullName}</h2>
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {hospital.location.address}, {hospital.location.city}
                </div>
                <div className="flex flex-col gap-1 mt-2">
                    {hospital.emergencyServices.map(service => (
                        <div key={service.name} className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span>{service.name}</span>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>
                                {service.is24x7 ? "24x7" : `${service.startTime} - ${service.endTime}`}
                            </span>
                            <span className="font-medium">₹{service.fees}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={() => setIsBookingOpen(true)}>Book Emergency</Button>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Book Emergency Service</DialogTitle>
                        <DialogDescription>
                            Fill in the details to request emergency assistance.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 py-2">
                        <div>
                            <Label htmlFor="name">Patient Name *</Label>
                            <Input
                                id="name"
                                value={patientName}
                                onChange={e => setPatientName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Patient Address *</Label>
                            <Input
                                id="address"
                                value={patientAddress}
                                onChange={e => setPatientAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="service">Select Service *</Label>
                            <select
                                id="service"
                                value={selectedService}
                                onChange={e => setSelectedService(e.target.value)}
                                className="w-full border p-2 rounded-md text-sm"
                                required
                            >
                                <option value="">-- Select Emergency Service --</option>
                                {hospital.emergencyServices.map(service => (
                                    <option key={service.name} value={service.name}>
                                        {service.name} (₹{service.fees})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="details">Additional Medical Details</Label>
                            <Input
                                id="details"
                                value={additionalDetails}
                                onChange={e => setAdditionalDetails(e.target.value)}
                                placeholder="Any critical information about the patient"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={handleBookEmergency}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? "Processing..." : "Confirm & Pay"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
