// app/freelancers/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import {  onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { User, Freelancer } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FreelancerForm from '@/components/FreelancerForm';
import BookingModal from '@/components/BookingModal';
import AuthModal from '@/components/AuthModal';

export default function FreelancersPage() {
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFreelancerFormOpen, setIsFreelancerFormOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email!,
                    name: firebaseUser.displayName!,
                    type: 'user', // You might want to get this from Firestore
                    photoURL: firebaseUser.photoURL || undefined
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchFreelancers = async () => {
        try {
            const q = query(collection(db, 'freelancers'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const freelancersData: Freelancer[] = [];

            querySnapshot.forEach((doc) => {
                freelancersData.push({
                    id: doc.id,
                    ...doc.data()
                } as Freelancer);
            });

            setFreelancers(freelancersData);
        } catch (error) {
            console.error('Error fetching freelancers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFreelancers();
    }, []);

    const handleBookingClick = (freelancer: Freelancer) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setSelectedFreelancer(freelancer);
        setIsBookingModalOpen(true);
    };

    const handleBookingSuccess = () => {
        setSuccessMessage('Booking confirmed successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleFreelancerSuccess = () => {
        setSuccessMessage('Freelancer profile created successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchFreelancers(); // Refresh the list
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading freelancers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onSignInClick={() => setIsAuthModalOpen(true)} user={user} />

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mx-4 mt-4">
                    {successMessage}
                </div>
            )}

            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Freelancers</h1>
                            <p className="text-gray-600">Find and book appointments with skilled barbers</p>
                        </div>
                        {user && (
                            <button
                                onClick={() => setIsFreelancerFormOpen(true)}
                                className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Yourself as Freelancer</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Freelancers Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {freelancers.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No freelancers found</h3>
                        <p className="text-gray-600">Be the first to add yourself as a freelancer!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancers.map((freelancer) => (
                            <div key={freelancer.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <img
                                            src={freelancer.imageUrl}
                                            alt={freelancer.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 truncate">{freelancer.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{freelancer.description}</p>
                                        </div>
                                    </div>

                                    {/* Services List */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Services:</h4>
                                        <div className="space-y-1">
                                            {freelancer.services.slice(0, 2).map((service) => (
                                                <div key={service.id} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600 truncate">{service.name}</span>
                                                    <span className="font-semibold text-blue-600 ml-2">₹{service.charge}</span>
                                                </div>
                                            ))}
                                            {freelancer.services.length > 2 && (
                                                <p className="text-xs text-gray-500">+{freelancer.services.length - 2} more services</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Starting from</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                ₹{Math.min(...freelancer.services.map(s => s.charge))}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleBookingClick(freelancer)}
                                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            {/* Modals */}
            {user && (
                <>
                    <FreelancerForm
                        isOpen={isFreelancerFormOpen}
                        onClose={() => setIsFreelancerFormOpen(false)}
                        user={user}
                        onSuccess={handleFreelancerSuccess}
                    />

                    {selectedFreelancer && (
                        <BookingModal
                            isOpen={isBookingModalOpen}
                            onClose={() => setIsBookingModalOpen(false)}
                            freelancer={selectedFreelancer}
                            user={user}
                            onSuccess={handleBookingSuccess}
                        />
                    )}
                </>
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSignIn={() => {}}
            />
        </div>
    );
}
