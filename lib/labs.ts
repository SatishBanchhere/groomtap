import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Lab, Review } from '@/types/lab';

export const getLabById = async (id: string): Promise<Lab | null> => {
    const docRef = doc(db, 'lab_form', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Lab : null;
};

export const getLabReviews = async (labId: string): Promise<Review[]> => {
    const reviewsRef = collection(db, `lab_form/${labId}/reviews`);
    const querySnapshot = await getDocs(reviewsRef);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Review[];
};
