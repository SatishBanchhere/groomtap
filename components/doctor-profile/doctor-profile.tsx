import { Star, MapPin, Phone, Heart } from "lucide-react"

export default function DoctorProfile() {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <div className="w-full aspect-square bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#1e293b] font-bold text-xl">
              RA
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                Dr Rakhi Agarwal ( Dr Rungia Clinic)
                <Heart size={20} className="ml-2 text-[#ff8a3c]" />
              </h1>
              <p className="text-gray-600">Gynecologist and Infertility</p>
            </div>
          </div>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
            ))}
            <span className="text-sm text-gray-600 ml-1">(1)</span>
          </div>
          <p className="mt-2">MBBS ,DNB</p>
          <div className="flex items-start space-x-1 mt-4">
            <MapPin size={16} className="text-[#ff8a3c] mt-1" />
            <span className="text-sm text-gray-600">3, Ara, Professor Colony, Nawada, Arrah</span>
            <a href="#" className="text-sm text-[#ff8a3c] ml-2">
              View Map
            </a>
          </div>
          <div className="flex items-start space-x-1 mt-2">
            <Phone size={16} className="text-[#ff8a3c] mt-1" />
            <span className="text-sm text-gray-600">7018671401</span>
          </div>
        </div>
      </div>
    </div>
  )
}

