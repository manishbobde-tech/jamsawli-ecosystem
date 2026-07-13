import { cn } from "@/lib/utils"

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  align?: "left" | "center"
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  align = "left",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8",
        align === "center" && "text-center sm:flex-col sm:items-center",
        className
      )}
    >
      <div className={cn("min-w-0 space-y-1.5", align === "center" && "max-w-2xl")}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-saffron-600">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-sacred-maroon text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-stone-500 leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex flex-wrap gap-2">{action}</div>}
    </div>
  )
}
