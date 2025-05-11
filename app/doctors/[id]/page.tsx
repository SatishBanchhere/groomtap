'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Share2, Heart, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PageHeader from '@/components/shared/page-header';
import { Metadata } from 'next';
import {DoctorSEOTags, DoctorStructuredData} from "@/components/seo/DoctorSEOTags";


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

export type Doctor = {
  id: string;
  fullName: string;
  specialty: string;
  consultationFees: string;
  imageUrl: string;
  qualifications: string;
  ayushmanCardAvailable: boolean;
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
  patientAddress: string;
};

type Review = {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
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
    paymentMethod: null,
    patientAddress: ''
  });
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'review'>('about');
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [error, setError] = useState<string>("");
  const [showMobileBookingPanel, setShowMobileBookingPanel] = useState(false);
  //@ts-ignore
  const {id} = useParams();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    const fetchDoctorAndReviews = async () => {
      const docRef = doc(db, 'doctors', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
      }

      const reviewsRef = collection(db, `doctors/${id}/reviews`);
      const querySnapshot = await getDocs(reviewsRef);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);

      if (reviewsData.length > 0) {
        const total = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(total / reviewsData.length);
      }

      setLoading(false);
    };

    fetchDoctorAndReviews();
  }, [id]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedDate || !doctor?.availability) return;

      const dayName = daysOfWeek[selectedDate.getDay()];
      if (doctor?.availability && !doctor?.availability[dayName]) {
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, doctor) => {
    const selected = new Date(e.target.value);
    setSelectedDate(selected);

    const dayOfWeek = selected.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[dayOfWeek];
    console.log(doctor)
      console.log(doctor.availability)
      console.log(doctor.availability[dayName])
    if(!doctor.availability[dayName]) {
      setError(`Doctor is not available on ${dayName}`);
    } else {
      setError("");
    }
  }

  const handleBooking = async (timeSlot: TimeSlot) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    if (!selectedDate || !doctor) return;
    setSelectedTimeSlot(timeSlot);
    setShowConfirmation(true);
  };

  const confirmBooking = async () => {
    if (!selectedTimeSlot || !selectedDate || !doctor || !user) return;
    if (!bookingData.phoneNumber || !bookingData.patientName || !bookingData.patientAddress) return;

    const userRef = collection(db, 'users');
    const q = query(userRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    let docId;
    if (!querySnapshot.empty) {
      docId = querySnapshot.docs[0].id;
    }

    // Load Razorpay SDK
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // Step 1: Call backend to create Razorpay order
      const orderResponse = await fetch('/api/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(doctor.consultationFees) * 100, // in paise
          doctorId: doctor.id,
          userId: user.uid
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const { id: orderId } = await orderResponse.json();

      // Step 2: Initialize Razorpay with the order ID
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseInt(doctor.consultationFees) * 100,
        currency: "INR",
        order_id: orderId, // Critical: Comes from backend
        name: "DocZappoint",
        description: "Doctor Consultation Fee",
        image: "/logo.png",
        handler: async function (response) {
          // On successful payment
          const appointment = {
            doctorId: id,
            doctorName: doctor.fullName,
            patientId: docId || user.uid,
            patientName: bookingData.patientName,
            phoneNumber: bookingData.phoneNumber,
            date: formatDateForFirebase(selectedDate),
            day: daysOfWeek[selectedDate.getDay()],
            timeSlot: selectedTimeSlot.start,
            createdAt: new Date().toISOString(),
            status: 'scheduled',
            location: doctor.location,
            consultationFees: doctor.consultationFees,
            paymentMethod: "online",
            paymentId: response.razorpay_payment_id,
            orderId: orderId,
            isTestPayment: true,
          };

          try {
            await addDoc(collection(db, 'Appointments'), appointment);
            openModal();
          } catch (error) {
            console.error('Error saving appointment:', error);
            alert("Payment was successful, but booking failed. Contact support.");
          }
        },
        prefill: {
          name: bookingData.patientName,
          email: user.email,
          contact: bookingData.phoneNumber,
        },
        notes: {
          doctorId: doctor.id,
          userId: user.uid,
        },
        theme: {
          color: "#0ea5e9",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert("Failed to initialize payment. Please try again.");
    }
  };
  const handleReviewSubmit = async () => {
    if (!user || !newReview.comment || newReview.rating === 0) return;

    try {
      const reviewData = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userImage: user.photoURL || '',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, `doctors/${id}/reviews`), reviewData);
      setReviews([...reviews, { id: Date.now().toString(), ...reviewData }]);

      const newTotal = [...reviews, reviewData].reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(newTotal / (reviews.length + 1));

      setNewReview({
        rating: 0,
        comment: '',
      });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
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
      <>
        {doctor && (
            <>
              <DoctorSEOTags doctor={doctor} />
              <DoctorStructuredData
                  doctor={doctor}
                  reviews={reviews}
                  averageRating={averageRating}
              />
            </>
        )}
        <div className="bg-[#f8f5ef] min-h-screen">
        <PageHeader title="Doctor Details" breadcrumb={["Home", "Doctor Details"]} />

        {/* Mobile Booking Panel Toggle - Only shown on mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10">
          <button
              onClick={() => setShowMobileBookingPanel(!showMobileBookingPanel)}
              className="w-full py-3 px-4 bg-[#ff8a3c] text-white flex justify-between items-center"
          >
            <span>Book Appointment</span>
            {showMobileBookingPanel ? <ChevronDown /> : <ChevronUp />}
          </button>
        </div>

        <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Doctor Profile - Visible on both mobile and desktop */}
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="relative w-full md:w-32 h-32">
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
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h1 className="text-2xl font-bold">{doctor.fullName}</h1>
                        <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                        <p className="text-gray-500 text-sm mb-4">{doctor.qualifications}</p>
                      </div>
                      {/*<div className="flex gap-2 mt-2 md:mt-0">*/}
                      {/*  <button className="p-2 hover:bg-gray-100 rounded-full">*/}
                      {/*    <Share2 className="w-5 h-5 text-gray-500" />*/}
                      {/*  </button>*/}
                      {/*  <button className="p-2 hover:bg-gray-100 rounded-full">*/}
                      {/*    <Heart className="w-5 h-5 text-gray-500" />*/}
                      {/*  </button>*/}
                      {/*</div>*/}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-500">{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        📍 {doctor.location?.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        📞 {doctor.phone}
                      </div>

                    </div>
                    {doctor.ayushmanCardAvailable && (
                        <div className="flex items-center gap-2 pt-2">
                              <span className="text-green-600 font-medium text-sm">
                                ✅ Ayushman Card Accepted
                              </span>
                        </div>
                    )}

                  </div>

                </div>

                {/* Tabs - Visible on both mobile and desktop */}
                <div className="border-b mb-6">
                  <div className="flex gap-6 overflow-x-auto">
                    {(['about', 'services', 'review'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap pb-4 px-2 text-sm font-medium capitalize ${
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

                {/* Tab Content */}
                {activeTab === 'about' && (
                    <div>
                      <h3 className="font-bold mb-4">About Dr. {doctor.fullName}</h3>
                      <p className="text-gray-600">{doctor.about || doctor.qualifications}</p>
                    </div>
                )}

                {activeTab === 'review' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold">Patient Reviews</h3>
                        <button
                            onClick={() => {
                              if (!user) {
                                signInWithGoogle();
                                return;
                              }
                              setShowReviewForm(true);
                            }}
                            className="bg-[#ff8a3c] text-white px-4 py-2 rounded-md hover:bg-[#ff7a2c]"
                        >
                          Write a Review
                        </button>
                      </div>

                      {showReviewForm && (
                          <div className="mb-8 p-4 border rounded-lg">
                            <h4 className="font-medium mb-4">Write Your Review</h4>
                            <div className="flex items-center mb-4">
                              <p className="mr-2">Rating:</p>
                              {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                      key={star}
                                      onClick={() => setNewReview({ ...newReview, rating: star })}
                                      className="text-2xl"
                                  >
                                    {star <= newReview.rating ? '★' : '☆'}
                                  </button>
                              ))}
                            </div>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Share your experience with this doctor..."
                                className="w-full p-2 border rounded-md mb-4 h-24"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                  onClick={() => setShowReviewForm(false)}
                                  className="px-4 py-2 border rounded-md"
                              >
                                Cancel
                              </button>
                              <button
                                  onClick={handleReviewSubmit}
                                  disabled={!newReview.comment || newReview.rating === 0}
                                  className="bg-[#ff8a3c] text-white px-4 py-2 rounded-md hover:bg-[#ff7a2c] disabled:opacity-50"
                              >
                                Submit Review
                              </button>
                            </div>
                          </div>
                      )}

                      {reviews.length === 0 ? (
                          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                      ) : (
                          <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b pb-4">
                                  <div className="flex items-center gap-3 mb-2">
                                    {review.userImage ? (
                                        <Image
                                            src={review.userImage}
                                            alt={review.userName}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-400">
                                  {review.userName.charAt(0)}
                                </span>
                                        </div>
                                    )}
                                    <div>
                                      <p className="font-medium">{review.userName}</p>
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-gray-600">{review.comment}</p>
                                  <p className="text-sm text-gray-400 mt-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                            ))}
                          </div>
                      )}
                    </div>
                )}
              </div>
            </div>

            {/* Booking Panel - Right Column (Desktop) */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
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
                      onChange={(e)=> handleDateChange(e, doctor)}
                      min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {error && (
                    <p className="text-red-500 text-sm mt-1">
                      {error}
                    </p>
                )}

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
                            .map((slot, index) => {
                              const [hours, minutes] = slot.start.split(':'); // Split "HH:mm"
                              const slotTime = new Date();
                              slotTime.setHours(hours, minutes, 0, 0); // Set the slot time in today's date

                              const currentTime = Date.now(); // Get the current time
                              const isSlotToday = new Date(selectedDate).toDateString() === new Date().toDateString(); // Check if the selected date is today

                              // If the selected date is today, disable past slots
                              const isSlotPassed = isSlotToday && currentTime > slotTime.getTime();

                              return (
                                  <option
                                      key={index}
                                      value={slot.start}
                                      disabled={isSlotPassed} // Disable if the time has passed or if selected date is today
                                  >
                                    {slot.start} {isSlotPassed && "This time slot has passed."}
                                  </option>
                              );
                            })
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter patient address"
                            value={bookingData.patientAddress}
                            onChange={(e) => setBookingData(prev => ({ ...prev, patientAddress: e.target.value }))}
                        />
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
                                paymentMethod: null,
                                patientAddress: ''
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

        {/* Mobile Booking Panel (Bottom Sheet) */}
        {showMobileBookingPanel && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end">
              <div className="bg-white w-full rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Book Appointment</h2>
                  <button
                      onClick={() => setShowMobileBookingPanel(false)}
                      className="text-gray-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date
                  </label>
                  <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                      onChange={(e)=> handleDateChange(e, doctor)}
                      min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {error && (
                    <p className="text-red-500 text-xs mt-1 mb-2">
                      {error}
                    </p>
                )}

                {selectedDate && schedule && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter patient address"
                            value={bookingData.patientAddress}
                            onChange={(e) => setBookingData(prev => ({ ...prev, patientAddress: e.target.value }))}
                        />
                      </div>
                    </div>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Consultation Fee: ₹{doctor.consultationFees}
                  </p>
                  {showConfirmation ? (
                      <div className="space-y-2">
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
                                paymentMethod: null,
                                patientAddress: ''
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
        )}

        {/* Success Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-30" onClose={closeModal}>
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
                      Your Appointment booked successfully.
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        <strong>Doctor:</strong> {doctor?.fullName}<br />
                        <strong>Date:</strong> {selectedDate && formatDate(selectedDate)}<br />
                        <strong>Time:</strong> {selectedTimeSlot?.start}<br />
                        <strong>Patient:</strong> {bookingData.patientName}<br />
                        <strong>Patient Address:</strong> {bookingData.patientAddress}<br />
                        <strong>Phone:</strong> {bookingData.phoneNumber}<br />
                        <strong>Fee:</strong> ₹{doctor?.consultationFees}
                      </p>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-[#ff8a3c] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff7a2c] focus:outline-none"
                          onClick={async () => {
                            closeModal();
                            return;
                          }}
                      >
                        Booking Successful
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
      </>
  );
}
