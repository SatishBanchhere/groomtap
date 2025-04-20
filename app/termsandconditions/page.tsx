import PageHeader from "@/components/shared/page-header"
import TermsIntro from "@/components/termsandconditions/termssandcondtions-intro"
import AppointmentProcess from "@/components/shared/appointment-process"
import Faq from "@/components/termsandconditions/faq"
import EmergencyNewsletter from "@/components/shared/emergency-newsletter"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"

export default function AboutUsPage() {
  return (
    <AnimatedLayout>
      <PageHeader title="Terms and conditions" breadcrumb={["Home", "Terms and conditions"]} />
      <div className="bg-background">
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <TermsIntro />
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

