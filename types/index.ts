// app/types/index.ts
export interface User {
    id: string;
    email: string;
    name: string;
    type: 'user' | 'freelancer' | 'shop';
    photoURL?: string;
}

export interface Service {
    id: string;
    name: string;
    charge: number;
}

export interface Shop {
    id: string;
    uid: string;
    shopName: string;
    ownerName: string;
    description: string;
    address: string;
    phone: string;
    imageUrl: string;
    services: Service[];
    homeService: boolean; // Provides home service
    shopService: boolean; // Provides in-shop service
    homeServiceCharge?: number; // Additional charge for home service
    createdAt: string;
    updatedAt: string;
}

export interface ShopBooking {
    id: string;
    shopId: string;
    shopName: string;
    selectedService: Service;
    serviceType: 'home' | 'shop'; // Home service or shop service
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: string; // Required for home service
    appointmentDate: string;
    appointmentTime: string;
    totalCharge: number; // Service charge + home service charge (if applicable)
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
}

export interface Freelancer {
    id: string;
    uid: string;
    name: string;
    description: string;
    imageUrl: string;
    services: Service[];
    createdAt: string;
    updatedAt: string;
}

export interface Booking {
    id: string;
    freelancerId: string;
    freelancerName: string;
    selectedService: Service;
    clientId: string;
    clientName: string;
    clientEmail: string;
    appointmentDate: string;
    appointmentTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
}

export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignIn: (userType: User['type']) => void;
}

export interface NavbarProps {
    onSignInClick: () => void;
    user?: User | null;
    onSignOut?: () => void;
}
