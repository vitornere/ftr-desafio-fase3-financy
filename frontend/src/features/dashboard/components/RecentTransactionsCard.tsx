import { Link } from "@tanstack/react-router"
import { ChevronRight, Plus, Receipt } from "lucide-react"

import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { TransactionType } from "@/graphql/graphql"

import { useRecentTransactions } from "../hooks"
import {
  RecentTransactionRow,
  RecentTransactionRowSkeleton,
} from "./RecentTransactionRow"

interface RecentTransactionsCardProps {
  month: number
  year: number
}

/**
 * RecentTransactionsCard - Card displaying the 5 most recent transactions.
 * Includes header with "Ver todas" link, transaction list, and footer CTA.
 */
function RecentTransactionsCard({ month, year }: RecentTransactionsCardProps) {
  const { data, isLoading, isError } = useRecentTransactions(month, year)

  const transactions = data?.transactions?.items ?? []
  const hasTransactions = transactions.length > 0

  return (
    <Card className="flex flex-col gap-0 overflow-hidden rounded-xl border-border p-0 shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border py-5 pl-6 pr-3">
        <span className="text-xs font-medium uppercase tracking-[0.6px] text-[color:var(--gray-500)]">
          Transações recentes
        </span>
        <Link
          to="/app/transactions"
          search={{ month, year }}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Ver todas
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Body */}
      <div className="flex flex-col">
        {isLoading ? (
          // Loading skeletons
          <>
            <RecentTransactionRowSkeleton />
            <RecentTransactionRowSkeleton />
            <RecentTransactionRowSkeleton />
            <RecentTransactionRowSkeleton />
            <RecentTransactionRowSkeleton />
          </>
        ) : isError || !hasTransactions ? (
          // Empty state
          <div className="px-6 py-8">
            <EmptyState
              icon={<Receipt className="h-12 w-12 text-muted-foreground" />}
              title="Sem transações neste mês"
              description="Adicione sua primeira transação para começar a acompanhar suas finanças."
              className="border-0 bg-transparent p-0"
            />
          </div>
        ) : (
          // Transaction list - Note: category is not available in current query
          transactions.map((tx) => (
            <RecentTransactionRow
              key={tx.id}
              description={tx.description}
              date={tx.date}
              amountCents={tx.amountCents}
              type={tx.type as TransactionType}
              category={null}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center border-t border-border px-6 py-5">
        <Link
          to="/app/transactions"
          search={{ month, year }}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="h-5 w-5" />
          Nova transação
        </Link>
      </div>
    </Card>
  )
}

export { RecentTransactionsCard }
