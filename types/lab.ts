export type TimeSlot = {
    booked: boolean;
    cancelled: boolean;
    end: string; // Format: "06:22 PM"
    patient: string | null;
    start: string; // Format: "06:07 PM"
    status: 'Available' | 'Booked' | 'Cancelled';
}

export type LabSchedule = {
    createdAt: string; // Format: "5 April 2025 at 18:07:58 UTC+5:30"
    day: string; // e.g. "Monday"
    endTime: string; // Format: '19:40'
    interval: number; // e.g. 15 (minutes)
    startTime: string; // Format: '18:07'
    timeSlots: TimeSlot[];
}

export type LabLocation = {
    address: string;
    city: string;
    district: string;
    state: string;
    pincode?: string;
}

export type Lab = {
    specialties: any;
    id: string;
    about: string;
    createdAt: string;
    email: string;
    fullName: string;
    imageDeleteHash?: string;
    imageUrl: string;
    lastLogin?: string;
    location: LabLocation;
    serviceType: string;
    status: 'active' | 'inactive';
    tests: string[];
    address?: string;
    // phone: string;
    // schedules: LabSchedule[];
    whatsapp: string;
}

export type LabAppointment = {
    id: string;
    Address: string;
    Age: number;
    LabName: string;
    PatientName: string;
    PhoneNumber: string;
    createdAt: string;
    date: string;
    labUid: string;
    location: {
        district: string;
        state: string;
    };
    timeSlot: string;
}

export type Test = {
    name: string;
    serviceType: string;
    charge?: string;
    homeCharge?: string;
    visitCharge?: string;
};


export type Review = {
    id: string;
    userId: string;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    createdAt: string;
};
