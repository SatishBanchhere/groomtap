import PageHeader from "@/components/shared/page-header"
import DoctorSearch from "@/components/doctors/doctor-search"
import DoctorResults from "@/components/doctors/doctor-results"
import Pagination from "@/components/shared/pagination"
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
    <div>
      <PageHeader title="Search Doctors" breadcrumb={["Home", "Search Doctors"]} />
      <div className="bg-[#f8f5ef] py-6">
        <div className="container mx-auto px-4">
          <DoctorSearch />
          <DoctorResults doctors={doctors} />
          <Pagination />
        </div>
      </div>
    </div>
  )
}
