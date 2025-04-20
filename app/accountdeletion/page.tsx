"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { deleteUser, signOut } from "firebase/auth"
import { doc, deleteDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import Image from "next/image"
import AccountDeletionIntro from "@/components/accountdeletion/accountdeletion-intro";

export default function AccountDeletionPage() {
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
      const userDocRef = doc(db, "users", user.uid)

      // Get all subcollections and delete them
      const userCollections = await getDocs(collection(db, `users/${user.uid}`))
      const batch = writeBatch(db)

      userCollections.forEach((doc) => {
        batch.delete(doc.ref)
      })

      // Delete the user document itself
      batch.delete(userDocRef)

      // Execute all deletions
      await batch.commit()

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
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Account Deletion</h2>
            <p>You need to be signed in to delete your account.</p>
            <button
                onClick={() => router.push("/login")}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Sign In
            </button>
          </div>
        </div>
    )
  }

  return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-center">
            <div className="space-y-4">
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
