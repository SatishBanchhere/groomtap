import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { Doctor, Review } from '@/types/doctor';

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
    const docRef = doc(db, 'doctors', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Doctor : null;
};

export const getDoctorReviews = async (doctorId: string): Promise<Review[]> => {
    const reviewsRef = collection(db, `doctors/${doctorId}/reviews`);
    const querySnapshot = await getDocs(reviewsRef);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Review[];
};
