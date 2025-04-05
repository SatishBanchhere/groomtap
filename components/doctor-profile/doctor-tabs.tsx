"use client"

import { useState } from "react"

export default function DoctorTabs() {
  const [activeTab, setActiveTab] = useState("about")

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="bg-gray-800 text-white flex">
        <TabButton id="about" label="About Us" active={activeTab === "about"} onClick={() => setActiveTab("about")} />
        <TabButton
          id="services"
          label="Services"
          active={activeTab === "services"}
          onClick={() => setActiveTab("services")}
        />
        <TabButton
          id="healthcare"
          label="Health Care"
          active={activeTab === "healthcare"}
          onClick={() => setActiveTab("healthcare")}
        />
        <TabButton id="review" label="Review" active={activeTab === "review"} onClick={() => setActiveTab("review")} />
      </div>
      <div className="p-6">
        {activeTab === "about" && (
          <div>
            <h2 className="text-xl font-bold mb-4">About Dr Rakhi Agarwal ( Dr Rungia Clinic):</h2>
            <p>MBBS ,DNB</p>
          </div>
        )}
        {activeTab === "services" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Services:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Gynecological Consultations</li>
              <li>Infertility Treatment</li>
              <li>Prenatal Care</li>
              <li>Family Planning</li>
              <li>Gynecological Surgeries</li>
            </ul>
          </div>
        )}
        {activeTab === "healthcare" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Health Care:</h2>
            <p>
              Dr. Rakhi Agarwal provides comprehensive women's healthcare services with a focus on personalized care and
              patient comfort.
            </p>
          </div>
        )}
        {activeTab === "review" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Reviews:</h2>
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <h3 className="font-medium">Priya Singh</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Dr. Rakhi is an excellent doctor. She is very patient and listens to all concerns. Highly recommended!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({
  id,
  label,
  active,
  onClick,
}: {
  id: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button className={`px-4 py-3 ${active ? "bg-[#ff8a3c]" : "hover:bg-gray-700"}`} onClick={onClick}>
      {label}
    </button>
  )
}

function Star({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

