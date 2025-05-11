import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {Hospital, Doctor, Review} from '@/types/hospital';

export const getHospitalById = async (id: string): Promise<Hospital | null> => {
    const docRef = doc(db, 'hospitals', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Hospital : null;
};

export const getDoctorsByHospital = async (hospitalId: string): Promise<Doctor[]> => {
    const doctorsRef = collection(db, "doctors");
    const q = query(doctorsRef, where("hospitalUid", "==", hospitalId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Doctor[];
};

export const getHospitalReviews = async (hospitalId: string): Promise<Review[]> => {
    const reviewsRef = collection(db, `hospitals/${hospitalId}/reviews`);
    const querySnapshot = await getDocs(reviewsRef);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Review[];
};
