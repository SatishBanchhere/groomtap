import { Phone } from "lucide-react"

export default function EmergencyNewsletter() {
  return (
    <section className="bg-[#1e293b] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EmergencyCall />
          <Newsletter />
        </div>
      </div>
    </section>
  )
}

function EmergencyCall() {
  return (
    <div className="emergency-call">
      <h3 className="text-xl font-bold mb-4">Emergency call</h3>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">Telephone</span>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <Phone className="text-[#ff8a3c]" size={20} />
        <span className="text-xl font-bold text-[#ff8a3c]">+91 9470075205</span>
      </div>
    </div>
  )
}

function Newsletter() {
  return (
    <div className="newsletter">
      <h3 className="text-xl font-bold mb-4">Sign up for Newsletter today.</h3>
      <div className="flex">
        <input type="email" placeholder="Enter Your email" className="newsletter-input" />
        <button className="newsletter-button">
          <span>Submit now</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="white" />
          </svg>
        </button>
      </div>
    </div>
  )
}

