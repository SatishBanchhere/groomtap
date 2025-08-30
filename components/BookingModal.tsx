// app/components/BookingModal.tsx
'use client'
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Freelancer, Service } from '@/types';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    freelancer: Freelancer;
    user: User;
    onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, freelancer, user, onSuccess }) => {
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        selectedServiceId: '',
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

    const selectedService = freelancer.services.find(service => service.id === bookingData.selectedServiceId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!bookingData.date || !bookingData.time || !bookingData.selectedServiceId) {
                throw new Error('Please fill in all fields');
            }

            if (!selectedService) {
                throw new Error('Invalid service selected');
            }

            const booking = {
                freelancerId: freelancer.id,
                freelancerName: freelancer.name,
                selectedService: selectedService,
                clientId: user.id,
                clientName: user.name,
                clientEmail: user.email,
                appointmentDate: bookingData.date,
                appointmentTime: bookingData.time,
                status: 'pending' as const,
                createdAt: new Date().toISOString(),
            };

            await addDoc(collection(db, 'bookings'), booking);

            onSuccess();
            onClose();

            // Reset form
            setBookingData({ date: '', time: '', selectedServiceId: '' });
        } catch (error: any) {
            console.error('Error creating booking:', error);
            setError(error.message || 'Failed to create booking');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
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
                        <img src={freelancer.imageUrl} alt={freelancer.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">{freelancer.name}</p>
                            <p className="text-sm text-gray-600">{freelancer.description}</p>
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
                            {freelancer.services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} - ₹{service.charge}
                                </option>
                            ))}
                        </select>
                    </div>

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
                                <p><span className="font-medium">Date:</span> {new Date(bookingData.date).toLocaleDateString()}</p>
                                <p><span className="font-medium">Time:</span> {bookingData.time}</p>
                                <p><span className="font-medium">Total:</span> ₹{selectedService.charge}</p>
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

export default BookingModal;
