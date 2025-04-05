import type React from "react"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactInfo() {
  return (
    <section className="py-12 bg-[#f8f5ef]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="section-subtitle">INFORMATION</span>
          <h2 className="section-title">Get In Touch</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard icon={<Mail className="w-8 h-8" />} title="Email" content="doczappoint.in@gmail.com" />
          <ContactCard icon={<Phone className="w-8 h-8" />} title="Phone Number" content="+91 9470075205" />
          <ContactCard icon={<MapPin className="w-8 h-8" />} title="Address" content="Arabihar ,802301" />
        </div>
      </div>
    </section>
  )
}

function ContactCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode
  title: string
  content: string
}) {
  return (
    <div className="contact-card">
      <div className="contact-card-icon">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  )
}

