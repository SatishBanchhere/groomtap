import ProcessIcon from "./process-icon"
import { ArrowRight } from "lucide-react"

export default function AppointmentProcess() {
  return (
    <section className="py-12 bg-[#f8f5ef]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="section-subtitle">PROCESS</span>
          <h2 className="section-title">Appointment Process</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProcessStep step={1} title="Search Best Online Doctors" />
          <ProcessStep step={2} title="View Doctor Profile" />
          <ProcessStep step={3} title="Get Instant Doctor Appointment" />
        </div>
      </div>
    </section>
  )
}

function ProcessStep({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex flex-col items-center relative">
      <ProcessIcon step={step} />
      <h3 className="font-bold text-center mt-4">{title}</h3>
      {step < 3 && (
        <div className="process-arrow">
          <ArrowRight size={24} />
        </div>
      )}
    </div>
  )
}

