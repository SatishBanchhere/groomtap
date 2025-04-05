import { Search } from "lucide-react"

export default function DoctorSearch() {
  return (
    <div className="mb-6">
      <div className="flex">
        <input
          type="text"
          placeholder="Ex: Doctor Name"
          className="px-4 py-2 rounded-l-full w-full focus:outline-none border-y border-l border-gray-300"
        />
        <button className="bg-[#ff8a3c] text-white p-3 rounded-r-full hover:bg-[#e67a2e] transition-all">
          <Search size={20} />
        </button>
      </div>
    </div>
  )
}

