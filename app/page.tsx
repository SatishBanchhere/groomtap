import HeroSection from "@/components/home/hero-section"
import SpecialistSection from "@/components/home/specialist-section"
import TopRatedSpecialists from "@/components/home/top-rated-specialists"
import AppDownload from "@/components/home/app-download"
import AppointmentProcess from "@/components/shared/appointment-process"
import EmergencyNewsletter from "@/components/shared/emergency-newsletter"

export default function Home() {
  return (
    <div>
      <HeroSection />
      <SpecialistSection />
      {/* <TopRatedSpecialists /> */}
      <AppDownload />
      <AppointmentProcess />
      <EmergencyNewsletter />
    </div>
  )
}

