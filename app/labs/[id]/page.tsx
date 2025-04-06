'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Share2, Heart, Star } from 'lucide-react';
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

type Test = {
  name: string;
  serviceType: string;
  charge?: string;
  homeCharge?: string;
  visitCharge?: string;
};

type BookingFormData = {
  phoneNumber: string;
  patientName: string;
  paymentMethod: 'razorpay' | null;
  selectedTests: { name: string; serviceType: string }[];
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

type Lab = {
  id: string;
  fullName: string;
  about: string;
  location: {
    address: string;
  };
  whatsapp: string;
  imageUrl?: string;
  specialties: Test[];
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
  const [lab, setLab] = useState<Lab | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [tests, setTests] = useState<Test[] | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    phoneNumber: '',
    patientName: '',
    paymentMethod: null,
    selectedTests: []
  });
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'healthcare' | 'review'>('about');
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  //@ts-ignore
  const { id } = useParams();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    const fetchLabAndReviews = async () => {
      const docRef = doc(db, 'lab_form', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLab({ id: docSnap.id, ...docSnap.data() } as Lab);
        setTests(docSnap.data().specialties as Test[]);
      }

      // Fetch reviews
      const reviewsRef = collection(db, `lab_form/${id}/reviews`);
      const querySnapshot = await getDocs(reviewsRef);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);

      // Calculate average rating
      if (reviewsData.length > 0) {
        const total = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(total / reviewsData.length);
      }

      setLoading(false);
    };

    fetchLabAndReviews();
  }, [id]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedDate) return;

      const schedulesRef = collection(db, `labs/${id}/schedules`);
      const q = query(schedulesRef);

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
  }, [selectedDate, id]);

  const calculateTotalCharge = () => {
    if (!tests) return 0;

    return bookingData.selectedTests.reduce((total, selectedTest) => {
      const test = tests.find(t => t.name === selectedTest.name);
      if (!test) return total;

      let charge = 0;
      if (test.serviceType === 'both') {
        charge = selectedTest.serviceType === 'home' ?
            parseInt(test.homeCharge || '0') : parseInt(test.visitCharge || '0');
      } else {
        charge = parseInt(test.charge || '0');
      }
      return total + (isNaN(charge) ? 0 : charge);
    }, 0);
  };

  const handleBooking = async (timeSlot: TimeSlot) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    if (!selectedDate || !lab) return;
    setSelectedTimeSlot(timeSlot);
    setShowConfirmation(true);
  };

  const confirmBooking = async () => {
    if (!selectedTimeSlot || !selectedDate || !lab || !user) return;
    if (!bookingData.phoneNumber || !bookingData.patientName || bookingData.selectedTests.length === 0) return;

    try {
      const totalCharge = calculateTotalCharge();
      const selectedTestsDetails = bookingData.selectedTests.map(selectedTest => {
        const test = tests?.find(t => t.name === selectedTest.name);
        let charge = 0;
        if (test?.serviceType === 'both') {
          charge = selectedTest.serviceType === 'home' ?
              parseInt(test.homeCharge || '0') : parseInt(test.visitCharge || '0');
        } else {
          charge = parseInt(test?.charge || '0');
        }

        return {
          name: selectedTest.name,
          serviceType: selectedTest.serviceType,
          charge: charge
        };
      });

      const appointment = {
        labUid: id,
        labName: lab.fullName,
        patientId: user.uid,
        patientName: bookingData.patientName,
        phoneNumber: bookingData.phoneNumber,
        date: formatDateForFirebase(selectedDate),
        day: daysOfWeek[selectedDate.getDay()],
        timeSlot: selectedTimeSlot.start,
        createdAt: new Date().toISOString(),
        status: 'scheduled',
        location: lab.location,
        consultationFees: totalCharge,
        tests: selectedTestsDetails,
        paymentMethod: bookingData.paymentMethod
      };

      await addDoc(collection(db, 'AppointmentsLab'), appointment);
      openModal();
    } catch (error) {
      console.error('Error booking appointment:', error);
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

      await addDoc(collection(db, `lab_form/${id}/reviews`), reviewData);

      // Update local state
      setReviews([...reviews, { id: Date.now().toString(), ...reviewData }]);

      // Update average rating
      const newTotal = [...reviews, reviewData].reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(newTotal / (reviews.length + 1));

      // Reset form
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

  if (!lab) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-gray-600">Lab not found</div>
        </div>
    );
  }

  return (
      <div className="bg-[#f8f5ef] min-h-screen">
        <PageHeader title="Lab Details" breadcrumb={["Home", "Lab Details"]} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-6">
                    <div className="relative w-32 h-32">
                      {lab.imageUrl ? (
                          <Image
                              src={lab.imageUrl}
                              alt={`Profile photo of ${lab.fullName}`}
                              fill
                              className="rounded-lg object-cover"
                          />
                      ) : (
                          <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {lab.fullName.charAt(0)}
                        </span>
                          </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-2xl font-bold">{lab.fullName}</h1>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Share2 className="w-5 h-5 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Heart className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">
                          ⭐️ {averageRating.toFixed(1)} ({reviews.length})
                        </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          📍 {lab.location?.address}
                        </div>
                        <div className="text-sm text-gray-500">
                          📞 {lab.whatsapp}
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
                      <h3 className="font-bold mb-4">About {lab.fullName}</h3>
                      <p className="text-gray-600">{lab.about}</p>
                    </div>
                )}

                {activeTab === 'review' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold">Reviews</h3>
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
                                placeholder="Share your experience..."
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
                                Submit
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Tests
                        </label>
                        <div className="space-y-3">
                          {tests?.map((test) => (
                              <div key={test.name} className="border p-3 rounded-md">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{test.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {test.serviceType === 'both' ? 'Home/Lab' : test.serviceType}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <p className="font-medium">
                                      {test.serviceType === 'both' ?
                                          `₹${test.homeCharge} (Home) / ₹${test.visitCharge} (Lab)` :
                                          `₹${test.charge}`}
                                    </p>
                                    <input
                                        type="checkbox"
                                        checked={bookingData.selectedTests.some(t => t.name === test.name)}
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;
                                          setBookingData(prev => {
                                            if (isChecked) {
                                              const serviceType = test.serviceType === 'both' ? 'home' : test.serviceType;
                                              return {
                                                ...prev,
                                                selectedTests: [...prev.selectedTests, { name: test.name, serviceType }]
                                              };
                                            } else {
                                              return {
                                                ...prev,
                                                selectedTests: prev.selectedTests.filter(t => t.name !== test.name)
                                              };
                                            }
                                          });
                                        }}
                                    />
                                  </div>
                                </div>
                                {test.serviceType === 'both' && bookingData.selectedTests.some(t => t.name === test.name) && (
                                    <div className="mt-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                                      <select
                                          className="w-full p-2 border rounded-md"
                                          value={bookingData.selectedTests.find(t => t.name === test.name)?.serviceType || 'home'}
                                          onChange={(e) => {
                                            const serviceType = e.target.value;
                                            setBookingData(prev => ({
                                              ...prev,
                                              selectedTests: prev.selectedTests.map(t =>
                                                  t.name === test.name ? { ...t, serviceType } : t
                                              )
                                            }));
                                          }}
                                      >
                                        <option value="home">Home Collection (₹{test.homeCharge})</option>
                                        <option value="visit">Lab Visit (₹{test.visitCharge})</option>
                                      </select>
                                    </div>
                                )}
                              </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <p className="text-lg font-medium">
                          Total: ₹{calculateTotalCharge()}
                        </p>
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
                  {showConfirmation ? (
                      <div className="space-y-3">
                        <button
                            onClick={confirmBooking}
                            disabled={!bookingData.phoneNumber || !bookingData.patientName || bookingData.selectedTests.length === 0}
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
                                selectedTests: []
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
                      Confirm Your Lab Tests
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        <strong>Lab:</strong> {lab?.fullName}<br />
                        <strong>Date:</strong> {selectedDate && formatDate(selectedDate)}<br />
                        <strong>Time:</strong> {selectedTimeSlot?.start}<br />
                        <strong>Patient:</strong> {bookingData.patientName}<br />
                        <strong>Phone:</strong> {bookingData.phoneNumber}<br />
                        <strong>Total Charge:</strong> ₹{calculateTotalCharge()}<br />

                        <strong className="block mt-2">Selected Tests:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          {bookingData.selectedTests.map((selectedTest, index) => {
                            const test = tests?.find(t => t.name === selectedTest.name);
                            let charge = 0;
                            if (test?.serviceType === 'both') {
                              charge = selectedTest.serviceType === 'home' ?
                                  parseInt(test.homeCharge || '0') : parseInt(test.visitCharge || '0');
                            } else {
                              charge = parseInt(test?.charge || '0');
                            }
                            return (
                                <li key={index}>
                                  {test?.name} ({selectedTest.serviceType === 'home' ? 'Home' : 'Lab'}) - ₹{charge}
                                </li>
                            );
                          })}
                        </ul>
                      </p>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-[#ff8a3c] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff7a2c] focus:outline-none"
                          onClick={() => {
                            closeModal();
                            router.push('/appointments');
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
