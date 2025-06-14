// app/layout-client.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import GoToTop from "@/components/shared/go-to-top";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import TopBar from "@/components/layout/top-bar";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
import RightClickBlocker from "@/components/RightClickBlocker";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();

    // View counter effect
    useEffect(() => {
        const updateViewCount = async () => {
            const analyticsDocRef = doc(db, "analytics", "viewCounts");

            try {
                const docSnap = await getDoc(analyticsDocRef);

                if (docSnap.exists()) {
                    // Document exists, update it
                    await updateDoc(analyticsDocRef, {
                        totalViews: increment(1),
                        lastUpdated: new Date().toISOString(),
                    });
                } else {
                    // Document doesn't exist, create it with initial values
                    await setDoc(analyticsDocRef, {
                        totalViews: 1,
                        lastUpdated: new Date().toISOString(),
                    });
                }
            } catch (error) {
                console.error("Failed to update view count:", error);
            }
        };

        updateViewCount();
    }, [pathName]);


    return (
        <AuthProvider>
            <TopBar />
            <Navbar />
            {/*<RightClickBlocker/>*/}
            <main className="min-h-screen">{children}</main>
            {pathName !== "/tool" && pathName !== "/admin" && <Footer />}
            <GoToTop />
            <Toaster position="top-center" richColors />
        </AuthProvider>
    );
}
