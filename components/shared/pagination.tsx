"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function Pagination({ totalItems, itemsPerPage = 9 }: { totalItems: number, itemsPerPage?: number }) {
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `?${params.toString()}`
  }

  return (
      <div className="flex justify-center mt-8">
        <div className="flex items-center space-x-2">
          <PaginationArrow
              direction="prev"
              href={createPageURL(currentPage - 1)}
              isDisabled={currentPage <= 1}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationNumber
                  key={page}
                  number={page}
                  active={currentPage === page}
                  href={createPageURL(page)}
              />
          ))}

          <PaginationArrow
              direction="next"
              href={createPageURL(currentPage + 1)}
              isDisabled={currentPage >= totalPages}
          />
        </div>
      </div>
  )
}

function PaginationNumber({ number, active, href }: {
  number: number;
  active: boolean;
  href: string
}) {
  return (
      <Link
          href={href}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
              active ? "bg-[#ff8a3c] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
      >
        {number}
      </Link>
  )
}

function PaginationArrow({ direction, href, isDisabled }: {
  direction: "prev" | "next";
  href: string;
  isDisabled: boolean;
}) {
  const icon = direction === "prev" ? (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.59 16L12 14.59L6.42 9L12 3.41L10.59 2L3.59 9L10.59 16Z" fill="currentColor" />
      </svg>
  ) : (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.41 16L4 14.59L9.58 9L4 3.41L5.41 2L12.41 9L5.41 16Z" fill="currentColor" />
      </svg>
  )

  return isDisabled ? (
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 cursor-not-allowed">
        {icon}
      </div>
  ) : (
      <Link
          href={href}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-700 hover:bg-gray-100"
      >
        {icon}
      </Link>
  )
}
