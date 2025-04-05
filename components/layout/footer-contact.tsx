import { MapPin, Phone, Mail } from "lucide-react"

export default function FooterContact() {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Contact Info</h3>
      <ul className="space-y-3">
        <li className="flex items-start space-x-3">
          <MapPin size={18} className="text-[#ff8a3c] mt-1" />
          <span className="text-sm text-gray-400">Arabihar ,802301</span>
        </li>
        <li className="flex items-start space-x-3">
          <Phone size={18} className="text-[#ff8a3c] mt-1" />
          <span className="text-sm text-gray-400">+91 9470075205</span>
        </li>
        <li className="flex items-start space-x-3">
          <Mail size={18} className="text-[#ff8a3c] mt-1" />
          <span className="text-sm text-gray-400">doczappoint.in@gmail.com</span>
        </li>
      </ul>
    </div>
  )
}

