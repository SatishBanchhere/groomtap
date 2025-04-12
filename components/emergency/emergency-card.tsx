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
}

export default function EmergencyCard({ hospital, user }: EmergencyCardProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [patientName, setPatientName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [selectedService, setSelectedService] = useState("")
    const [additionalDetails, setAdditionalDetails] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleBookEmergency = async () => {
        try {
            setIsSubmitting(true);

            const selectedServiceData = hospital.emergencyServices.find(
                (s) => s.name === selectedService
            );

            if (!selectedServiceData) {
                throw new Error("Selected service not found");
            }

            // Load Razorpay script
            const loadRazorpay = () => {
                return new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            };

            const res = await loadRazorpay();
            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const amountInPaise = selectedServiceData.fees * 100;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourTestKeyHere", // use your Razorpay Test Key
                amount: amountInPaise,
                currency: "INR",
                name: "DocZappoint",
                description: `Emergency Service - ${selectedService}`,
                handler: async function (response) {
                    // Only after payment success
                    const emergencyBooking = {
                        hospitalId: hospital.id,
                        hospitalName: hospital.fullName,
                        emergencyType: selectedService,
                        serviceDetails: selectedServiceData,
                        fees: selectedServiceData.fees,
                        hasEmergencyServices: true,
                        location: hospital.location,
                        patientName,
                        phoneNumber,
                        additionalDetails,
                        status: "Pending",
                        timestamp: new Date(),
                        userId: user?.uid || "", // optional if logged in
                        userEmail: user?.email || "",
                        paymentId: response.razorpay_payment_id
                    };

                    await addDoc(collection(db, "emergencyData"), emergencyBooking);
                    setIsBookingOpen(false);
                },
                prefill: {
                    name: patientName,
                    email: user?.email || "",
                    contact: phoneNumber
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Booking failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={() => setIsBookingOpen(true)}>Book Emergency</Button>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book Emergency Service</DialogTitle>
                        <DialogDescription>
                            Fill in the details to request emergency assistance.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div>
                            <Label htmlFor="name">Patient Name</Label>
                            <Input
                                id="name"
                                value={patientName}
                                onChange={e => setPatientName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="service">Select Service</Label>
                            <select
                                id="service"
                                value={selectedService}
                                onChange={e => setSelectedService(e.target.value)}
                                className="w-full border p-2 rounded-md"
                            >
                                <option value="">-- Select --</option>
                                {hospital.emergencyServices.map(service => (
                                    <option key={service.name} value={service.name}>
                                        {service.name}  ₹{service.fees}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="details">Additional Details</Label>
                            <Input
                                id="details"
                                value={additionalDetails}
                                onChange={e => setAdditionalDetails(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleBookEmergency} disabled={isSubmitting}>
                            {isSubmitting ? "Booking..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
