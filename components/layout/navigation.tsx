import Link from "next/link"
import TopBar from "./top-bar";

export default function Navigation() {
  return (
    <>

      <nav className="hidden md:flex items-center space-x-6">
        <div className="h-8">
          <TopBar />
        </div>
        <NavLink href="/" label="Home" />
        <NavLink href="/about-us" label="About Us" />
        <NavLink href="/specialist" label="Specialist" />
        <NavLink href="/doctors" label="Doctors" />
        <NavLink href="/contact-us" label="Contact Us" />
      </nav>
    </>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-gray-700 hover:text-[#ff8a3c] transition-colors">
      {label}
    </Link>
  )
}

