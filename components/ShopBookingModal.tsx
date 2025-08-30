// app/components/ShopBookingModal.tsx
'use client'
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Shop, Service } from '@/types';

interface ShopBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    shop: Shop;
    user: User;
    onSuccess: () => void;
}

const ShopBookingModal: React.FC<ShopBookingModalProps> = ({ isOpen, onClose, shop, user, onSuccess }) => {
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        selectedServiceId: '',
        serviceType: 'shop' as 'home' | 'shop',
        clientAddress: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    // Generate time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
    ];

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    const selectedService = shop.services.find(service => service.id === bookingData.selectedServiceId);
    const totalCharge = selectedService ?
        selectedService.charge + (bookingData.serviceType === 'home' && shop.homeServiceCharge ? shop.homeServiceCharge : 0) : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!bookingData.date || !bookingData.time || !bookingData.selectedServiceId) {
                throw new Error('Please fill in all required fields');
            }

            if (bookingData.serviceType === 'home' && !bookingData.clientAddress.trim()) {
                throw new Error('Please enter your address for home service');
            }

            if (!selectedService) {
                throw new Error('Invalid service selected');
            }

            const booking = {
                shopId: shop.id,
                shopName: shop.shopName,
                selectedService: selectedService,
                serviceType: bookingData.serviceType,
                clientId: user.id,
                clientName: user.name,
                clientEmail: user.email,
                clientAddress: bookingData.serviceType === 'home' ? bookingData.clientAddress.trim() : null,
                appointmentDate: bookingData.date,
                appointmentTime: bookingData.time,
                totalCharge: totalCharge,
                status: 'pending' as const,
                createdAt: new Date().toISOString(),
            };

            await addDoc(collection(db, 'shopBookings'), booking);

            onSuccess();
            onClose();

            // Reset form
            setBookingData({
                date: '',
                time: '',
                selectedServiceId: '',
                serviceType: 'shop',
                clientAddress: '',
            });
        } catch (error: any) {
            console.error('Error creating shop booking:', error);
            setError(error.message || 'Failed to create booking');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h2>
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <img src={shop.imageUrl} alt={shop.shopName} className="w-12 h-12 rounded-full object-cover" />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">{shop.shopName}</p>
                            <p className="text-sm text-gray-600">{shop.ownerName}</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Service Selection */}
                    <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Service
                        </label>
                        <select
                            id="service"
                            value={bookingData.selectedServiceId}
                            onChange={(e) => setBookingData({ ...bookingData, selectedServiceId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                            required
                        >
                            <option value="">Choose a service</option>
                            {shop.services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} - ₹{service.charge}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Service Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {shop.shopService && (
                                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                    bookingData.serviceType === 'shop'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                    <input
                                        type="radio"
                                        name="serviceType"
                                        value="shop"
                                        checked={bookingData.serviceType === 'shop'}
                                        onChange={(e) => setBookingData({ ...bookingData, serviceType: e.target.value as 'shop' })}
                                        className="sr-only"
                                        disabled={isLoading}
                                    />
                                    <div className="text-center">
                                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <p className="text-sm font-medium">In Shop</p>
                                    </div>
                                </label>
                            )}
                            {shop.homeService && (
                                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                    bookingData.serviceType === 'home'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                    <input
                                        type="radio"
                                        name="serviceType"
                                        value="home"
                                        checked={bookingData.serviceType === 'home'}
                                        onChange={(e) => setBookingData({ ...bookingData, serviceType: e.target.value as 'home' })}
                                        className="sr-only"
                                        disabled={isLoading}
                                    />
                                    <div className="text-center">
                                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <p className="text-sm font-medium">Home Service</p>
                                        <p className="text-xs text-gray-500">+₹{shop.homeServiceCharge}</p>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Client Address for Home Service */}
                    {bookingData.serviceType === 'home' && (
                        <div>
                            <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="clientAddress"
                                value={bookingData.clientAddress}
                                onChange={(e) => setBookingData({ ...bookingData, clientAddress: e.target.value })}
                                placeholder="Enter your complete address with landmarks"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    )}

                    {/* Date Selection */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={bookingData.date}
                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                            min={today}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* Time Selection */}
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Time Slot
                        </label>
                        <select
                            id="time"
                            value={bookingData.time}
                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                            required
                        >
                            <option value="">Choose a time slot</option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Booking Summary */}
                    {bookingData.date && bookingData.time && selectedService && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Service:</span> {selectedService.name}</p>
                                <p><span className="font-medium">Type:</span> {bookingData.serviceType === 'home' ? 'Home Service' : 'In-Shop Service'}</p>
                                <p><span className="font-medium">Date:</span> {new Date(bookingData.date).toLocaleDateString()}</p>
                                <p><span className="font-medium">Time:</span> {bookingData.time}</p>
                                <div className="border-t border-gray-200 pt-1 mt-2">
                                    <p><span className="font-medium">Service Charge:</span> ₹{selectedService.charge}</p>
                                    {bookingData.serviceType === 'home' && shop.homeServiceCharge && (
                                        <p><span className="font-medium">Home Service Charge:</span> ₹{shop.homeServiceCharge}</p>
                                    )}
                                    <p className="font-semibold text-lg"><span className="font-medium">Total:</span> ₹{totalCharge}</p>
                                </div>
                                {bookingData.serviceType === 'shop' && (
                                    <div className="border-t border-gray-200 pt-1 mt-2">
                                        <p className="text-xs text-gray-600"><span className="font-medium">Shop Address:</span> {shop.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Confirm Booking'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShopBookingModal;