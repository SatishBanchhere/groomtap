"use client"
import Image from "next/image"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";

type data = {
  privacypolicy: string
}

const initialData = {
  privacypolicy: ""
}

export default function PrivacyPolicyIntro() {
  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      privacypolicy: "",
    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "privacy"){
        tempData.privacypolicy = doc.data().content
      }
    }
    setImpData(tempData);
  }

  return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[#ff8a3c] font-medium">Privacy Policy</span>
              <h2 className="text-3xl md:text-4xl font-bold">We bring care to your home with one click — while keeping your data private and secure.</h2>
              <div
                  className="privacy-content"
                  dangerouslySetInnerHTML={{__html: impData.privacypolicy}}
              />
            </div>
            <div className="relative">
              <div className="w-full aspect-video rounded-lg overflow-hidden">
                <Image
                    src="https://i.ibb.co/xqQkL9KZ/image.png"
                    alt="Healthcare services"
                    width={500}
                    height={500}
                    className="object-cover"
                    priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
