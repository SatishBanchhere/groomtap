// "use client"
import PageHeader from "@/components/shared/page-header"
import DoctorSearch from "@/components/doctors/doctor-search"
import DoctorResults from "@/components/doctors/doctor-results"
import Pagination from "@/components/shared/pagination"
import AnimatedLayout from "@/components/shared/animated-layout"
import AnimatedSection from "@/components/shared/animated-section"
import { getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

type Availability = {
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
}

type Doctor = {
  id: string;
  about: string;
  availability: Availability;
  consultationFees: string;
  createdAt: string;
  createdBy: string;
  email: string;
  experienceInYears: string;
  fullName: string;
  imageUrl: string;
  location: {
    address: string;
    city: string;
    district: string;
    state: string;
  };
  medicalLicenseNumber: string;
  phone: string;
  revisitDays: number;
  revisitFees: string;
  serviceCharge: string;
  specialty: string;
  status: string;
}

async function getDoctors(): Promise<Doctor[]> {
  const doctorsRef = collection(db, "doctors")
  const snapshot = await getDocs(doctorsRef)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Doctor[]
}

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <AnimatedLayout>
      <PageHeader title="Search Doctors" breadcrumb={["Home", "Search Doctors"]} />
      <div className="bg-background py-6">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp" delay={0.2}>
            <DoctorSearch />
          </AnimatedSection>
          
          <AnimatedSection animation="fadeIn" delay={0.4}>
            <DoctorResults doctors={doctors} />
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.6}>
            <Pagination />
          </AnimatedSection>
        </div>
      </div>
    </AnimatedLayout>
  )
}
