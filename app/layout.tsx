// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout-client"; // ✅ New client layout wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GroomTap - Book Salon Appointments Online",
    description:
        "Book salon appointments online with GroomTap. Find the best salons and experts near you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
        </body>
        </html>
    );
}
