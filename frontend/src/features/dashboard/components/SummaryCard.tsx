import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}

/**
 * SummaryCard - Displays a metric card with icon, label and formatted value.
 * Used in the dashboard to show balance, income, and expenses.
 */
function SummaryCard({ icon, label, value, className }: SummaryCardProps) {
  return (
    <Card className={cn("gap-0 rounded-xl border-border p-6 shadow-none", className)}>
      {/* Header: Icon + Label */}
      <div className="flex items-center gap-3">
        <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
          {label}
        </span>
      </div>

      {/* Value */}
      <p className="mt-4 text-[28px] font-bold leading-8 text-(--gray-800)">
        {value}
      </p>
    </Card>
  )
}

/**
 * SummaryCardSkeleton - Loading state for SummaryCard with pulse animation.
 */
function SummaryCardSkeleton() {
  return (
    <Card className="gap-0 rounded-xl border-border p-6 shadow-none">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-4 h-8 w-40 animate-pulse rounded bg-muted" />
    </Card>
  )
}

export { SummaryCard, SummaryCardSkeleton }
