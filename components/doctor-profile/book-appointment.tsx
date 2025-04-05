"use client"

import { Calendar, Clock } from "lucide-react"
import { useState } from "react"

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-2">Book Appointment</h2>
      <p className="text-sm text-gray-600 mb-4">Monday to Sunday: 12pm - 5pm</p>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">Consultation Fee : ₹525</label>
        <div className="relative">
          <input
            type="date"
            className="input-field pr-10"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Calendar size={16} className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <select
            className="input-field appearance-none"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">12:00 - 16:00</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:15">12:15 PM</option>
            <option value="12:30">12:30 PM</option>
            <option value="12:45">12:45 PM</option>
            <option value="13:00">01:00 PM</option>
            <option value="13:15">01:15 PM</option>
            <option value="13:30">01:30 PM</option>
            <option value="13:45">01:45 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="14:15">02:15 PM</option>
            <option value="14:30">02:30 PM</option>
            <option value="14:45">02:45 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="15:15">03:15 PM</option>
            <option value="15:30">03:30 PM</option>
            <option value="15:45">03:45 PM</option>
          </select>
          <Clock size={16} className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <TimeSlot time="12:00 PM" />
        <TimeSlot time="12:15 PM" />
        <TimeSlot time="12:30 PM" />
        <TimeSlot time="12:45 PM" />
        <TimeSlot time="01:00 PM" />
        <TimeSlot time="01:15 PM" />
        <TimeSlot time="01:30 PM" />
        <TimeSlot time="01:45 PM" />
        <TimeSlot time="02:00 PM" />
        <TimeSlot time="02:15 PM" />
        <TimeSlot time="02:30 PM" />
        <TimeSlot time="02:45 PM" />
        <TimeSlot time="03:00 PM" />
        <TimeSlot time="03:15 PM" />
        <TimeSlot time="03:30 PM" />
        <TimeSlot time="03:45 PM" />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-4">Enter Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Phone no.</label>
            <input type="tel" placeholder="Enter Your Phone number" className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Patient Name</label>
            <textarea placeholder="Enter Patient Name" className="input-field min-h-[80px]"></textarea>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm">Razorpay</span>
        </label>
      </div>

      <button className="btn-primary w-full">
        Book Appointment
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
          <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}

function TimeSlot({ time }: { time: string }) {
  return (
    <button className="text-xs p-2 border border-gray-200 rounded hover:border-[#ff8a3c] hover:text-[#ff8a3c]">
      {time}
    </button>
  )
}

