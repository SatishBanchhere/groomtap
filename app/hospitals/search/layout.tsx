import { Suspense } from "react"

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
        <Suspense>
            {children}
        </Suspense>
    </div>
  )
}
