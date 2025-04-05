import Link from "next/link"

export default function FooterLinks() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-bold mb-4">About</h3>
        <ul className="space-y-2">
          <FooterLink href="/about-us" label="About Us" />
          <FooterLink href="/contact-us" label="Contact Us" />
          <FooterLink href="/download-apps" label="Download apps" />
          <FooterLink href="/privacy-policy" label="Privacy Policy" />
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Useful Links</h3>
        <ul className="space-y-2">
          <FooterLink href="/specialist" label="Specialist" />
          <FooterLink href="/doctors" label="Doctors" />
          <FooterLink href="/join-as-doctor" label="Join As Doctor" />
        </ul>
      </div>
    </div>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-sm text-gray-400 hover:text-[#ff8a3c] transition-colors">
        {label}
      </Link>
    </li>
  )
}

