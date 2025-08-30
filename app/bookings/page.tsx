// app/bookings/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { User, Booking, ShopBooking } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

interface CombinedBooking {
    id: string;
    type: 'freelancer' | 'shop';
    providerName: string;
    providerImage?: string;
    serviceName: string;
    serviceCharge: number;
    appointmentDate: string;
    appointmentTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
    serviceType?: 'home' | 'shop';
    clientAddress?: string;
    shopAddress?: string;
    totalCharge?: number;
}

export default function BookingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<CombinedBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', firebaseUser.uid)));

                    if (!userDoc.empty) {
                        const userData = userDoc.docs[0].data();
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email!,
                            name: firebaseUser.displayName!,
                            type: userData.type,
                            photoURL: firebaseUser.photoURL || undefined
                        });
                    } else {
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email!,
                            name: firebaseUser.displayName!,
                            type: 'user',
                            photoURL: firebaseUser.photoURL || undefined
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email!,
                        name: firebaseUser.displayName!,
                        type: 'user',
                        photoURL: firebaseUser.photoURL || undefined
                    });
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchBookings = async () => {
        if (!user) {
            console.log("⚠️ No user found, skipping fetchBookings");
            return;
        }

        try {
            setIsLoading(true);
            console.log("🔑 Fetching bookings for UID:", user.id);

            // Fetch freelancer bookings
            console.log("📥 Querying freelancer bookings...");
            const freelancerBookingsQuery = query(
                collection(db, 'bookings'),
                where('clientId', '==', user.id),
                orderBy('createdAt', 'desc')
            );
            const freelancerBookingsSnapshot = await getDocs(freelancerBookingsQuery);
            console.log("✅ Freelancer bookings fetched:", freelancerBookingsSnapshot.size);

            // Fetch shop bookings
            console.log("📥 Querying shop bookings...");
            const shopBookingsQuery = query(
                collection(db, 'shopBookings'),
                where('clientId', '==', user.id),
                orderBy('createdAt', 'desc')
            );
            const shopBookingsSnapshot = await getDocs(shopBookingsQuery);
            console.log("✅ Shop bookings fetched:", shopBookingsSnapshot.size);

            const combinedBookings: CombinedBooking[] = [];

            // Process freelancer bookings
            console.log("🛠 Processing freelancer bookings...");
            freelancerBookingsSnapshot.forEach((doc) => {
                const booking = doc.data() as Booking;
                console.log("   ➡️ Freelancer booking:", { id: doc.id, ...booking });

                combinedBookings.push({
                    id: doc.id,
                    type: 'freelancer',
                    providerName: booking.freelancerName,
                    serviceName: booking.selectedService?.name,
                    serviceCharge: booking.selectedService?.charge,
                    appointmentDate: booking.appointmentDate,
                    appointmentTime: booking.appointmentTime,
                    status: booking.status,
                    createdAt: booking.createdAt,
                });
            });

            // Process shop bookings
            console.log("🛠 Processing shop bookings...");
            shopBookingsSnapshot.forEach((doc) => {
                const booking = doc.data() as ShopBooking;
                console.log("   ➡️ Shop booking:", { id: doc.id, ...booking });

                combinedBookings.push({
                    id: doc.id,
                    type: 'shop',
                    providerName: booking.shopName,
                    serviceName: booking.selectedService?.name,
                    serviceCharge: booking.selectedService?.charge,
                    appointmentDate: booking.appointmentDate,
                    appointmentTime: booking.appointmentTime,
                    status: booking.status,
                    createdAt: booking.createdAt,
                    serviceType: booking.serviceType,
                    clientAddress: booking.clientAddress || undefined,
                    totalCharge: booking.totalCharge,
                });
            });

            // Sort by creation date
            console.log("🔃 Sorting combined bookings by createdAt...");
            combinedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            console.log("📦 Final combined bookings:", combinedBookings);
            setBookings(combinedBookings);

        } catch (error) {
            console.error("❌ Error fetching bookings:", error);
        } finally {
            console.log("🏁 fetchBookings completed");
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleCancelBooking = async (bookingId: string, bookingType: 'freelancer' | 'shop') => {
        try {
            const collection_name = bookingType === 'freelancer' ? 'bookings' : 'shopBookings';
            const bookingRef = doc(db, collection_name, bookingId);

            await updateDoc(bookingRef, {
                status: 'cancelled'
            });

            setSuccessMessage('Booking cancelled successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);

            // Refresh bookings
            fetchBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };

    const handleSignIn = (userType: User['type']) => {
        console.log(`Signing in as: ${userType}`);
    };

    const handleSignOut = async () => {
        try {
            const { signOut } = await import('firebase/auth');
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDateTime = (date: string, time: string) => {
        const dateObj = new Date(`${date}T${time}`);
        return {
            date: dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }),
            time: dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        };
    };

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'all') return true;
        return booking.status === activeTab;
    });

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar onSignInClick={() => setIsAuthModalOpen(true)} user={user} onSignOut={handleSignOut} />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
                        <p className="text-gray-600 mb-8">Please sign in to view your bookings.</p>
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                <Footer />

                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onSignIn={handleSignIn}
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar onSignInClick={() => setIsAuthModalOpen(true)} user={user} onSignOut={handleSignOut} />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your bookings...</p>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onSignInClick={() => setIsAuthModalOpen(true)} user={user} onSignOut={handleSignOut} />

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mx-4 mt-4">
                    {successMessage}
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">Manage and track all your appointments</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        {[
                            { key: 'all', label: 'All Bookings', count: bookings.length },
                            { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
                            { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
                            { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
                            { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-600 mb-6">
                            {activeTab === 'all'
                                ? "You haven't made any bookings yet."
                                : `No ${activeTab} bookings found.`}
                        </p>
                        <div className="flex justify-center space-x-4">
                            <a
                                href="/freelancers"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Find Freelancers
                            </a>
                            <a
                                href="/shop"
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                Find Shops
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => {
                            const dateTime = formatDateTime(booking.appointmentDate, booking.appointmentTime);
                            const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

                            return (
                                <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            {/* Main Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <div className="flex items-center space-x-3">
                                                        {/* Provider Type Badge */}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            booking.type === 'freelancer'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-orange-100 text-orange-800'
                                                        }`}>
                              {booking.type === 'freelancer' ? 'Freelancer' : 'Shop'}
                            </span>

                                                        {/* Service Type Badge for Shops */}
                                                        {booking.type === 'shop' && booking.serviceType && (
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                booking.serviceType === 'home'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                {booking.serviceType === 'home' ? 'Home Service' : 'In-Shop'}
                              </span>
                                                        )}

                                                        {/* Status Badge */}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {booking.providerName}
                                                </h3>

                                                <p className="text-gray-600 mb-3">{booking.serviceName}</p>

                                                {/* Appointment Details */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-600">
                              {dateTime.date} at {dateTime.time}
                            </span>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                        <span className="text-sm text-gray-600">
                              ₹{booking.totalCharge || booking.serviceCharge}
                            </span>
                                                    </div>
                                                </div>

                                                {/* Address for Home Service */}
                                                {booking.serviceType === 'home' && booking.clientAddress && (
                                                    <div className="flex items-start space-x-2 mb-4">
                                                        <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Service Address:</p>
                                                            <p className="text-sm text-gray-600">{booking.clientAddress}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col space-y-2 ml-4">
                                                {canCancel && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.id, booking.type)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}

                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>

                                        {/* Booking Date */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
