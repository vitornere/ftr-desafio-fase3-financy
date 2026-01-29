import { Wallet, CircleArrowUp, CircleArrowDown } from "lucide-react"

import { useDashboardSummary } from "@/features/summary/hooks"
import { formatBRLFromCents } from "@/lib/money"

import { SummaryCard, SummaryCardSkeleton } from "./SummaryCard"

interface SummaryCardsProps {
  month: number
  year: number
}

/**
 * SummaryCards - Displays the 3 summary cards (balance, income, expenses).
 * Fetches data from the dashboard summary API.
 *
 * Layout:
 * - Mobile: 1 column stacked
 * - Tablet (sm): 2 columns
 * - Desktop (lg): 3 columns side by side
 */
function SummaryCards({ month, year }: SummaryCardsProps) {
  const { data, isLoading, isError } = useDashboardSummary(month, year)

  // Loading state: show skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>
    )
  }

  // Extract values (fallback to 0 on error or missing data)
  const summary = data?.dashboardSummary
  const balanceCents = summary?.balanceCents ?? 0
  const incomeCents = summary?.incomeMonthCents ?? 0
  const expenseCents = summary?.expenseMonthCents ?? 0

  // If error, still show cards with zero values (error toast is handled by hooks)
  if (isError && !summary) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={<Wallet className="h-5 w-5 text-[color:var(--purple-base)]" />}
          label="Saldo total"
          value={formatBRLFromCents(0)}
        />
        <SummaryCard
          icon={<CircleArrowUp className="h-5 w-5 text-primary" />}
          label="Receitas do mês"
          value={formatBRLFromCents(0)}
        />
        <SummaryCard
          icon={<CircleArrowDown className="h-5 w-5 text-destructive" />}
          label="Despesas do mês"
          value={formatBRLFromCents(0)}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Card 1: Saldo total */}
      <SummaryCard
        icon={<Wallet className="h-5 w-5 text-[color:var(--purple-base)]" />}
        label="Saldo total"
        value={formatBRLFromCents(balanceCents)}
      />

      {/* Card 2: Receitas do mês */}
      <SummaryCard
        icon={<CircleArrowUp className="h-5 w-5 text-primary" />}
        label="Receitas do mês"
        value={formatBRLFromCents(incomeCents)}
      />

      {/* Card 3: Despesas do mês */}
      <SummaryCard
        icon={<CircleArrowDown className="h-5 w-5 text-destructive" />}
        label="Despesas do mês"
        value={formatBRLFromCents(expenseCents)}
      />
    </div>
  )
}

export { SummaryCards }
