import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative w-10 h-10 bg-[#1e293b] rounded-full flex items-center justify-center">
        <span className="text-white text-xs">DZ</span>
      </div>
      <span className="font-bold text-xl">
        Doc<span className="text-[#ff8a3c]">Z</span>appoint
      </span>
    </Link>
  )
}

