import Link from "next/link"
import { Plus } from "lucide-react"

export default function JoinButton() {
  return (
    <Link
      href="/join-as-doctor"
      className="bg-[#ff8a3c] text-white px-4 py-2 rounded-full hover:bg-[#e67a2e] transition-all flex items-center space-x-1"
    >
      <Plus size={16} />
      <span>Join As Doctor</span>
    </Link>
  )
}

