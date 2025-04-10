"use client"
import { MapPin, Phone } from "lucide-react"
import Link from "next/link"
import {useEffect, useState} from "react";
import {collection, getDocs, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebase";
import {address} from "framer-motion/m";

type data = {
  phoneNumber: string,
  address: string,
}

const initialData = {
  phoneNumber: "",
  address: ""
}

export default function TopBar() {

  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      phoneNumber: "",
      address: "",
    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "address"){
        tempData.address = doc.data().content
      }
      if(doc.id === "phoneNumber"){
        tempData.phoneNumber = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }

  return (
    <div className="bg-[#1e293b] text-white py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <MapPin size={16} className="text-[#ff8a3c]" />
            <span className="text-sm">{impData.address.replace(/<\/?p>/g, "")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone size={16} className="text-[#ff8a3c]" />
            <span className="text-sm">{impData.phoneNumber.replace(/<[^>]*>?/gm, "")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

