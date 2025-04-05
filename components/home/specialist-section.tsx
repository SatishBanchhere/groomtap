"use client"
import Link from "next/link"
import SpecialtyIcon from "../shared/specialty-icon"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

type Specialty = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export default function SpecialistSection() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialtiesRef = collection(db, "specialties");
        const snapshot = await getDocs(specialtiesRef);
        const specialtiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Specialty[];
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="section-subtitle">CATEGORY</span>
          <h2 className="section-title">Browse by specialist</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 w-16 h-16 mx-auto rounded-full mb-4"></div>
                <div className="bg-gray-200 h-4 w-24 mx-auto"></div>
              </div>
            ))
          ) : specialties.length > 0 ? (
            specialties.map((specialty) => (
              <SpecialistCard 
                key={specialty.id} 
                name={specialty.name} 
                imageUrl={specialty.imageUrl} 
              />
            ))
          ) : (
            // Fallback to default specialties if none found in Firebase
            <>
              <SpecialistCard name="Dentist" />
              <SpecialistCard name="Cardiologist" />
              <SpecialistCard name="Dermatologist" />
              <SpecialistCard name="Ayurveda" />
              <SpecialistCard name="Eye Care" />
              <SpecialistCard name="Orthopedic" />
              <SpecialistCard name="Urologist" />
              <SpecialistCard name="Gynecologist" />
            </>
          )}
        </div>
        <div className="text-center mt-8">
          <Link href="/specialist" className="btn-primary inline-flex">
            <span>All Category</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function SpecialistCard({ name, imageUrl }: { name: string; imageUrl?: string }) {
  return (
    <>
      <Link href={`/specialist/${name}`} className="specialist-card">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-16 h-16 mx-auto object-cover rounded-full"
          />
        ) : (
          <></>
          // <SpecialtyIcon specialty={title} size={32} />
        )}
        <h3 className="font-medium text-center mt-4">{name}</h3>
        <div className="mt-4 bg-[#fff2e7] rounded-full p-2 w-8 h-8 flex items-center justify-center">
          <ArrowRight size={16} className="text-[#ff8a3c]" />
        </div>
      </Link>
    </>
  )
}

