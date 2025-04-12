'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {auth, googleProvider} from '@/lib/firebase';
import {onAuthStateChanged, signInWithPopup, signOut, User} from 'firebase/auth';
import {toast} from 'sonner';
import {collection, getDocs, query, setDoc, where, doc} from "firebase/firestore";
import {db} from "@/lib/firebase";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => {
    },
    logout: async () => {
    },
});

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log(user);
            setUser(user);
            try {
                const userRef = collection(db, "users");
                const q = query(userRef,
                    where("email", "==", user.email)
                    );

                const querySnapshot = await getDocs(q);
                if(querySnapshot.empty){
                    const userRef = doc(db, "users", user.uid);

                    await setDoc(userRef, {
                        name: user.displayName,
                        email: user.email,
                        createdAt: Date.now()
                    })
                }


            } catch (err) {
                console.error(err);
            }

            toast.success('Successfully signed in!');
        } catch (error: any) {
            console.error('Error signing in with Google:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Sign-in cancelled. Please try again.');
            } else if (error.code === 'auth/popup-blocked') {
                toast.error('Pop-up was blocked. Please allow pop-ups for this site.');
            } else {
                toast.error('Failed to sign in. Please try again.');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            toast.success('Successfully signed out!');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error('Failed to sign out. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{user, loading, signInWithGoogle, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
