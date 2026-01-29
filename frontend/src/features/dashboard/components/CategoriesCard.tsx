import { Link } from "@tanstack/react-router"
import { ChevronRight, FolderOpen } from "lucide-react"

import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"

import { useCategoriesSummary } from "../hooks"
import { CategoryRow, CategoryRowSkeleton } from "./CategoryRow"

interface CategoriesCardProps {
  month: number
  year: number
}

/**
 * CategoriesCard - Card displaying top 5 categories by total amount.
 * Includes header with "Gerenciar" link and category summary rows.
 */
function CategoriesCard({ month, year }: CategoriesCardProps) {
  const { data, isLoading, isError } = useCategoriesSummary(month, year, 5)

  const categories = data?.categories ?? []
  const hasCategories = categories.length > 0

  return (
    <Card className="flex flex-col gap-0 overflow-hidden rounded-xl border-border p-0 shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <span className="text-xs font-medium uppercase tracking-[0.6px] text-[color:var(--gray-500)]">
          Categorias
        </span>
        <Link
          to="/app/categories"
          search={{ month, year }}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Gerenciar
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Body */}
      <div className="p-6">
        {isLoading ? (
          // Loading skeletons - 5 rows
          <div className="space-y-5">
            <CategoryRowSkeleton />
            <CategoryRowSkeleton />
            <CategoryRowSkeleton />
            <CategoryRowSkeleton />
            <CategoryRowSkeleton />
          </div>
        ) : isError ? (
          // Error state
          <div className="py-4 text-center text-sm text-muted-foreground">
            Não foi possível carregar categorias.
          </div>
        ) : !hasCategories ? (
          // Empty state
          <EmptyState
            icon={<FolderOpen className="h-12 w-12 text-muted-foreground" />}
            title="Sem categorias neste mês"
            description="Adicione transações com categorias para ver o resumo aqui."
            className="border-0 bg-transparent p-0"
          />
        ) : (
          // Category list
          <div className="space-y-5">
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                title={category.title}
                color={category.color}
                itemsCount={category.itemsCount}
                totalAmountCents={category.totalAmountCents}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export { CategoriesCard }
