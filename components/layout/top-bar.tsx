import { MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function TopBar() {
  return (
    <div className="bg-[#1e293b] text-white py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <MapPin size={16} className="text-[#ff8a3c]" />
            <span className="text-sm">Arabihar ,802301</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone size={16} className="text-[#ff8a3c]" />
            <span className="text-sm">+91 9470075205</span>
          </div>
        </div>
      </div>
    </div>
  )
}

