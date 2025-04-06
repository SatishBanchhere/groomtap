'use client';

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href} className="text-text-primary hover:text-primary-500 transition-colors text-lg relative group">
        {label}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full" />
      </Link>
    </motion.div>
  )
}

export default function Navbar() {
  const { user, signInWithGoogle, logout } = useAuth()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-surface border-b shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-surface/80"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="DocZappoint Logo" className="h-8 mr-2" />
            {/* <span className="text-2xl font-bold text-primary-500 hover:text-primary-600 transition-colors">
              DocZappoint
            </span> */}
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink href="/" label="Home" />
              <NavLink href="/aboutus" label="About Us" />
              <NavLink href="/specialist" label="Specialist" />
              <NavLink href="/doctors" label="Doctors" />
              <NavLink href="/hospitals" label="Hospitals" />
              <NavLink href="/labs" label="Labs" />
              <NavLink href="/emergency" label="Emergency Services" />
              <NavLink href="/contactus" label="Contact Us" />
              {/* {user && (
                <NavLink href="/my-appointments" label="My Appointments" />
              )} */}
            </nav>
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-4"
              >
                {/*<Link */}
                {/*  href="/my-appointments" */}
                {/*  className="text-text-primary hover:text-primary-500 transition-colors flex items-center space-x-2 group"*/}
                {/*>*/}
                {/*  <span>My Appointments</span>*/}
                {/*  <span className="w-0 group-hover:w-full h-0.5 bg-primary-500 transition-all duration-300" />*/}
                {/*</Link>*/}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user.photoURL || undefined}
                    alt={user.displayName || ''}
                    className="w-8 h-8 rounded-full ring-2 ring-primary-200"
                  />
                  <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={signInWithGoogle}
                className="flex items-center space-x-2 bg-surface border-2 border-primary-200 rounded-full px-4 py-2 text-sm font-medium text-text-primary hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm hover:shadow"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span>Sign in with Google</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
