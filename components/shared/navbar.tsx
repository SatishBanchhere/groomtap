'use client';

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-gray-700 hover:text-[#ff8a3c] hover:underline transition-colors text-lg">
      {label}
    </Link>
  )
}

export default function Navbar() {
  const { user, signInWithGoogle, logout } = useAuth()

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            DocZappoint
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink href="/" label="Home" />
              <NavLink href="/about-us" label="About Us" />
              <NavLink href="/specialist" label="Specialist" />
              <NavLink href="/doctors" label="Doctors" />
              <NavLink href="/hospitals" label="Hospitals" />
              <NavLink href="/contact-us" label="Contact Us" />
            </nav>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/appointments" className="text-gray-700 hover:text-[#ff8a3c] transition-colors">
                  My Appointments
                </Link>
                <div className="flex items-center space-x-2">
                  <img
                    src={user.photoURL || undefined}
                    alt={user.displayName || ''}
                    className="w-8 h-8 rounded-full"
                  />
                  <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <img
                  src="https://www.google.com/favicon.ico" 
                  alt="Google"
                  className="w-4 h-4"
                />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}