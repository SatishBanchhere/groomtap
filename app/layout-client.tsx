// app/layout-client.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import GoToTop from "@/components/shared/go-to-top";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import TopBar from "@/components/layout/top-bar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();

    return (
        <AuthProvider>
            <TopBar />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            {pathName !== "/tool" && pathName !== "/admin" && <Footer />}
            <GoToTop />
            <Toaster position="top-center" richColors />
        </AuthProvider>
    );
}
