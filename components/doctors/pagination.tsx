"use client"

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    paginate: (pageNumber: number) => void;
}

export default function Pagination({ currentPage, totalPages, paginate }: PaginationProps) {
    const pageNumbers = []

    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
    }

    return (
        <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
                <PaginationArrow
                    direction="prev"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                />

                {startPage > 1 && (
                    <>
                        <PaginationNumber number={1} onClick={() => paginate(1)} />
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pageNumbers.map(number => (
                    <PaginationNumber
                        key={number}
                        number={number}
                        active={number === currentPage}
                        onClick={() => paginate(number)}
                    />
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2">...</span>}
                        <PaginationNumber
                            number={totalPages}
                            onClick={() => paginate(totalPages)}
                        />
                    </>
                )}

                <PaginationArrow
                    direction="next"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                />
            </div>
        </div>
    )
}

type PaginationNumberProps = {
    number: number;
    active: boolean;
    onClick: () => void;
}

function PaginationNumber({ number, active, onClick }: PaginationNumberProps) {
    return (
        <button
            onClick={onClick}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
                active ? "bg-[#ff8a3c] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
            {number}
        </button>
    )
}

type PaginationArrowProps = {
    direction: "prev" | "next";
    onClick: () => void;
    disabled: boolean;
}

function PaginationArrow({ direction, onClick, disabled }: PaginationArrowProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-white ${
                disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
            }`}
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
        </button>
    )
}
