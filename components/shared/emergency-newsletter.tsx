"use client"

import {useEffect, useState} from "react"
import { Phone, Mail } from "lucide-react"
import { motion } from "framer-motion"
import {addDoc, collection, getDocs} from "firebase/firestore"
import { db } from "@/lib/firebase"
type data = {
  phoneNumber: string;
}

const initialData = {
  phoneNumber: ""
}
export default function EmergencyNewsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [impData, setImpData] = useState<data>(initialData);

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    const webContentRef = collection(db, "webContent");
    const webContentSnapshot = await getDocs(webContentRef);
    const tempData: data = {
      phoneNumber: "",

    }
    for(const doc of webContentSnapshot.docs) {
      if(doc.id === "phoneNumber"){
        console.log(doc.data())
        tempData.phoneNumber = doc.data().content
      }
    }
    setImpData(tempData);
    console.log(impData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validate email
      if (!email) {
        throw new Error("Please enter your email address")
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      // Submit to Firebase
      await addDoc(collection(db, "newsletter_subscribers"), {
        email,
        subscribedAt: new Date().toISOString()
      })

      // Clear form
      setEmail("")
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="emergency-call"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Phone className="text-primary-500" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Emergency Call</h3>
                <motion.a
                  href={`${impData.phoneNumber.replace(/<\/?p>/g, "")}`}
                  whileHover={{ scale: 1.05 }}
                  className="text-xl font-bold text-primary-500 hover:text-primary-600 transition-colors"
                  dangerouslySetInnerHTML={{__html:impData.phoneNumber}}
                >

                </motion.a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="newsletter"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Mail className="text-primary-500" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Newsletter</h3>
                <p className="text-text-secondary">Subscribe to our newsletter</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-md bg-surface border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-500 text-white rounded-r-md hover:bg-primary-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Mail size={16} />
                    </>
                  )}
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-500 text-sm"
                >
                  Thank you for subscribing to our newsletter!
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

