export default function FooterAbout() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative w-10 h-10 bg-[#1e293b] border border-gray-700 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">DZ</span>
        </div>
        <span className="font-bold text-xl text-white">
          Doc<span className="text-[#ff8a3c]">Z</span>appoint
        </span>
      </div>
      <p className="text-sm text-gray-400">
        Established on July 10th, 2024, DocZappoint Pvt. Ltd. is transforming healthcare with a state-of-the-art
        telemedicine platform, seamlessly connecting patients with licensed doctors for convenient online appointments.
      </p>
    </div>
  )
}

