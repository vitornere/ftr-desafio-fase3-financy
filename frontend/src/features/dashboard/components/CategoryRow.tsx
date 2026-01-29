import { formatBRLFromCents } from "@/lib/money"

interface CategoryRowProps {
  title: string
  color: string
  itemsCount: number
  totalAmountCents: number
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
 * Pluralize item count for Portuguese.
 */
function pluralizeItem(count: number): string {
  return count === 1 ? "item" : "itens"
}

/**
 * CategoryRow - Single row in the categories summary list.
 * Displays category pill, items count, and total amount.
 */
function CategoryRow({
  title,
  color,
  itemsCount,
  totalAmountCents,
}: CategoryRowProps) {
  // Fallback for categories without a valid color
  const hasValidColor = color && color.startsWith("#") && color.length >= 7
  const tagBg = hasValidColor
    ? hexToRgba(color, 0.15)
    : "rgba(107, 114, 128, 0.15)"
  const tagColor = hasValidColor ? color : "var(--gray-700)"

  return (
    <div className="flex h-7 items-center gap-1">
      {/* Category Pill */}
      <div
        className="inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap"
        style={{ backgroundColor: tagBg, color: tagColor }}
      >
        {title}
      </div>

      {/* Items Count - flex grow, right aligned */}
      <div className="flex-1 text-right text-sm text-[color:var(--gray-600)]">
        {itemsCount} {pluralizeItem(itemsCount)}
      </div>

      {/* Total Amount - fixed width, right aligned */}
      <div className="w-[88px] text-right text-sm font-semibold tabular-nums text-[color:var(--gray-800)]">
        {formatBRLFromCents(totalAmountCents)}
      </div>
    </div>
  )
}

/**
 * CategoryRowSkeleton - Loading skeleton for category row.
 */
function CategoryRowSkeleton() {
  return (
    <div className="flex h-7 items-center gap-1">
      {/* Category Pill Skeleton */}
      <div className="h-7 w-24 shrink-0 animate-pulse rounded-full bg-muted" />

      {/* Items Count Skeleton */}
      <div className="flex flex-1 justify-end">
        <div className="h-4 w-14 animate-pulse rounded bg-muted" />
      </div>

      {/* Amount Skeleton */}
      <div className="w-[88px] text-right">
        <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export { CategoryRow, CategoryRowSkeleton }
