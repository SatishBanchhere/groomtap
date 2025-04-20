import PageHeader from "@/components/shared/page-header"
import PolicyIntro from "@/components/privacypolicy/policypolicy-intro"
import AppointmentProcess from "@/components/shared/appointment-process"
import Faq from "@/components/privacypolicy/faq"
import EmergencyNewsletter from "@/components/shared/emergency-newsletter"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"

export default function AboutUsPage() {
  return (
    <AnimatedLayout>
      <PageHeader title="Privacy Policy" breadcrumb={["Home", "Privacy Policy"]} />
      <div className="bg-background">
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <PolicyIntro />
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

