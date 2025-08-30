// app/components/ShopForm.tsx
'use client'
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImageToImgBB } from '@/lib/imgbb';
import { User, Service } from '@/types';

interface ShopFormProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSuccess: () => void;
}

const ShopForm: React.FC<ShopFormProps> = ({ isOpen, onClose, user, onSuccess }) => {
    const [formData, setFormData] = useState({
        shopName: '',
        ownerName: user.name,
        description: '',
        address: '',
        phone: '',
        homeService: false,
        shopService: true,
        homeServiceCharge: '',
    });
    const [services, setServices] = useState<Service[]>([
        { id: '1', name: '', charge: 0 }
    ]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addService = () => {
        const newService: Service = {
            id: Date.now().toString(),
            name: '',
            charge: 0
        };
        setServices([...services, newService]);
    };

    const removeService = (serviceId: string) => {
        if (services.length > 1) {
            setServices(services.filter(service => service.id !== serviceId));
        }
    };

    const updateService = (serviceId: string, field: 'name' | 'charge', value: string | number) => {
        setServices(services.map(service =>
            service.id === serviceId
                ? { ...service, [field]: field === 'charge' ? Number(value) : value }
                : service
        ));
    };

    const validateForm = () => {
        if (!formData.shopName.trim()) {
            throw new Error('Please enter shop name');
        }
        if (!formData.ownerName.trim()) {
            throw new Error('Please enter owner name');
        }
        if (!formData.description.trim()) {
            throw new Error('Please enter shop description');
        }
        if (!formData.address.trim()) {
            throw new Error('Please enter shop address');
        }
        if (!formData.phone.trim()) {
            throw new Error('Please enter phone number');
        }
        if (!formData.homeService && !formData.shopService) {
            throw new Error('Please select at least one service type (home or shop)');
        }
        if (formData.homeService && (!formData.homeServiceCharge || Number(formData.homeServiceCharge) <= 0)) {
            throw new Error('Please enter a valid home service charge');
        }
        if (!selectedImage) {
            throw new Error('Please select a shop image');
        }

        for (const service of services) {
            if (!service.name.trim()) {
                throw new Error('All services must have a name');
            }
            if (service.charge <= 0) {
                throw new Error('All services must have a valid charge');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            validateForm();

            // Upload image to ImgBB
            const imageUrl = await uploadImageToImgBB(selectedImage!);

            // Create shop document
            const shopData = {
                uid: user.id,
                shopName: formData.shopName.trim(),
                ownerName: formData.ownerName.trim(),
                description: formData.description.trim(),
                address: formData.address.trim(),
                phone: formData.phone.trim(),
                imageUrl: imageUrl,
                services: services.map(service => ({
                    id: service.id,
                    name: service.name.trim(),
                    charge: service.charge
                })),
                homeService: formData.homeService,
                shopService: formData.shopService,
                homeServiceCharge: formData.homeService ? Number(formData.homeServiceCharge) : null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            await addDoc(collection(db, 'shops'), shopData);

            onSuccess();
            onClose();

            // Reset form
            setFormData({
                shopName: '',
                ownerName: user.name,
                description: '',
                address: '',
                phone: '',
                homeService: false,
                shopService: true,
                homeServiceCharge: '',
            });
            setServices([{ id: '1', name: '', charge: 0 }]);
            setSelectedImage(null);
            setPreviewImage('');
        } catch (error: any) {
            console.error('Error creating shop:', error);
            setError(error.message || 'Failed to create shop profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                    disabled={isLoading}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Shop</h2>
                    <p className="text-gray-600">Set up your barber shop profile to start receiving bookings</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Shop Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Image
                            </label>
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-xs text-gray-400">Upload Image</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Shop Name */}
                        <div>
                            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="shopName"
                                value={formData.shopName}
                                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                placeholder="Enter your shop name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Owner Name */}
                        <div>
                            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="ownerName"
                                value={formData.ownerName}
                                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                placeholder="Enter owner name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your shop, specialties, atmosphere, and what makes you unique..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter complete shop address with landmarks"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter phone number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Service Types */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Service Types <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.shopService}
                                        onChange={(e) => setFormData({ ...formData, shopService: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">In-Shop Service</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.homeService}
                                        onChange={(e) => setFormData({ ...formData, homeService: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Home Service Available</span>
                                </label>
                            </div>
                        </div>

                        {/* Home Service Charge */}
                        {formData.homeService && (
                            <div>
                                <label htmlFor="homeServiceCharge" className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Home Service Charge (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="homeServiceCharge"
                                    value={formData.homeServiceCharge}
                                    onChange={(e) => setFormData({ ...formData, homeServiceCharge: e.target.value })}
                                    placeholder="e.g., 100"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isLoading}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Additional charge for home service (added to base service price)
                                </p>
                            </div>
                        )}

                        {/* Services Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Services Offered <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={addService}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                    disabled={isLoading}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Add Service</span>
                                </button>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {services.map((service, index) => (
                                    <div key={service.id} className="flex gap-3 items-start p-3 border border-gray-200 rounded-lg">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={service.name}
                                                onChange={(e) => updateService(service.id, 'name', e.target.value)}
                                                placeholder={`Service ${index + 1} name (e.g., Hair Cut & Style)`}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                disabled={isLoading}
                                                required
                                            />
                                        </div>
                                        <div className="w-24">
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                                                <input
                                                    type="number"
                                                    value={service.charge || ''}
                                                    onChange={(e) => updateService(service.id, 'charge', e.target.value)}
                                                    placeholder="0"
                                                    min="1"
                                                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    disabled={isLoading}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {services.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeService(service.id)}
                                                className="text-red-500 hover:text-red-700 p-2"
                                                disabled={isLoading}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button - Full Width */}
                    <div className="lg:col-span-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Create Shop Profile'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShopForm;
