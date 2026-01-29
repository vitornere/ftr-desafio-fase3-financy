import { CircleArrowDown, CircleArrowUp, PiggyBank, ShoppingCart } from "lucide-react"

import { TransactionType } from "@/graphql/graphql"
import { formatBRLFromCents } from "@/lib/money"

interface CategoryInfo {
  title: string
  color: string
}

interface RecentTransactionRowProps {
  description: string
  date: string
  amountCents: number
  type: TransactionType
  category?: CategoryInfo | null
}

/**
 * Format ISO date to dd/MM/yy format for display.
 */
function formatDateShort(isoDate: string): string {
  const date = new Date(isoDate)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date)
}

/**
 * Convert hex color to rgba with alpha.
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "")
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * RecentTransactionRow - Single row in the recent transactions list.
 * Displays icon tile, description, date, category tag, and amount.
 *
 * Icons are determined by transaction type:
 * - Income: PiggyBank (green)
 * - Expense: ShoppingCart (red)
 */
function RecentTransactionRow({
  description,
  date,
  amountCents,
  type,
  category,
}: RecentTransactionRowProps) {
  const isIncome = type === TransactionType.Income

  // Derive colors from category or use type defaults
  const tileColor = category?.color ?? (isIncome ? "#16A34A" : "#DC2626")
  const tileBg = hexToRgba(tileColor, 0.15)

  // Format amount with sign
  const formattedAmount = formatBRLFromCents(amountCents)
  const amountPrefix = isIncome ? "+ " : "- "

  return (
    <div className="flex min-h-[80px] items-center gap-4 border-b border-border px-6 py-4 last:border-b-0">
      {/* Icon Tile - uses fixed icons based on transaction type */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: tileBg }}
      >
        {isIncome ? (
          <PiggyBank className="h-4 w-4" style={{ color: tileColor }} />
        ) : (
          <ShoppingCart className="h-4 w-4" style={{ color: tileColor }} />
        )}
      </div>

      {/* Description & Date */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-base font-medium leading-6 text-[color:var(--gray-800)]">
          {description}
        </span>
        <span className="text-sm leading-5 text-[color:var(--gray-600)]">
          {formatDateShort(date)}
        </span>
      </div>

      {/* Category Tag */}
      {category && (
        <div
          className="hidden shrink-0 items-center justify-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap sm:inline-flex"
          style={{
            backgroundColor: hexToRgba(category.color, 0.15),
            color: category.color,
          }}
        >
          {category.title}
        </div>
      )}

      {/* Amount & Arrow */}
      <div className="flex shrink-0 items-center justify-end gap-2">
        <span className="text-sm font-semibold tabular-nums text-[color:var(--gray-800)]">
          {amountPrefix}{formattedAmount}
        </span>
        {isIncome ? (
          <CircleArrowUp className="h-4 w-4 text-primary" />
        ) : (
          <CircleArrowDown className="h-4 w-4 text-[color:var(--danger)]" />
        )}
      </div>
    </div>
  )
}

/**
 * RecentTransactionRowSkeleton - Loading skeleton for transaction row.
 */
function RecentTransactionRowSkeleton() {
  return (
    <div className="flex min-h-[80px] items-center gap-4 border-b border-border px-6 py-4 last:border-b-0">
      {/* Icon Tile Skeleton */}
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-muted" />

      {/* Description & Date Skeleton */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>

      {/* Category Tag Skeleton */}
      <div className="hidden h-7 w-24 shrink-0 animate-pulse rounded-full bg-muted sm:block" />

      {/* Amount Skeleton */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  )
}

export { RecentTransactionRow, RecentTransactionRowSkeleton }
