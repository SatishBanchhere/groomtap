import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/shared/navbar"
import Footer from "@/components/shared/footer"
import GoToTop from "@/components/shared/go-to-top"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DocZappoint - Book Doctor Appointments Online",
  description: "Book doctor appointments online with DocZappoint. Find the best doctors and specialists near you.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <GoToTop />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'