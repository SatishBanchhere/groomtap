// app/shop/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { User, Shop } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShopForm from '@/components/ShopForm';
import ShopBookingModal from '@/components/ShopBookingModal';
import AuthModal from '@/components/AuthModal';

export default function ShopsPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isShopFormOpen, setIsShopFormOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get user data from Firestore
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email!,
                            name: firebaseUser.displayName!,
                            type: userData.type,
                            photoURL: firebaseUser.photoURL || undefined
                        });
                    } else {
                        // If user doesn't exist in Firestore, create basic user object
                        setUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email!,
                            name: firebaseUser.displayName!,
                            type: 'user', // Default to user type
                            photoURL: firebaseUser.photoURL || undefined
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // Fallback to basic user data
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

    const fetchShops = async () => {
        try {
            const q = query(collection(db, 'shops'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const shopsData: Shop[] = [];

            querySnapshot.forEach((doc) => {
                shopsData.push({
                    id: doc.id,
                    ...doc.data()
                } as Shop);
            });

            setShops(shopsData);
        } catch (error) {
            console.error('Error fetching shops:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleBookingClick = (shop: Shop) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setSelectedShop(shop);
        setIsBookingModalOpen(true);
    };

    const handleBookingSuccess = () => {
        setSuccessMessage('Booking confirmed successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleShopSuccess = () => {
        setSuccessMessage('Shop profile created successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchShops(); // Refresh the list
    };

    const handleSignIn = (userType: User['type']) => {
        // Handle sign in logic here if needed
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading shops...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                onSignInClick={() => setIsAuthModalOpen(true)}
                user={user}
                onSignOut={handleSignOut}
            />

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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Barber Shops</h1>
                            <p className="text-gray-600">Discover top-rated barber shops in your area with home service options</p>
                        </div>
                        {user && (
                            <button
                                onClick={() => setIsShopFormOpen(true)}
                                className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Your Shop</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Shops Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {shops.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
                        <p className="text-gray-600">Be the first to add your shop!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shops.map((shop) => (
                            <div key={shop.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="relative">
                                    <img
                                        src={shop.imageUrl}
                                        alt={shop.shopName}
                                        className="w-full h-48 object-cover rounded-t-xl"
                                    />
                                    <div className="absolute top-2 right-2 flex space-x-1">
                                        {shop.homeService && (
                                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Home Service
                                            </span>
                                        )}
                                        {shop.shopService && (
                                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                In-Shop
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{shop.shopName}</h3>
                                        <p className="text-sm text-gray-600 mb-2">Owner: {shop.ownerName}</p>
                                        <p className="text-gray-600 text-sm line-clamp-2">{shop.description}</p>
                                    </div>

                                    {/* Address */}
                                    <div className="mb-4">
                                        <div className="flex items-start space-x-2">
                                            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-xs text-gray-500 line-clamp-2">{shop.address}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="mb-4">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <p className="text-xs text-gray-500">{shop.phone}</p>
                                        </div>
                                    </div>

                                    {/* Services List */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Services:</h4>
                                        <div className="space-y-1">
                                            {shop.services.slice(0, 2).map((service) => (
                                                <div key={service.id} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600 truncate">{service.name}</span>
                                                    <span className="font-semibold text-blue-600 ml-2">₹{service.charge}</span>
                                                </div>
                                            ))}
                                            {shop.services.length > 2 && (
                                                <p className="text-xs text-gray-500">+{shop.services.length - 2} more services</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Starting from</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                ₹{Math.min(...shop.services.map(s => s.charge))}
                                            </p>
                                            {shop.homeService && shop.homeServiceCharge && (
                                                <p className="text-xs text-gray-500">
                                                    +₹{shop.homeServiceCharge} for home service
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleBookingClick(shop)}
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
                    <ShopForm
                        isOpen={isShopFormOpen}
                        onClose={() => setIsShopFormOpen(false)}
                        user={user}
                        onSuccess={handleShopSuccess}
                    />

                    {selectedShop && (
                        <ShopBookingModal
                            isOpen={isBookingModalOpen}
                            onClose={() => setIsBookingModalOpen(false)}
                            shop={selectedShop}
                            user={user}
                            onSuccess={handleBookingSuccess}
                        />
                    )}
                </>
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSignIn={handleSignIn}
            />
        </div>
    );
}
