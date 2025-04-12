'use client';

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

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
  const { user, signInWithGoogle, logout } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setPhotoUrl(user?.photoURL);
  }, [user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
      <>
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
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <nav className="flex items-center space-x-8">
                  <NavLink href="/" label="Home" />
                  <NavLink href="/aboutus" label="About Us" />
                  <NavLink href="/specialist" label="Specialist" />
                  <NavLink href="/doctors" label="Doctors" />
                  <NavLink href="/hospitals" label="Hospitals" />
                  <NavLink href="/labs" label="Labs" />
                </nav>

                {/* Combined line for Emergency, Contact, and Auth */}
                <div className="flex items-center space-x-8">
                  <NavLink href="/emergency" label="Emergency Services" />
                  <NavLink href="/contactus" label="Contact Us" />

                  {user ? (
                      <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-4"
                      >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-2"
                        >
                          <img
                              src={user.photoURL || photoUrl || "/default-avatar.png"}
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
                        <span>Sign In</span>
                      </motion.button>
                  )}
                </div>
              </div>

              {/* Mobile View - Sign In Button and Menu Toggle */}
              <div className="flex items-center space-x-4 md:hidden">
                {!user && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={signInWithGoogle}
                        className="flex items-center space-x-1 bg-surface border-2 border-primary-200 rounded-full px-3 py-1 text-sm font-medium text-text-primary hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm hover:shadow"
                    >
                      <img
                          src="https://www.google.com/favicon.ico"
                          alt="Google"
                          className="w-3 h-3"
                      />
                      <span>Sign In</span>
                    </motion.button>
                )}
                <button
                    onClick={toggleMobileMenu}
                    className="text-text-primary p-2 rounded-md focus:outline-none"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Mobile Sidebar */}
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-64 bg-surface shadow-lg z-40 md:hidden p-4 overflow-y-auto"
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-end mb-8">
              <button
                  onClick={toggleMobileMenu}
                  className="text-text-primary p-2 rounded-md focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-6 flex-1">
              <NavLink href="/" label="Home" />
              <NavLink href="/aboutus" label="About Us" />
              <NavLink href="/specialist" label="Specialist" />
              <NavLink href="/doctors" label="Doctors" />
              <NavLink href="/hospitals" label="Hospitals" />
              <NavLink href="/labs" label="Labs" />
              <NavLink href="/emergency" label="Emergency Services" />
              <NavLink href="/contactus" label="Contact Us" />
            </nav>

            {user && (
                <div className="mt-auto pb-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-3">
                      <img
                          src={user.photoURL || photoUrl || "/default-avatar.png"}
                          alt={user.displayName || ''}
                          className="w-10 h-10 rounded-full ring-2 ring-primary-200"
                      />
                      <span className="text-text-primary">{user.displayName}</span>
                    </div>
                    <button
                        onClick={() => {
                          logout();
                          toggleMobileMenu();
                        }}
                        className="w-full py-2 px-4 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
            )}
          </div>
        </motion.div>

        {/* Overlay */}
        {isMobileMenuOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={toggleMobileMenu}
            />
        )}
      </>
  )
}
