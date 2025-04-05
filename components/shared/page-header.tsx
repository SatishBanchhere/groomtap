import Link from "next/link"

interface PageHeaderProps {
  title: string
  breadcrumb: string[]
}

export default function PageHeader({ title, breadcrumb }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <div className="text-sm">
          {breadcrumb.map((item, index) => (
            <span key={index}>
              {index > 0 && " > "}
              {index === breadcrumb.length - 1 ? (
                <span>{item}</span>
              ) : (
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-[#ff8a3c]"
                >
                  {item}
                </Link>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

