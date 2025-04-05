import FooterAbout from "./footer-about"
import FooterLinks from "./footer-links"
import FooterContact from "./footer-contact"
import FooterCopyright from "./footer-copyright"

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white pt-12 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FooterAbout />
          <FooterLinks />
          <FooterContact />
        </div>
        <FooterCopyright />
      </div>
    </footer>
  )
}

