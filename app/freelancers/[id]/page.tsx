'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Share2, Heart, Star, ChevronDown, ChevronUp, MapPin, Clock, Phone, Award, Users, Calendar } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PageHeader from '@/components/shared/page-header';
import { Metadata } from 'next';
import {DoctorSEOTags, DoctorStructuredData} from "@/components/seo/DoctorSEOTags";
import DoctorNotFound from "@/components/DoctorNotFound";
import { motion } from 'framer-motion';

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
  const [doctorNotFound, setDoctorNotFound] = useState<boolean>(false);
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
        setDoctorNotFound(false);
      }
      else{
        setDoctorNotFound(true);
        console.log("Freelancer not found.");
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, doctor: Doctor) => {
    const selected = new Date(e.target.value);
    setSelectedDate(selected);

    const dayOfWeek = selected.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[dayOfWeek];
    
    if(!doctor.availability[dayName]) {
      setError(`Freelancer is not available on ${dayName}`);
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
        name: "GroomTap",
        description: "Grooming Consultation Fee",
        image: "/logo.png",
        handler: async function (response: any) {
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
          color: "#10b981", // Green theme
        },
      };

      //@ts-ignore
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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-emerald-900 via-green-800 to-teal-900">
          <motion.div 
            className="w-16 h-16 border-4 border-green-300 border-t-green-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
    );
  }

  if (!doctor || doctorNotFound) {
    return <DoctorNotFound />;
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
        
        {/* COMPLETELY NEW LAYOUT: Vertical Hero Section */}
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-20 right-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 15, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-32 left-32 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
            />
          </div>

          {/* TOP SECTION: Hero Profile */}
          <div className="relative z-10 pt-12 pb-8">
            <motion.div 
              className="container mx-auto px-6"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
                
                {/* Profile Image - Enlarged and Centered */}
                <motion.div 
                  className="relative w-80 h-80"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Image
                      src={doctor.imageUrl || "/placeholder-doctor.png"}
                      alt={`Profile photo of ${doctor?.fullName}`}
                      fill
                      className="rounded-3xl object-cover border-8 border-green-300/30 shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent rounded-3xl" />
                  
                  {/* Floating Badge */}
                  <motion.div 
                    className="absolute -top-6 -right-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-2xl shadow-xl"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2">
                      <Award size={20} />
                      <span className="font-bold">Expert</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Profile Info - Redesigned */}
                <motion.div 
                  className="flex-1 text-center lg:text-left"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <h1 className="text-5xl lg:text-7xl font-black text-white mb-4 leading-tight">
                    {doctor?.fullName}
                  </h1>
                  
                  <p className="text-2xl lg:text-3xl text-green-300 font-bold mb-6">
                    {doctor.specialty} Specialist
                  </p>
                  
                  <p className="text-xl text-green-100 mb-8 leading-relaxed">
                    {doctor.qualifications}
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { icon: <Star size={24} />, value: averageRating.toFixed(1), label: "Rating" },
                      { icon: <Users size={24} />, value: reviews.length, label: "Reviews" },
                      { icon: <Award size={24} />, value: "5+", label: "Years Exp" },
                      { icon: <Calendar size={24} />, value: "24/7", label: "Available" }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-300/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <div className="text-green-300 mb-2 flex justify-center">{stat.icon}</div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-green-200 text-sm">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex items-center gap-3 text-green-200">
                      <MapPin size={20} className="text-green-400" />
                      <span className="text-lg">{doctor.location?.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-200">
                      <Phone size={20} className="text-green-400" />
                      <span className="text-lg">{doctor.phone}</span>
                    </div>
                  </div>

                  {/* Price Display */}
                  <motion.div 
                    className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-xl mb-8"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm opacity-80">Starting from</span>
                    <div className="text-3xl font-bold">₹{doctor.consultationFees}</div>
                    <span className="text-sm opacity-80">per session</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* MIDDLE SECTION: Booking Form - Horizontal Layout */}
          <motion.div 
            className="bg-white/95 backdrop-blur-lg shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="container mx-auto px-6 py-12">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-green-800 mb-12">
                  Book Your Beauty Session
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Booking Form */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-bold text-green-800 mb-3">
                          Select Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-6 border-3 border-emerald-300 rounded-2xl focus:border-emerald-500 focus:outline-none text-green-800 text-lg"
                            onChange={(e)=> handleDateChange(e, doctor)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      {selectedDate && schedule && (
                        <div>
                          <label className="block text-lg font-bold text-green-800 mb-3">
                            Select Time
                          </label>
                          <select
                              className="w-full p-6 border-3 border-emerald-300 rounded-2xl focus:border-emerald-500 focus:outline-none text-green-800 text-lg"
                              onChange={(e) => {
                                const slot = schedule.timeSlots.find(s => s.start === e.target.value);
                                if (slot) handleBooking(slot);
                              }}
                          >
                            <option value="">Choose your time</option>
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
                    </div>

                    {error && (
                        <motion.div 
                          className="bg-red-50 border-l-4 border-red-400 p-6 rounded-2xl"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <p className="text-red-600 font-medium">{error}</p>
                        </motion.div>
                    )}

                    {showConfirmation && (
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-lg font-bold text-green-800 mb-3">
                                Your Name
                              </label>
                              <input
                                  type="text"
                                  className="w-full p-6 border-3 border-emerald-300 rounded-2xl focus:border-emerald-500 focus:outline-none text-green-800 text-lg"
                                  placeholder="Enter your name"
                                  value={bookingData.patientName}
                                  onChange={(e) => setBookingData(prev => ({ ...prev, patientName: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="block text-lg font-bold text-green-800 mb-3">
                                Phone Number
                              </label>
                              <input
                                  type="tel"
                                  className="w-full p-6 border-3 border-emerald-300 rounded-2xl focus:border-emerald-500 focus:outline-none text-green-800 text-lg"
                                  placeholder="Your contact number"
                                  value={bookingData.phoneNumber}
                                  onChange={(e) => setBookingData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-lg font-bold text-green-800 mb-3">
                              Address
                            </label>
                            <input
                                type="text"
                                className="w-full p-6 border-3 border-emerald-300 rounded-2xl focus:border-emerald-500 focus:outline-none text-green-800 text-lg"
                                placeholder="Your full address"
                                value={bookingData.patientAddress}
                                onChange={(e) => setBookingData(prev => ({ ...prev, patientAddress: e.target.value }))}
                            />
                          </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {showConfirmation ? (
                          <>
                            <motion.button
                                onClick={confirmBooking}
                                disabled={!bookingData.phoneNumber || !bookingData.patientName}
                                className="flex-1 py-6 px-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-xl"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                              Confirm & Pay ₹{doctor.consultationFees}
                            </motion.button>
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
                                className="px-8 py-6 border-3 border-emerald-300 text-emerald-700 rounded-2xl hover:bg-emerald-50 font-bold text-xl"
                            >
                              Cancel
                            </button>
                          </>
                      ) : (
                          !user && (
                              <motion.button
                                  onClick={signInWithGoogle}
                                  className="w-full py-6 px-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-700 hover:to-green-700 font-bold text-xl shadow-xl"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                              >
                                Sign in to Book Appointment
                              </motion.button>
                          )
                      )}
                    </div>
                  </div>

                  {/* Service Features */}
                  <div className="space-y-8">
                    <h3 className="text-3xl font-bold text-green-800">Why Choose Us?</h3>
                    <div className="space-y-6">
                      {[
                        { icon: "✨", title: "Premium Experience", desc: "Luxury beauty treatments in comfort" },
                        { icon: "🎯", title: "Expert Skills", desc: "Certified professionals with years of experience" },
                        { icon: "💯", title: "Satisfaction Guaranteed", desc: "100% satisfaction or money back guarantee" },
                        { icon: "🏆", title: "Award Winning", desc: "Recognized excellence in beauty services" }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          className="flex items-start gap-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-100"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.1 }}
                        >
                          <div className="text-3xl">{feature.icon}</div>
                          <div>
                            <h4 className="font-bold text-xl text-green-800 mb-2">{feature.title}</h4>
                            <p className="text-green-600 text-lg">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM SECTION: Tabs Content - Horizontal Cards */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                
                {/* Tab Navigation - Horizontal Pills */}
                <div className="flex justify-center mb-16">
                  <div className="flex bg-white rounded-2xl p-2 shadow-xl border-2 border-emerald-100">
                    {(['about', 'services', 'review'] as const).map((tab) => (
                        <motion.button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 text-lg font-bold capitalize rounded-xl transition-all ${
                                activeTab === tab
                                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                                    : 'text-green-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                          {tab}
                        </motion.button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeTab === 'about' && (
                      <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-emerald-100">
                        <h3 className="text-4xl font-bold mb-8 text-green-800 text-center">
                          About {doctor.fullName}
                        </h3>
                        <p className="text-green-700 text-xl leading-relaxed text-center max-w-4xl mx-auto">
                          {doctor.about || doctor.qualifications}
                        </p>
                      </div>
                  )}

                  {activeTab === 'review' && (
                      <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-emerald-100">
                        <div className="flex justify-between items-center mb-12">
                          <h3 className="text-4xl font-bold text-green-800">Client Reviews</h3>
                          <motion.button
                              onClick={() => {
                                if (!user) {
                                  signInWithGoogle();
                                  return;
                                }
                                setShowReviewForm(true);
                              }}
                              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl hover:from-emerald-700 hover:to-green-700 font-bold text-lg shadow-xl"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                          >
                            Write a Review
                          </motion.button>
                        </div>

                        {showReviewForm && (
                            <motion.div 
                              className="mb-12 p-8 border-3 border-emerald-200 rounded-3xl bg-gradient-to-r from-emerald-50 to-green-50"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <h4 className="text-2xl font-bold mb-8 text-green-800">Share Your Experience</h4>
                              <div className="flex items-center mb-8">
                                <p className="mr-6 text-xl font-bold text-green-700">Rating:</p>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="text-5xl hover:scale-110 transition-transform mx-1"
                                        whileHover={{ scale: 1.2 }}
                                    >
                                      {star <= newReview.rating ? '⭐' : '☆'}
                                    </motion.button>
                                ))}
                              </div>
                              <textarea
                                  value={newReview.comment}
                                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                  placeholder="Tell others about your amazing experience..."
                                  className="w-full p-6 border-3 border-emerald-300 rounded-2xl mb-8 h-40 focus:border-emerald-500 focus:outline-none text-green-800 text-lg"
                              />
                              <div className="flex justify-end gap-6">
                                <button
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-8 py-4 border-3 border-emerald-300 text-emerald-700 rounded-2xl hover:bg-emerald-50 font-bold text-lg"
                                >
                                  Cancel
                                </button>
                                <motion.button
                                    onClick={handleReviewSubmit}
                                    disabled={!newReview.comment || newReview.rating === 0}
                                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-2xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 font-bold text-lg shadow-xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                  Submit Review
                                </motion.button>
                              </div>
                            </motion.div>
                        )}

                        {reviews.length === 0 ? (
                            <div className="text-center py-16">
                              <p className="text-green-600 text-2xl font-bold">No reviews yet. Be the first to review!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {reviews.map((review, index) => (
                                  <motion.div 
                                    key={review.id} 
                                    className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 rounded-2xl border-2 border-emerald-100"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <div className="flex items-center gap-6 mb-6">
                                      {review.userImage ? (
                                          <Image
                                              src={review.userImage}
                                              alt={review.userName}
                                              width={64}
                                              height={64}
                                              className="rounded-full border-4 border-emerald-200"
                                          />
                                      ) : (
                                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-200 to-green-200 flex items-center justify-center border-4 border-emerald-300">
                                    <span className="text-2xl font-bold text-emerald-700">
                                      {review.userName.charAt(0)}
                                    </span>
                                          </div>
                                      )}
                                      <div>
                                        <p className="text-xl font-bold text-green-800">{review.userName}</p>
                                        <div className="flex items-center">
                                          {[...Array(5)].map((_, i) => (
                                              <Star
                                                  key={i}
                                                  className={`w-5 h-5 ${
                                                      i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                                  }`}
                                              />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-green-700 text-lg leading-relaxed mb-4">{review.comment}</p>
                                    <p className="text-green-600 font-bold">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                  </motion.div>
                              ))}
                            </div>
                        )}
                      </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal with Green theme */}
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border-4 border-emerald-200">
                    <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-green-800 mb-6"
                    >
                      Your Appointment booked successfully! 🎉
                    </Dialog.Title>
                    <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
                      <p className="text-green-700 leading-relaxed">
                        <strong>Freelancer:</strong> {doctor?.fullName}<br />
                        <strong>Date:</strong> {selectedDate && formatDate(selectedDate)}<br />
                        <strong>Time:</strong> {selectedTimeSlot?.start}<br />
                        <strong>Client:</strong> {bookingData.patientName}<br />
                        <strong>Address:</strong> {bookingData.patientAddress}<br />
                        <strong>Phone:</strong> {bookingData.phoneNumber}<br />
                        <strong>Fee:</strong> ₹{doctor?.consultationFees}
                      </p>
                    </div>

                    <div className="mt-8 flex gap-3">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-xl border border-transparent bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-4 text-lg font-bold text-white hover:from-emerald-700 hover:to-green-700 focus:outline-none transition-all duration-300"
                          onClick={async () => {
                            closeModal();
                            return;
                          }}
                      >
                        Booking Successful! ✓
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
  );
}
