"use client"
import Link from "next/link"
import { Download, AppleIcon, SmartphoneNfc } from "lucide-react"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";
type data = {
  playstoreLink: string,
  appstoreLink: string,
}

const initialData = {
  playstoreLink: "",
  appstoreLink: "",
}

export default function AppDownload() {

  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      playstoreLink: "",
      appstoreLink: "",
    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "playstoreLink"){
        tempData.playstoreLink = doc.data().content
      }
      if(doc.id === "appstoreLink"){
        tempData.appstoreLink = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }


  return (
    <section className="bg-[#1e293b] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center w-100">
            <img
              src="https://i.ibb.co/BKj4BnsK/663353.png"
              alt="Mobile app"
              className="w-[320px] md:w-[480px]"
            />
          </div>
          <AppContent impData={impData} />
        </div>
      </div>
    </section>
  )
}

function AppImage() {
  return (
    <div className="flex justify-center">
      <div className="w-[240px] h-[480px] bg-[#2d3748] rounded-[36px] p-3 border-4 border-gray-700 relative">
        <div className="w-full h-full bg-gradient-to-b from-[#ff8a3c]/20 to-[#ff8a3c]/10 rounded-[28px] flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 rounded-full bg-[#ff8a3c] flex items-center justify-center mb-4">
            <Download size={32} className="text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">DocZappoint</h3>
            <p className="text-sm text-gray-300">Book your doctor appointment anytime, anywhere!</p>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppContent({impData}) {
  return (
    <div className="space-y-6">
      <span className="text-[#ff8a3c] font-medium">DOWNLOAD APPS</span>
      <h2 className="text-3xl md:text-4xl font-bold">For Better Test Download Mobile App Today!</h2>
      <p className="text-gray-400">For a smoother Experience and instant Access, Download Our Mobile App Today!</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
            href={(impData.appstoreLink.match(/href="(.*?)"/)?.[1] || "#")}
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all"
        >
          <AppleIcon size={24} />
          <div>
            <div className="text-xs">Download on the</div>
            <div className="text-sm font-bold">App Store</div>
          </div>
        </Link>
        <Link
            href={(impData.playstoreLink.match(/href="(.*?)"/)?.[1] || "#")}
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all"
        >
          <SmartphoneNfc size={24} />
          <div>
            <div className="text-xs">GET IT ON</div>
            <div className="text-sm font-bold">Google Play</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

