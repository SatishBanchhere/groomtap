import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase";


type data = {
    aboutUs: string
}

const initialData = {
    aboutUs: ""
}

export default function FooterAbout() {

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
            if(doc.id === "aboutUs"){
                tempData.aboutUs = doc.data().content
            }
        }
        setImpData(tempData);
        console.log(impData)
    }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative w-10 h-10 bg-[#1e293b] border border-gray-700 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">GT</span>
        </div>
        <span className="font-bold text-xl text-white">
          Groom<span className="text-[#ff8a3c]">T</span>ap
        </span>
      </div>
      <p className="text-sm text-gray-400">
        Established on July 10th, 2024, GroomTap Pvt. Ltd. is transforming grooming services with a state-of-the-art
        booking platform, seamlessly connecting users with trusted salons, spas, and grooming professionals for convenient appointments.
        {impData.aboutUs}
      </p>

    </div>
  )
}

