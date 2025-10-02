import Link from "next/link"
import { Star, MapPin, Phone, ArrowRight, Heart } from "lucide-react"

export default function TopRatedSpecialists() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="section-subtitle">MEET OUR PROFESSIONALS</span>
          <h2 className="section-title">Top Rated Specialists</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <DoctorCard
            name="Dr Abhijay Jaiswal"
            specialty="Dentist"
            rating={4.5}
            reviews={12}
            location="J.P. Nagar, Bangalore"
            phone="7018671401"
            time="8:00am - 7:pm"
          />
          <DoctorCard
            name="Dr Rakhi Agarwal"
            specialty="Gynecologist and Infertility"
            rating={4.8}
            reviews={24}
            location="3, Ara, Professor Colony, Nawada, Arrah"
            phone="7018671401"
            time="9:00am - 7:pm"
          />
          <DoctorCard
            name="Dr Vandana Singh"
            specialty="Gynecologist"
            rating={4.7}
            reviews={18}
            location="Raja Road, Hajipur, Bihar"
            phone="7018671401"
            time="10:00am - 6:pm"
          />
          <DoctorCard
            name="Dr Pranjay Pandey"
            specialty="Radiologist"
            rating={4.9}
            reviews={32}
            location="Patliputra, Patna"
            phone="7018671401"
            time="8:00am - 4:pm"
          />
        </div>
        <div className="text-center mt-8">
          <Link href="/freelancers" className="btn-primary inline-flex">
            <span>All Specialists</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function DoctorCard({
  name,
  specialty,
  rating,
  reviews,
  location,
  phone,
  time,
}: {
  name: string
  specialty: string
  rating: number
  reviews: number
  location: string
  phone: string
  time: string
}) {
  return (
    <div className="doctor-card">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#1e293b] font-bold text-xl">
            {name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
        </div>
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full">
          <Heart size={16} className="text-gray-400" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-gray-600">{specialty}</p>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">({reviews} reviews)</span>
        </div>
        <div className="flex items-start space-x-1 mt-2">
          <MapPin size={14} className="text-[#ff8a3c] mt-1" />
          <span className="text-xs text-gray-600">{location}</span>
        </div>
        <div className="flex items-start space-x-1 mt-1">
          <Phone size={14} className="text-[#ff8a3c] mt-1" />
          <span className="text-xs text-gray-600">{phone}</span>
        </div>
        <div className="mt-3 text-sm">{time}</div>
        <Link href={`/freelancers/${name.toLowerCase().replace(/\s+/g, "-")}`} className="btn-outline text-sm mt-3 w-full">
          Visit Now
        </Link>
      </div>
    </div>
  )
}

