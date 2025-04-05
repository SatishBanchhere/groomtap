'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Share2, Heart } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PageHeader from '@/components/shared/page-header';

type TimeSlot = {
  start: string;
  end: string;
  booked: boolean;
  isRevisit: boolean;
  patient: string | null;
  patientName: string | null;
  description: string | null;
  status: 'Available' | 'Booked';
};

type Schedule = {
  id: string;
  doctorId: string;
  day: string;
  startTime: string;
  endTime: string;
  interval: number;
  timeSlots: TimeSlot[];
};

type Doctor = {
  id: string;
  fullName: string;
  specialty: string;
  consultationFees: string;
  imageUrl: string;
  qualifications: string;
  about: string;
  location: {
    address: string;
    city: string;
    district: string;
    state: string;
  };
  availability: {
    [key: string]: boolean;
  };
  phone: string;
};

type BookingFormData = {
  phoneNumber: string;
  patientName: string;
  paymentMethod: 'razorpay' | null;
};

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatDate(date: Date) {
  const day = daysOfWeek[date.getDay()];
  const month = monthNames[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  return `${day}, ${month} ${dayOfMonth}, ${year}`;
}

function formatDateForFirebase(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    phoneNumber: '',
    patientName: '',
    paymentMethod: null
  });
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'healthcare' | 'review'>('about');
  //@ts-ignore 
  const {id} = use(params);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }


  useEffect(() => {
    const fetchDoctor = async () => {
      const docRef = doc(db, 'doctors', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
      }
      setLoading(false);
    };
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedDate || !doctor?.availability) return;
      
      const dayName = daysOfWeek[selectedDate.getDay()];
      if (!doctor.availability[dayName]) {
        setSchedule(null);
        return;
      }

      const schedulesRef = collection(db, `doctors/${id}/schedules`);
      const q = query(
        schedulesRef,
        where('doctorId', '==', id),
        where('day', '==', dayName)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const scheduleData = querySnapshot.docs[0].data();
        setSchedule({
          id: querySnapshot.docs[0].id,
          ...scheduleData
        } as Schedule);
      }
    };

    if (selectedDate) {
      fetchSchedule();
    }
  }, [selectedDate, id, doctor?.availability]);

  const handleBooking = async (timeSlot: TimeSlot) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    if (!selectedDate || !doctor) return;
    console.log(timeSlot);
    setSelectedTimeSlot(timeSlot);
    setShowConfirmation(true);
    // openModal();
  };

  const confirmBooking = async () => {
    if (!selectedTimeSlot || !selectedDate || !doctor || !user) return;
    if (!bookingData.phoneNumber || !bookingData.patientName) return;

    try {
      const appointment = {
        doctorId: id,
        doctorName: doctor.fullName,
        patientId: user.uid,
        patientName: bookingData.patientName,
        phoneNumber: bookingData.phoneNumber,
        date: formatDateForFirebase(selectedDate),
        day: daysOfWeek[selectedDate.getDay()],
        timeSlot: selectedTimeSlot.start,
        createdAt: new Date().toISOString(),
        status: 'scheduled',
        location: doctor.location,
        consultationFees: doctor.consultationFees,
        paymentMethod: bookingData.paymentMethod
      };

      await addDoc(collection(db, 'Appointments'), appointment);
      setShowConfirmation(true);
      handleBooking(selectedTimeSlot);
      openModal();
      // router.push('/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Doctor not found</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5ef] min-h-screen">
      <PageHeader title="Doctor Details" breadcrumb={["Home", "Doctor Details"]} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-6">
                  <div className="relative w-32 h-32">
                    {doctor.imageUrl ? (
                      <Image
                        src={doctor.imageUrl}
                        alt={`Profile photo of Dr. ${doctor.fullName}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {doctor.fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h1 className="text-2xl font-bold">{doctor.fullName}</h1>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <Share2 className="w-5 h-5 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <Heart className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                    <p className="text-gray-500 text-sm mb-4">{doctor.qualifications}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">⭐️ 0.0</span>
                        <span className="text-sm text-gray-400">(0)</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        📍 {doctor.location?.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        📞 {doctor.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b mb-6">
                <div className="flex gap-6">
                  {(['about', 'services', 'healthcare', 'review'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-2 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? 'border-b-2 border-[#ff8a3c] text-[#ff8a3c]'
                          : 'text-gray-500'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'about' && (
                <div>
                  <h3 className="font-bold mb-4">About Dr. {doctor.fullName}</h3>
                  <p className="text-gray-600">{doctor.about || doctor.qualifications}</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Book Appointment</h2>
              <p className="text-sm text-gray-500 mb-6">
                Monday to Sunday: 9:30am - 7:pm
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {selectedDate && schedule && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => {
                      const slot = schedule.timeSlots.find(s => s.start === e.target.value);
                      if (slot) handleBooking(slot);
                    }}
                  >
                    <option value="">Select time slot</option>
                    {schedule.timeSlots
                      .filter(slot => !slot.booked)
                      .map((slot, index) => (
                        <option key={index} value={slot.start}>
                          {slot.start}
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}

              {showConfirmation && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your phone number"
                      value={bookingData.phoneNumber}
                      onChange={(e) => setBookingData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter patient name"
                      value={bookingData.patientName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, patientName: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="razorpay"
                      checked={bookingData.paymentMethod === 'razorpay'}
                      onChange={(e) => setBookingData(prev => ({ 
                        ...prev, 
                        paymentMethod: e.target.checked ? 'razorpay' : null 
                      }))}
                    />
                    <label htmlFor="razorpay" className="text-sm text-gray-600">
                      Pay with Razorpay
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">
                  Consultation Fee: ₹{doctor.consultationFees}
                </p>
                {showConfirmation ? (
                  <div className="space-y-3">
                    <button
                      onClick={confirmBooking}
                      disabled={!bookingData.phoneNumber || !bookingData.patientName}
                      className="w-full py-2 px-4 bg-[#ff8a3c] text-white rounded-md hover:bg-[#ff7a2c] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Book Appointment
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmation(false);
                        setSelectedTimeSlot(null);
                        setBookingData({
                          phoneNumber: '',
                          patientName: '',
                          paymentMethod: null
                        });
                      }}
                      className="w-full py-2 px-4 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  !user && (
                    <button
                      onClick={signInWithGoogle}
                      className="w-full py-2 px-4 bg-[#ff8a3c] text-white rounded-md hover:bg-[#ff7a2c]"
                    >
                      Sign in to Book
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
  <Dialog as="div" className="relative z-10" onClose={closeModal}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
    </Transition.Child>

    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Confirm Your Appointment
            </Dialog.Title>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                <strong>Doctor:</strong> {doctor?.fullName}<br />
                <strong>Date:</strong> {selectedDate && formatDate(selectedDate)}<br />
                <strong>Time:</strong> {selectedTimeSlot?.start}<br />
                <strong>Patient:</strong> {bookingData.patientName}<br />
                <strong>Phone:</strong> {bookingData.phoneNumber}<br />
                <strong>Fee:</strong> ₹{doctor?.consultationFees}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-[#ff8a3c] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff7a2c] focus:outline-none"
                onClick={async () => {
                  try {
                    const appointment = {
                      doctorId: id,
                      doctorName: doctor?.fullName,
                      patientId: user?.uid,
                      patientName: bookingData.patientName,
                      phoneNumber: bookingData.phoneNumber,
                      date: selectedDate && formatDateForFirebase(selectedDate),
                      day: selectedDate && daysOfWeek[selectedDate.getDay()],
                      timeSlot: selectedTimeSlot?.start,
                      createdAt: new Date().toISOString(),
                      status: 'scheduled',
                      location: doctor?.location,
                      consultationFees: doctor?.consultationFees,
                      paymentMethod: bookingData.paymentMethod
                    };

                    await addDoc(collection(db, 'Appointments'), appointment);
                    closeModal();
                    // router.push('/appointments');
                  } catch (error) {
                    console.error('Error booking appointment:', error);
                  }
                }}
              >
                Confirm Booking
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
</Transition>
    </div>
  );
}
