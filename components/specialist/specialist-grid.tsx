import Link from "next/link"
import SpecialtyIcon from "../shared/specialty-icon"
import { ArrowRight } from "lucide-react"

export default function SpecialistGrid() {
  return (
    <section className="py-12 bg-[#f8f5ef]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <SpecialistCard title="Dentist" />
          <SpecialistCard title="Cardiologist" />
          <SpecialistCard title="Dermatologist" />
          <SpecialistCard title="Ayurveda" />
          <SpecialistCard title="Eye Care" />
          <SpecialistCard title="Orthopedic" />
          <SpecialistCard title="Urologist" />
          <SpecialistCard title="Gynecologist" />
          <SpecialistCard title="Neurologist" />
          <SpecialistCard title="Psychiatrist" />
          <SpecialistCard title="Pediatrician" />
          <SpecialistCard title="Oncologist" />
        </div>
      </div>
    </section>
  )
}

function SpecialistCard({ title }: { title: string }) {
  return (
    <Link href={`/viewspecialist/${title.toLowerCase()}`} className="specialist-card">
      <SpecialtyIcon specialty={title} size={32} />
      <h3 className="font-medium text-center mt-4">{title}</h3>
      <div className="mt-4 bg-[#fff2e7] rounded-full p-2 w-8 h-8 flex items-center justify-center">
        <ArrowRight size={16} className="text-[#ff8a3c]" />
      </div>
    </Link>
  )
}

