"use client"
import Image from "next/image"
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";

type data = {
  aboutUs: string
}

const initialData = {
  aboutUs: ""
}

export default function TermssandcondtionsIntro() {
  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      aboutUs: "",
    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "terms"){
        tempData.aboutUs = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[#ff8a3c] font-medium">Privacy Policy</span>
            <h2 className="text-3xl md:text-4xl font-bold">We bring care to your home with one click — while keeping your data private and secure.</h2>
            {/*<p className="text-gray-600">*/}
            {/*  DocZappoint Pvt. Ltd., registered in January 2024, is at the forefront of healthcare innovation. Launched*/}
            {/*  on July 10th, 2024, we revolutionize healthcare by offering seamless online doctor appointments through*/}
            {/*  our advanced telemedicine platform, connecting patients with licensed professionals remotely. Our*/}
            {/*  innovative approach ensures healthcare is more accessible, convenient, and patient-centric.*/}
            {/*</p>*/}
            <div dangerouslySetInnerHTML={{__html: impData.aboutUs}}>

            </div>
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
