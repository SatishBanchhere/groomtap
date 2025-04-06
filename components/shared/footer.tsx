"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
      <footer className="bg-[#1B2232] text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="space-y-6">
              <img
                src={"/logo.png"}
              />
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  Established on July 10th, 2024,<br />
                  DocZappoint Pvt. Ltd. is transforming<br />
                  healthcare with a state-of-the-art<br />
                  telemedicine platform, seamlessly<br />
                  connecting patients with licensed doctors<br />
                  for convenient online appointments.
                </p>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6">About</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/aboutus" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contactus" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Download apps
                  </Link>
                </li>
                {/*<li>*/}
                {/*  <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors text-sm">*/}
                {/*    Privacy Policy*/}
                {/*  </Link>*/}
                {/*</li>*/}
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Useful Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/specialist" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Specialist
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/tool" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Join As Hospital
                  </Link>
                </li>
                <li>
                  <Link href="/tool" className="block text-gray-400 hover:text-white transition-colors text-sm">
                    Join As Lab
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin className="text-primary-500" size={20} />
                  <span>Ara,bihar ,802301</span>
                </li>
                <li>
                  <a
                      href="tel:+919470075205"
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <Phone className="text-primary-500" size={20} />
                    <span>+91 9470075205</span>
                  </a>
                </li>
                <li>
                  <a
                      href="mailto:docsappoint.in@gmail.com"
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <Mail className="text-primary-500" size={20} />
                    <span>docsappoint.in@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400 text-sm">
              Appointment Book System © 2025 All Right Reserved
            </p>
          </div>
        </div>
      </footer>
  )
}
