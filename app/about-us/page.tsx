import PageHeader from "@/components/shared/page-header"
import AboutIntro from "@/components/about/about-intro"
import AppointmentProcess from "@/components/shared/appointment-process"
import Faq from "@/components/about/faq"
import EmergencyNewsletter from "@/components/shared/emergency-newsletter"

export default function AboutUsPage() {
  return (
    <div>
      <PageHeader title="About Us" breadcrumb={["Home", "About Us"]} />
      <AboutIntro />
      <AppointmentProcess />
      <Faq />
      <EmergencyNewsletter />
    </div>
  )
}

