"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

type FormData = {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error("Please fill in all fields")
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      // Submit to Firebase
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: new Date().toISOString()
      })

      // Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-primary-500 font-medium"
            >
              CONTACT US
            </motion.span>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold mt-2"
            >
              Get in Touch with Us
            </motion.h2>
          </div>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </motion.div>
            </div>

            <motion.div whileFocus={{ scale: 1.02 }}>
              <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="How can we help?"
              />
            </motion.div>

            <motion.div whileFocus={{ scale: 1.02 }}>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder="Your message..."
              />
            </motion.div>

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
                Thank you for your message! We'll get back to you soon.
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={16} />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  )
}

