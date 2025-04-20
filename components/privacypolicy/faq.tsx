"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is DocZappoint?",
      answer: "DocZappoint is a comprehensive healthcare platform that connects patients with qualified doctors and healthcare providers. We make it easy to find, book, and manage medical appointments online."
    },
    {
      question: "How do I book an appointment?",
      answer: "Booking an appointment is simple. Search for a doctor by specialty or location, select your preferred time slot, and confirm your booking. You'll receive an instant confirmation via email and SMS."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time. Simply log in to your account and manage your appointments in the dashboard."
    },
    {
      question: "Is my medical information secure?",
      answer: "Yes, we take data security very seriously. All your medical information is encrypted and stored securely following HIPAA guidelines and industry best practices."
    }
  ]

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto rounded-full bg-primary-500 flex items-center justify-center mb-4"
          >
            <HelpCircle size={40} className="text-white" />
          </motion.div>
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary-500 font-medium"
          >
            FAQ'S
          </motion.span>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mt-2"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="mb-4"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 bg-surface rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <span className="font-medium text-text-primary">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp size={20} className="text-primary-500" />
                ) : (
                  <ChevronDown size={20} className="text-primary-500" />
                )}
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-surface/50 rounded-b-lg text-text-secondary">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

