"use client"
import { MapPin, Phone } from "lucide-react"
import Link from "next/link"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";

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
    <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white py-3">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Phone size={16} className="text-green-300" />
            <span className="text-sm font-medium">{impData.phoneNumber.replace(/<[^>]*>?/gm, "")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-green-300" />
            <span className="text-sm font-medium">{impData.address.replace(/<\/?p>/g, "")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
