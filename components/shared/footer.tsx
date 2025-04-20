"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";

type data = {
  aboutUs: string;
  address: string;
  email: string;
  phoneNumber: string;
}

const initialData = {
  aboutUs: "",
  address: "",
  email: "",
  phoneNumber: ""
}

export default function Footer() {

  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      aboutUs: "",
      address: "",
      email: "",
      phoneNumber: "",

    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "aboutUs"){
        tempData.aboutUs = doc.data().content
      }
      if(doc.id === "address"){
        tempData.address = doc.data().content
      }
      if(doc.id === "email"){
        tempData.email = doc.data().content
      }
      if(doc.id === "phoneNumber"){
        console.log(doc.data())
        tempData.phoneNumber = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }


  return (
      <footer className="bg-[#1B2232] text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="space-y-6">
              <img
                src={"/logo.png"}
              />
              <div
                  dangerouslySetInnerHTML={{ __html: impData.aboutUs }}
                  className="text-white text-sm leading-relaxed">
              </div>
            </div>

            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6">About</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/aboutus" className="block text-white hover:text-white transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contactus" className="block text-white hover:text-white transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="block text-white hover:text-white transition-colors text-sm">
                    Download apps
                  </Link>
                </li>
                <li>
                  <Link href="/privacypolicy" className="block text-white hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/reviewpolicy" className="block text-white hover:text-white transition-colors text-sm">
                    Review Policy
                  </Link>
                </li>
                <li>
                  <Link href="/termsandconditions" className="block text-white hover:text-white transition-colors text-sm">
                    Terms & Condition
                  </Link>
                </li>
                <li>
                  <Link href="/helpcenter" className="block text-white hover:text-white transition-colors text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/accountdeletion" className="block text-white hover:text-white transition-colors text-sm">
                    Account Delete
                  </Link>
                </li>
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Useful Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/specialist" className="block text-white hover:text-white transition-colors text-sm">
                    Specialist
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="block text-white hover:text-white transition-colors text-sm">
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/tool" className="block text-white hover:text-white transition-colors text-sm">
                    Join As Hospital
                  </Link>
                </li>
                <li>
                  <Link href="/tool" className="block text-white hover:text-white transition-colors text-sm">
                    Join As Lab
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white text-sm">
                  <MapPin className="text-primary-500" size={20} />
                  <span
                    dangerouslySetInnerHTML={{__html: impData.address}}
                  ></span>
                </li>
                <li>
                  <a
                      href={`tel:${impData.phoneNumber.replace(/<\/?p>/g, "")}`}
                      className="flex items-center gap-3 text-white hover:text-white transition-colors text-sm"
                  >
                    <Phone className="text-primary-500" size={20} />
                    <span
                        dangerouslySetInnerHTML={{__html: impData.phoneNumber}}
                    ></span>
                  </a>
                </li>
                <li>
                  <a
                      href={`mailto:${impData.email.replace(/<\/?p>/g, "")}`}
                      className="flex items-center gap-3 text-white hover:text-white transition-colors text-sm"
                  >
                    <Mail className="text-primary-500" size={20}/>
                    <span
                        dangerouslySetInnerHTML={{__html: impData.email}}
                    ></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <p className="text-center text-white text-sm">
              Appointment Book System © 2025 All Right Reserved
            </p>
          </div>
        </div>
      </footer>
  )
}
