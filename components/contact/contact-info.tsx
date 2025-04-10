"use client"
import React, {useEffect, useState} from "react"
import { Mail, MapPin, Phone } from "lucide-react"
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";


type data = {
  address: string;
  email: string;
  phoneNumber: string;
}

const initialData = {
  address: "",
  email: "",
  phoneNumber: ""
}

export default function ContactInfo() {

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
    <section className="py-12 bg-[#f8f5ef]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="section-subtitle">INFORMATION</span>
          <h2 className="section-title">Get In Touch</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard icon={<Mail className="w-8 h-8" />} title="Email" content={`${impData.email}`} />
          <ContactCard icon={<Phone className="w-8 h-8" />} title="Phone Number" content={`${impData.phoneNumber}`} />
          <ContactCard icon={<MapPin className="w-8 h-8" />} title="Address" content={`${impData.address}`} />
        </div>
      </div>
    </section>
  )
}

function ContactCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode
  title: string
  content: string
}) {
  return (
    <div className="contact-card">
      <div className="contact-card-icon">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p
          dangerouslySetInnerHTML={{__html: content}}
          className="text-gray-600"></p>
    </div>
  )
}

