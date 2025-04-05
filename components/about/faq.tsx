"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function Faq() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative">
            <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-white/70 rounded-lg flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#ff8a3c] flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div className="text-[#1e293b] font-bold text-xl">Frequently Asked Questions</div>
                  <p className="text-gray-600 mt-2">Find answers to common questions about our services</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[#ff8a3c] font-medium">FAQ'S</span>
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions.</h2>
            <div className="space-y-4">
              <FaqItem
                question="How do I contact customer service?"
                answer="You can contact our customer service team through the Contact Us page on our website, by emailing doczappoint.in@gmail.com, or by calling our support line at +91 9470075205. Our team is available Monday through Friday from 9 AM to 6 PM to assist you with any questions or concerns."
              />
              <FaqItem
                question="Do doctors pay for good reviews?"
                answer="No, all reviews on DocZappoint are from genuine patients. We ensure complete transparency and do not allow paid or manipulated reviews."
              />
              <FaqItem
                question="Why didn't my review get posted?"
                answer="Reviews may not be posted if they violate our community guidelines, contain inappropriate language, or are flagged by our system for verification. If you believe your review was rejected in error, please contact our support team."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        {isOpen ? (
          <ChevronUp size={20} className="text-[#ff8a3c]" />
        ) : (
          <ChevronDown size={20} className="text-[#ff8a3c]" />
        )}
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

