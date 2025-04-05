import PageHeader from "@/components/shared/page-header"
import AboutIntro from "@/components/about/about-intro"
import AppointmentProcess from "@/components/shared/appointment-process"
import Faq from "@/components/about/faq"
import EmergencyNewsletter from "@/components/shared/emergency-newsletter"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"

export default function AboutUsPage() {
  return (
    <AnimatedLayout>
      <PageHeader title="About Us" breadcrumb={["Home", "About Us"]} />
      <div className="bg-background">
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <AboutIntro />
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.4}>
          <AppointmentProcess />
        </AnimatedSection>

        <AnimatedSection animation="fadeIn" delay={0.6}>
          <Faq />
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.8}>
          <EmergencyNewsletter />
        </AnimatedSection>
      </div>
    </AnimatedLayout>
  )
}

