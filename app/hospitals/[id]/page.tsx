"use client"
import { use, useEffect, useState } from "react"
import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, ArrowLeft, Star, Clock } from "lucide-react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {HospitalSEOTags, HospitalStructuredData} from "@/components/seo/HospitalSEOTags";

type Hospital = {
  id: string
  fullName: string
  imageUrl: string
  ayushmanCardAvailable: boolean
  location: {
    address: string
    city: string
    state: string
  }
  phone: string
  about: string
}

type Doctor = {
  id: string
  fullName: string
  imageUrl: string
  specialty: string
  experienceInYears: string
  ayushmanCardAvailable: boolean
  hospitalUid: string
  rating: number
  consultationFees: number
}

type Review = {
  id: string
  userId: string
  userName: string
  userImage?: string
  rating: number
  comment: string
  createdAt: string
}

export default function HospitalDetailPage({ params }: { params: { id: string } }) {
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  })
  const { user, signInWithGoogle } = useAuth()
  //@ts-ignore
  const {id} = use(params);

  useEffect(() => {
    const fetchHospitalAndDoctors = async () => {
      try {
        // Fetch hospital details
        const hospitalDoc = await getDoc(doc(db, "hospitals", id))
        if (hospitalDoc.exists()) {
          setHospital({
            id: hospitalDoc.id,
            ...hospitalDoc.data()
          } as Hospital)

          // Fetch doctors associated with this hospital
          const doctorsRef = collection(db, "doctors")
          const doctorsQuery = query(doctorsRef, where("hospitalUid", "==", id))
          const doctorsSnapshot = await getDocs(doctorsQuery)
          const doctorsData = doctorsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Doctor[]
          setDoctors(doctorsData)
        }

        // Fetch reviews
        const reviewsRef = collection(db, `hospitals/${id}/reviews`)
        const reviewsSnapshot = await getDocs(reviewsRef)
        const reviewsData = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[]
        setReviews(reviewsData)

        // Calculate average rating
        if (reviewsData.length > 0) {
          const total = reviewsData.reduce((sum, review) => sum + review.rating, 0)
          setAverageRating(total / reviewsData.length)
        }
      } catch (error) {
        console.error("Error fetching hospital and doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitalAndDoctors()
  }, [id])

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

      await addDoc(collection(db, `hospitals/${id}/reviews`), reviewData);

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
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
    )
  }

  if (!hospital) {
    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Hospital not found</h1>
        </div>
    )
  }

  return (
      <>
        {hospital && (
            <>
              <HospitalSEOTags hospital={hospital} doctors={doctors} />
              <HospitalStructuredData
                  hospital={hospital}
                  reviews={reviews}
                  averageRating={averageRating}
                  doctors={doctors}
              />
            </>
        )}
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/hospitals" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Hospitals
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 w-full">
            <Image
                src={hospital.imageUrl || "/placeholder-hospital.jpg"}
                alt={hospital.fullName || "Hospital Name"}
                fill
                className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{hospital.fullName}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
                  </div>
                </div>
              </div>
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

            <div className="flex flex-col gap-3 text-gray-600 mb-6">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{hospital.location.address}, {hospital.location.city}, {hospital.location.state}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>{hospital.phone}</span>
              </div>
            </div>
            <p className="text-gray-700 mb-8">{hospital.about}</p>
            {hospital.ayushmanCardAvailable && (
                <div className="flex items-center gap-2">
                                                            <span className="text-green-600 font-medium text-sm">
                                                              ✅ Ayushman Card Accepted
                                                            </span>
                </div>
            )}
            {/* Reviews Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Patient Reviews</h2>

              {showReviewForm && (
                  <div className="mb-8 p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Write Your Review</h3>
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
                        placeholder="Share your experience with this hospital..."
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
                                    alt={review.userName || ""}
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
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Doctors at {hospital.fullName}</h2>
            <Link href="/doctors" className="text-[#ff8a3c] hover:text-[#e67a34]">
              View all doctors
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
                <Link
                    href={`/doctors/${doctor.id}`}
                    key={doctor.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                          src={doctor.imageUrl || "/placeholder-doctor.jpg"}
                          alt={doctor.fullName || "Doctor Name"}
                          fill
                          className="object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{doctor.fullName}</h3>
                      <p className="text-gray-600 text-sm mb-2">{doctor.specialty}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {/*<div className="flex items-center">*/}
                        {/*  <Star className="w-4 h-4 text-yellow-400 mr-1" />*/}
                        {/*  <span>{doctor.rating}</span>*/}
                        {/*</div>*/}


                        {/*<span>•</span>*/}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{doctor.experienceInYears} years of experience</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[#ff8a3c] font-medium">
                        ₹{doctor.consultationFees} Consultation
                      </div>
                      {doctor.ayushmanCardAvailable && (
                          <div className="flex items-center gap-2">
                                                            <span className="text-green-600 font-medium text-sm">
                                                              ✅ Ayushman Card Accepted
                                                            </span>
                          </div>
                      )}
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </div>
      </>
  )
}
