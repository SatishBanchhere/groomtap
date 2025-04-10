// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout-client"; // ✅ New client layout wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DocZappoint - Book Doctor Appointments Online",
    description:
        "Book doctor appointments online with DocZappoint. Find the best doctors and specialists near you.",
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
