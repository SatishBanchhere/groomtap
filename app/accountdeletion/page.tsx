"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { deleteUser, signOut } from "firebase/auth"
import { doc, deleteDoc, collection, query, where, getDocs, writeBatch, getDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import Image from "next/image"
import AccountDeletionIntro from "@/components/accountdeletion/accountdeletion-intro";
import {motion} from "framer-motion";
import {useAuth} from "@/contexts/auth-context";
import PageHeader from "@/components/shared/page-header";

export default function AccountDeletionPage() {
  const { signInWithGoogle } = useAuth();
  const [user, loading] = useAuthState(auth)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()

  const handleDeleteAccount = async () => {
    if (!user) {
      setError("User not authenticated")
      return
    }

    setIsDeleting(true)
    setError("")
    setSuccess("")

    try {
      // Delete user data from Firestore
      console.log(user.email)
      const userRef = collection(db, "users")
      const q = query(userRef, where("email", "==", user.email))
      const querySnap = await getDocs(q)
      querySnap.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref);
      });


      // Delete user from Authentication
      await deleteUser(user)

      // Sign out the user
      await signOut(auth)

      setSuccess("Account deleted successfully. You will be redirected shortly.")
      setTimeout(() => router.push("/"), 3000)
    } catch (err: any) {
      console.error("Error deleting account:", err)
      setError(err.message || "Failed to delete account. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  if (!user) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center space-y-6">
            <h2 className="text-4xl font-extrabold text-gray-800">Delete Account</h2>
            <p className="text-lg text-gray-600">
              You must be signed in to delete your account.
            </p>
            <div className="flex justify-center">
              <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signInWithGoogle}
                  className="flex items-center gap-3 bg-white border-2 border-blue-500 rounded-full px-6 py-3 text-lg font-semibold text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span>Sign In with Google</span>
              </motion.button>
            </div>
          </div>
        </div>
    );
  }
  return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-center">
            <div className="space-y-4">
              <PageHeader title="Delete Account" breadcrumb={["Home", "Delete Account"]} />
              {/*<span className="text-[#ff8a3c] font-medium">Account Delete</span>*/}
              {/*<h2 className="text-3xl md:text-4xl font-bold">We bring care to your home with one click — while keeping your data private and secure.</h2>*/}
              <AccountDeletionIntro/>
              {/*<p>If you wish to delete your account, please note this action is irreversible. All your data will be permanently removed from our systems.</p>*/}

              {!showConfirmation ? (
                  <button
                      onClick={() => setShowConfirmation(true)}
                      className="mt-4 bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    Delete My Account
                  </button>
              ) : (
                  <div className="mt-4 space-y-4">
                    <p className="text-red-600 font-medium">Are you sure you want to permanently delete your account?</p>
                    <div className="flex space-x-4">
                      <button
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className={`py-2 px-6 rounded-md text-white ${
                              isDeleting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                          } transition`}
                      >
                        {isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
                      </button>
                      <button
                          onClick={() => setShowConfirmation(false)}
                          className="py-2 px-6 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
              )}

              {error && <p className="text-red-500 mt-4">{error}</p>}
              {success && <p className="text-green-500 mt-4">{success}</p>}
            </div>
          </div>
        </div>
      </section>
  )
}
