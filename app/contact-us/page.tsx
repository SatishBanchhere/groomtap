import PageHeader from "@/components/shared/page-header"
import ContactInfo from "@/components/contact/contact-info"
import ContactForm from "@/components/contact/contact-form"
import EmergencyNewsletter from "@/components/shared/emergency-newsletter"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"

export default function ContactUsPage() {
  return (
    <AnimatedLayout>
      <PageHeader title="Contact Us" breadcrumb={["Home", "Contact Us"]} />
      <div className="bg-background">
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <ContactInfo />
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.4}>
          <ContactForm />
        </AnimatedSection>

        <AnimatedSection animation="fadeIn" delay={0.6}>
          <EmergencyNewsletter />
        </AnimatedSection>
      </div>
    </AnimatedLayout>
  )
}

