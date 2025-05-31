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
import { doc, updateDoc, increment } from "firebase/firestore";
import RightClickBlocker from "@/components/RightClickBlocker";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();

    // View counter effect
    useEffect(() => {
        const updateViewCount = async () => {
            try {
                await updateDoc(doc(db, "analytics", "viewCounts"), {
                    totalViews: increment(1),
                    lastUpdated: new Date().toISOString(),
                });
            } catch (error) {
                console.error("Failed to update view count:", error);
            }
        };
        updateViewCount();
    }, [pathName]); // Re-run when route changes

    return (
        <AuthProvider>
            <TopBar />
            <Navbar />
            <RightClickBlocker/>
            <main className="min-h-screen">{children}</main>
            {pathName !== "/tool" && pathName !== "/admin" && <Footer />}
            <GoToTop />
            <Toaster position="top-center" richColors />
        </AuthProvider>
    );
}
