import * as React from "react"
import { Link } from "@tanstack/react-router"
import { ChevronRight, Plus, Receipt } from "lucide-react"

import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { NewTransactionModal } from "@/features/transactions/components"
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
 * Fallback category for transactions without a category.
 * Uses neutral gray color.
 */
const UNCATEGORIZED_CATEGORY = {
  title: "Não categorizado",
  color: "#9CA3AF", // Gray-400 - neutral color
} as const

/**
 * RecentTransactionsCard - Card displaying the 5 most recent transactions.
 * Includes header with "Ver todas" link, transaction list, and footer CTA.
 */
function RecentTransactionsCard({ month, year }: RecentTransactionsCardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { data, isLoading, isError } = useRecentTransactions(month, year)

  const transactions = data?.transactions?.items ?? []
  const hasTransactions = transactions.length > 0

  return (
    <>
      <NewTransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <Card className="flex flex-col gap-0 overflow-hidden rounded-xl border-border p-0 shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border py-5 pl-6 pr-3">
          <span className="text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
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
            // Transaction list with category from API or fallback
            transactions.map((tx) => (
              <RecentTransactionRow
                key={tx.id}
                description={tx.description}
                date={tx.date}
                amountCents={tx.amountCents}
                type={tx.type as TransactionType}
                category={
                  tx.category
                    ? { title: tx.category.title, color: tx.category.color }
                    : UNCATEGORIZED_CATEGORY
                }
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center border-t border-border px-6 py-5">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-5 w-5" />
            Nova transação
          </button>
        </div>
      </Card>
    </>
  )
}

export { RecentTransactionsCard }
