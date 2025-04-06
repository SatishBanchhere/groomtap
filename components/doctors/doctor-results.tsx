import Link from "next/link"
import { Star, MapPin, Heart } from "lucide-react"

type Availability = {
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
}

type Doctor = {
  id: string;
  about: string;
  availability: Availability;
  consultationFees: string;
  createdAt: string;
  createdBy: string;
  email: string;
  experienceInYears: string;
  fullName: string;
  imageUrl: string;
  location: {
    address: string;
    city: string;
    district: string;
    state: string;
  };
  medicalLicenseNumber: string;
  phone: string;
  revisitDays: number;
  revisitFees: string;
  serviceCharge: string;
  specialty: string;
  status: string;
}

type DoctorResultsProps = {
  doctors: Doctor[];
  totalDoctors: number;
  onSpecialtyChange: (specialty: string) => void;
  specialtyFilter: string;
}

export default function DoctorResults({
                                        doctors,
                                        totalDoctors,
                                        onSpecialtyChange,
                                        specialtyFilter
                                      }: DoctorResultsProps) {
  const allSpecialties = Array.from(
      new Set(doctors.map(doctor => doctor.specialty))
  ).sort()

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Showing {totalDoctors} Results</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Filter by</span>
            <select
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"
                value={specialtyFilter}
                onChange={(e) => onSpecialtyChange(e.target.value)}
            >
              <option value="All">All Specialties</option>
              {allSpecialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
              ))}
            </select>
          </div>
        </div>
        {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                  <DoctorCard
                      key={doctor.id}
                      fullName={doctor.fullName}
                      specialty={doctor.specialty}
                      imageUrl={doctor.imageUrl}
                      experienceInYears={doctor.experienceInYears}
                      location={`${doctor.location?.address}, ${doctor.location?.city}`}
                      consultationFees={doctor.consultationFees}
                      availability={doctor.availability}
                      id={doctor.id}
                  />
              ))}
            </div>
        ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No doctors found matching your criteria.</p>
            </div>
        )}
      </div>
  )
}

function DoctorCard({
                      fullName,
                      specialty,
                      imageUrl,
                      experienceInYears,
                      location,
                      consultationFees,
                      availability,
                      id
                    }: {
  fullName: string;
  specialty: string;
  imageUrl: string;
  experienceInYears: string;
  location: string;
  consultationFees: string;
  availability: Availability;
  id: string;
}) {
  const availableDays = Object.entries(availability || {})
      .filter(([_, isAvailable]) => isAvailable)
      .map(([day]) => day)
      .join(", ")

  return (
      <div className="doctor-card border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative">
          <div className="w-full h-48 overflow-hidden rounded-t-lg">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={fullName}
                    className="w-full h-full object-cover object-top rounded-t-lg"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center text-[#1e293b] font-bold text-xl rounded-t-lg">
                  {fullName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                </div>
            )}
          </div>
          <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm">
            <Heart size={16} className="text-gray-400" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg">{fullName}</h3>
          <p className="text-sm text-gray-600">{specialty}</p>
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-600">Experience: {experienceInYears} years</span>
          </div>
          <div className="flex items-start space-x-1 mt-2">
            <MapPin size={14} className="text-[#ff8a3c] mt-1" />
            <span className="text-xs text-gray-600">{location}</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Consultation Fee:</span> ₹{consultationFees}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Available: {availableDays}
          </div>
          <Link
              href={`/doctors/${id}`}
              className="block mt-3 w-full text-center border border-[#ff8a3c] text-[#ff8a3c] hover:bg-[#ff8a3c] hover:text-white py-2 px-4 rounded-md transition-colors text-sm"
          >
            Book Appointment
          </Link>
        </div>
      </div>
  )
}
