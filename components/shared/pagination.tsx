import Link from "next/link"

export default function Pagination() {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-2">
        <PaginationArrow direction="prev" />
        <PaginationNumber number={1} active={false} />
        <PaginationNumber number={2} active={true} />
        <PaginationNumber number={3} active={false} />
        <PaginationNumber number={4} active={false} />
        <PaginationArrow direction="next" />
      </div>
    </div>
  )
}

function PaginationNumber({ number, active }: { number: number; active: boolean }) {
  return (
    <Link
      href="#"
      className={`w-8 h-8 flex items-center justify-center rounded-full ${
        active ? "bg-[#ff8a3c] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      {number}
    </Link>
  )
}

function PaginationArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <Link
      href="#"
      className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-100"
    >
      {direction === "prev" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.59 16L12 14.59L6.42 9L12 3.41L10.59 2L3.59 9L10.59 16Z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.41 16L4 14.59L9.58 9L4 3.41L5.41 2L12.41 9L5.41 16Z" fill="currentColor" />
        </svg>
      )}
    </Link>
  )
}

