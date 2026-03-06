import { cn } from "@/lib/utils"

type Variant = "blue" | "green" | "orange" | "gray" | "gold" | "purple"

const variantClasses: Record<Variant, string> = {
  blue:   "bg-blue-50 text-blue-700 border-blue-200",
  green:  "bg-green-50 text-green-700 border-green-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  gray:   "bg-gray-100 text-gray-600 border-gray-200",
  gold:   "bg-amber-50 text-amber-700 border-amber-300",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
}

export default function Badge({
  children,
  variant = "gray",
  className,
}: {
  children: React.ReactNode
  variant?: Variant
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
