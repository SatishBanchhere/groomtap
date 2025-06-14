'use client';

import { useState, useEffect, Fragment } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { Share2, Heart, Star } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import PageHeader from '@/components/shared/page-header';

interface TimeSlot {
    start: string;
    end: string;
    booked: boolean;
}

interface Schedule {
    id: string;
    day: string;
    timeSlots: TimeSlot[];
}

interface Test {
    name: string;
    serviceType: string;
    charge?: string;
    homeCharge?: string;
    visitCharge?: string;
}

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface Lab {
    id: string;
    fullName: string;
    about: string;
    location: {
        address: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
    whatsapp: string;
    imageUrl?: string;
    specialties: Test[];
}

export default function LabDetailPage() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [lab, setLab] = useState<Lab | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [loading, setLoading] = useState(true);
    const [tests, setTests] = useState<Test[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');

    useEffect(() => {
        const fetchLab = async () => {
            try {
                const docRef = doc(db, 'lab_form', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const labData = docSnap.data() as Lab;
                    setLab({ id: docSnap.id, ...labData });
                    setTests(labData.specialties || []);
                }

                const reviewsRef = collection(db, `lab_form/${id}/reviews`);
                const reviewsSnapshot = await getDocs(reviewsRef);
                const reviewsData = reviewsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Review[];

                setReviews(reviewsData);
                if (reviewsData.length > 0) {
                    const total = reviewsData.reduce((sum, review) => sum + review.rating, 0);
                    setAverageRating(total / reviewsData.length);
                }

            } catch (error) {
                console.error('Error fetching lab:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLab();
    }, [id]);

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

    const locationString = [
        lab.location?.address,
        lab.location?.city,
        lab.location?.state,
        lab.location?.pincode
    ].filter(Boolean).join(', ');

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "DiagnosticLab",
                        "name": lab.fullName,
                        "description": lab.about,
                        "url": `https://doczappoint.com/labs/${lab.id}`,
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": lab.location.address,
                            "addressLocality": lab.location.city,
                            "addressRegion": lab.location.state,
                            "postalCode": lab.location.pincode
                        },
                        "telephone": lab.whatsapp
                    })
                }}
            />

            <div className="container mx-auto px-4 py-8">
                <PageHeader title="Lab Details" breadcrumb={["Home", "Labs", lab.fullName]} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    {lab.imageUrl ? (
                                        <Image
                                            src={lab.imageUrl}
                                            alt={`${lab.fullName} lab`}
                                            fill
                                            className="rounded-lg object-cover"
                                            priority
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
                                    <h1 className="text-2xl font-bold mb-2">{lab.fullName}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        {averageRating > 0 && (
                                            <div className="flex items-center gap-1">
                                                ⭐️ {averageRating.toFixed(1)} ({reviews.length})
                                            </div>
                                        )}
                                        <div>📍 {locationString}</div>
                                        <div>📞 {lab.whatsapp}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b mb-6">
                                <div className="flex gap-6">
                                    {(['about', 'services', 'reviews'] as const).map((tab) => (
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
                                    <h2 className="font-bold mb-4">About {lab.fullName}</h2>
                                    <p className="text-gray-600">{lab.about}</p>
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div>
                                    <h2 className="font-bold mb-4">Available Tests</h2>
                                    <div className="space-y-4">
                                        {tests.map((test) => (
                                            <div key={test.name} className="border p-4 rounded-lg">
                                                <h3 className="font-medium">{test.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {test.serviceType === 'both' ? 'Home/Lab' : test.serviceType} • ₹
                                                    {test.serviceType === 'both'
                                                        ? `${test.homeCharge} (Home) / ${test.visitCharge} (Lab)`
                                                        : test.charge}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <h2 className="font-bold mb-4">Reviews</h2>
                                    {reviews.length === 0 ? (
                                        <p className="text-gray-500">No reviews yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="border-b pb-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-lg font-bold text-gray-400">
                                {review.userName.charAt(0)}
                              </span>
                                                        </div>
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
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-lg font-bold mb-4">Book Tests</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Tests
                                    </label>
                                    <div className="space-y-2">
                                        {tests.map((test) => (
                                            <div key={test.name} className="flex items-center justify-between p-2 border rounded">
                                                <div>
                                                    <p className="font-medium">{test.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {test.serviceType === 'both' ? 'Home/Lab' : test.serviceType}
                                                    </p>
                                                </div>
                                                <p className="font-medium">
                                                    ₹{test.serviceType === 'both' ? `${test.homeCharge}` : test.charge}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!user) {
                                            signInWithGoogle();
                                            return;
                                        }
                                        // Handle booking logic
                                    }}
                                    className="w-full py-2 px-4 bg-[#ff8a3c] text-white rounded-md hover:bg-[#ff7a2c]"
                                >
                                    {user ? 'Book Tests' : 'Sign in to Book'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
