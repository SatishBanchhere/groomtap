import PageHeader from "@/components/shared/page-header"
import ContactInfo from "@/components/contact/contact-info"
import ContactForm from "@/components/contact/contact-form"
import EmergencyNewsletter from "@/components/shared/emergency-newsletter"

export default function ContactUsPage() {
  return (
    <div>
      <PageHeader title="Contact Us" breadcrumb={["Home", "Contact Us"]} />
      <ContactInfo />
      <ContactForm />
      <EmergencyNewsletter />
    </div>
  )
}

