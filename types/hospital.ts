export type HospitalLocation = {
    address: string;
    city: string;
    state: string;
};

export type Hospital = {
    id: string;
    fullName: string;
    imageUrl: string;
    ayushmanCardAvailable: boolean;
    location: HospitalLocation;
    phone: string;
    about: string;
};

export type Doctor = {
    id: string;
    fullName: string;
    imageUrl: string;
    specialty: string;
    experienceInYears: string;
    ayushmanCardAvailable: boolean;
    hospitalUid: string;
    rating: number;
    consultationFees: number;
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
