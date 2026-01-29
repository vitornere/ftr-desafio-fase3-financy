import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  CarFront,
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Coffee,
  CreditCard,
  Dumbbell,
  Film,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Briefcase,
  Music,
  PiggyBank,
  Plane,
  Plus,
  Receipt,
  Search,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sparkles,
  SquarePen,
  Tag,
  Trash2,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PaginationButton,
  PaginationEllipsis,
} from "@/components/ui/pagination-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/features/categories/hooks"
import {
  EditTransactionModal,
  NewTransactionModal,
  type TransactionData,
} from "@/features/transactions/components"
import { useDeleteTransaction, useTransactions } from "@/features/transactions/hooks"
import { TransactionType } from "@/graphql/graphql"
import { formatBRLFromCents } from "@/lib/money"
import { cn } from "@/lib/utils"

// =============================================================================
// Route Configuration
// =============================================================================

interface TransactionsSearchParams {
  q?: string
  type?: "all" | "income" | "expense"
  categoryId?: string
  month: number
  year: number
  page: number
  perPage: number
}

function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

function getCurrentYear(): number {
  return new Date().getFullYear()
}

export const Route = createFileRoute("/app/transactions")({
  validateSearch: (search: Record<string, unknown>): TransactionsSearchParams => {
    const month = Number(search.month)
    const year = Number(search.year)
    const page = Number(search.page)
    const perPage = Number(search.perPage)

    return {
      q: typeof search.q === "string" && search.q.trim() ? search.q.trim() : undefined,
      type: search.type === "income" || search.type === "expense" ? search.type : "all",
      categoryId: typeof search.categoryId === "string" && search.categoryId !== "all" ? search.categoryId : undefined,
      month: !isNaN(month) && month >= 1 && month <= 12 ? month : getCurrentMonth(),
      year: !isNaN(year) && year >= 2000 && year <= 2100 ? year : getCurrentYear(),
      page: !isNaN(page) && page >= 1 ? page : 1,
      perPage: !isNaN(perPage) && [10, 20, 50].includes(perPage) ? perPage : 10,
    }
  },
  component: TransactionsPage,
})

// =============================================================================
// Icon Mapper
// =============================================================================

const categoryIconMap: Record<string, LucideIcon> = {
  // Food & Drinks
  food: Utensils,
  utensils: Utensils,
  restaurant: Utensils,
  alimentacao: Utensils,
  coffee: Coffee,
  cafe: Coffee,

  // Transport
  transport: CarFront,
  car: CarFront,
  transporte: CarFront,
  carro: CarFront,

  // Shopping
  shopping: ShoppingCart,
  market: ShoppingCart,
  mercado: ShoppingCart,
  compras: ShoppingCart,

  // Work
  work: Briefcase,
  trabalho: Briefcase,
  business: Briefcase,
  negocios: Briefcase,

  // Home
  home: Home,
  casa: Home,
  moradia: Home,

  // Health
  health: Heart,
  saude: Heart,
  medical: Heart,

  // Entertainment
  entertainment: Gamepad2,
  games: Gamepad2,
  jogos: Gamepad2,
  lazer: Gamepad2,
  music: Music,
  musica: Music,
  movie: Film,
  filme: Film,

  // Education
  education: GraduationCap,
  educacao: GraduationCap,
  study: GraduationCap,
  estudo: GraduationCap,

  // Travel
  travel: Plane,
  viagem: Plane,

  // Gifts
  gift: Gift,
  presente: Gift,

  // Personal
  personal: Sparkles,
  pessoal: Sparkles,

  // Utilities
  utilities: Zap,
  contas: Zap,
  bills: Zap,

  // Fitness
  fitness: Dumbbell,
  gym: Dumbbell,
  academia: Dumbbell,
  esporte: Dumbbell,

  // Clothing
  clothing: Shirt,
  roupa: Shirt,
  vestuario: Shirt,

  // Tech
  tech: Smartphone,
  tecnologia: Smartphone,
  electronics: Smartphone,

  // Finance
  finance: CreditCard,
  financeiro: CreditCard,
  bank: CreditCard,
  banco: CreditCard,
  savings: PiggyBank,
  poupanca: PiggyBank,
  investment: TrendingUp,
  investimento: TrendingUp,
  salary: Wallet,
  salario: Wallet,

  // Generic
  tag: Tag,
  category: Tag,
  categoria: Tag,
  other: Tag,
  outros: Tag,
}

/**
 * Get the icon component for a category based on its icon string.
 * Falls back to Tag icon if no match is found.
 */
function getCategoryIcon(iconKey: string | null | undefined): LucideIcon {
  if (!iconKey) return Tag

  // Normalize: lowercase and remove special chars
  const normalized = iconKey.toLowerCase().trim()

  return categoryIconMap[normalized] ?? Tag
}

/**
 * Render a category icon component.
 * Uses createElement to avoid the react-hooks/static-components lint rule.
 */
function CategoryIcon({
  iconKey,
  className,
  style,
}: {
  iconKey: string | null | undefined
  className?: string
  style?: React.CSSProperties
}): React.ReactElement {
  return React.createElement(getCategoryIcon(iconKey), { className, style })
}

// =============================================================================
// Color Helpers
// =============================================================================

/**
 * Convert hex color to rgba with alpha.
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "")
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    // Return fallback gray if hex is invalid
    return `rgba(107, 114, 128, ${alpha})`
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Check if a color string is a valid hex color.
 */
function isValidHexColor(color: string | null | undefined): boolean {
  if (!color) return false
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

/**
 * Get background and text colors for a category.
 */
function getCategoryColors(color: string | null | undefined) {
  const hasValidColor = isValidHexColor(color)

  return {
    tileBg: hasValidColor
      ? hexToRgba(color!, 0.15)
      : "rgba(107, 114, 128, 0.15)",
    tileColor: hasValidColor ? color! : "rgb(55, 65, 81)",
    pillBg: hasValidColor
      ? hexToRgba(color!, 0.15)
      : "rgba(107, 114, 128, 0.15)",
    pillColor: hasValidColor ? color! : "rgb(55, 65, 81)",
  }
}

// =============================================================================
// Date Helpers
// =============================================================================

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
 * Get month name in Portuguese.
 */
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

function getMonthName(month: number): string {
  return monthNames[month - 1] ?? ""
}

/**
 * Generate period options for the select dropdown.
 * Returns last 24 months from current date.
 */
function generatePeriodOptions(): Array<{ value: string; label: string; month: number; year: number }> {
  const options: Array<{ value: string; label: string; month: number; year: number }> = []
  const now = new Date()

  for (let i = 0; i < 24; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    options.push({
      value: `${month}-${year}`,
      label: `${getMonthName(month)} / ${year}`,
      month,
      year,
    })
  }

  return options
}

// =============================================================================
// Custom Hook: useDebounce
// =============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// =============================================================================
// Main Component
// =============================================================================

function TransactionsPage() {
  const navigate = Route.useNavigate()
  const { q, type, categoryId, month, year, page, perPage } = Route.useSearch()

  // Local state for search input (debounced)
  const [searchInput, setSearchInput] = React.useState(q ?? "")
  const debouncedSearch = useDebounce(searchInput, 300)

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editingTransaction, setEditingTransaction] = React.useState<TransactionData | null>(null)

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [deletingTransactionId, setDeletingTransactionId] = React.useState<string | null>(null)

  // Categories for filter dropdown
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories()
  const categories = categoriesData?.categories?.items ?? []

  // Build filters for the API
  const filters = React.useMemo(() => {
    return {
      month,
      year,
      search: debouncedSearch || undefined,
      type: type === "income" ? TransactionType.Income : type === "expense" ? TransactionType.Expense : undefined,
      categoryId: categoryId || undefined,
    }
  }, [month, year, debouncedSearch, type, categoryId])

  // Fetch transactions
  const {
    data: transactionsData,
    isLoading,
    isError,
    refetch,
  } = useTransactions(filters, { page, perPage })

  const transactions = transactionsData?.transactions?.items ?? []
  const total = transactionsData?.transactions?.total ?? 0
  const totalPages = Math.ceil(total / perPage)

  // Delete mutation
  const deleteTransaction = useDeleteTransaction()

  // Update URL when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== (q ?? "")) {
      navigate({
        search: (prev) => ({
          ...prev,
          q: debouncedSearch || undefined,
          page: 1, // Reset page on search change
        }),
        replace: true,
      })
    }
  }, [debouncedSearch, q, navigate])

  // Period options
  const periodOptions = React.useMemo(() => generatePeriodOptions(), [])
  const currentPeriodValue = `${month}-${year}`

  // Handlers
  const handleTypeChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        type: value as "all" | "income" | "expense",
        page: 1,
      }),
      replace: true,
    })
  }

  const handleCategoryChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        categoryId: value === "all" ? undefined : value,
        page: 1,
      }),
      replace: true,
    })
  }

  const handlePeriodChange = (value: string) => {
    const [monthStr, yearStr] = value.split("-")
    navigate({
      search: (prev) => ({
        ...prev,
        month: Number(monthStr),
        year: Number(yearStr),
        page: 1,
      }),
      replace: true,
    })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      navigate({
        search: (prev) => ({
          ...prev,
          page: newPage,
        }),
        replace: true,
      })
    }
  }

  const handleEditClick = (tx: TransactionItem) => {
    setEditingTransaction({
      id: tx.id,
      description: tx.description,
      date: tx.date,
      amountCents: tx.amountCents,
      type: tx.type,
      categoryId: tx.categoryId ?? null,
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeletingTransactionId(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingTransactionId) return

    try {
      await deleteTransaction.mutateAsync(deletingTransactionId)
      setDeleteDialogOpen(false)
      setDeletingTransactionId(null)
    } catch {
      // Error is handled by the hook
    }
  }

  // Pagination info
  const startItem = total === 0 ? 0 : (page - 1) * perPage + 1
  const endItem = Math.min(page * perPage, total)

  return (
    <div className="min-h-[800px]">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-12 2xl:px-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transações</h1>
              <p className="mt-1 text-base text-muted-foreground">
                Gerencie todas as suas transações financeiras
              </p>
            </div>
            <Button className="shrink-0" onClick={() => setIsNewModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Nova transação
            </Button>
          </div>

          {/* Filters Card */}
          <Card className="rounded-xl border-border px-6 pb-6 pt-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="search" className="text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                  Buscar
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Buscar por descrição"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="h-11 pl-9"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="type" className="text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                  Tipo
                </Label>
                <Select value={type ?? "all"} onValueChange={handleTypeChange}>
                  <SelectTrigger id="type" className="h-11 w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Entrada</SelectItem>
                    <SelectItem value="expense">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                  Categoria
                </Label>
                <Select
                  value={categoryId ?? "all"}
                  onValueChange={handleCategoryChange}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger id="category" className="h-11 w-full">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Period */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="period" className="text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                  Período
                </Label>
                <Select value={currentPeriodValue} onValueChange={handlePeriodChange}>
                  <SelectTrigger id="period" className="h-11 w-full">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Table */}
          <Card className="overflow-hidden rounded-xl border-border p-0">
            {/* Table Header */}
            <div className="hidden border-b border-border px-6 py-4 lg:flex">
              <div className="flex-1 text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                Descrição
              </div>
              <div className="w-[112px] text-center text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                Data
              </div>
              <div className="w-[160px] text-center text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                Categoria
              </div>
              <div className="w-[120px] text-center text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                Tipo
              </div>
              <div className="w-[140px] text-right text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                Valor
              </div>
              <div className="w-[100px] text-center text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
                Ações
              </div>
            </div>

            {/* Table Body */}
            {isLoading ? (
              // Loading state
              <div className="divide-y divide-border">
                {Array.from({ length: perPage }).map((_, i) => (
                  <TransactionRowSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              // Error state
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <p className="text-base font-medium text-foreground">
                  Não foi possível carregar transações.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Verifique sua conexão e tente novamente.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : transactions.length === 0 ? (
              // Empty state
              <div className="px-6 py-12">
                <EmptyState
                  icon={<Receipt className="h-12 w-12 text-muted-foreground" />}
                  title="Sem transações neste período"
                  description="Clique em 'Nova transação' para adicionar a primeira."
                  className="border-0 bg-transparent p-0"
                />
              </div>
            ) : (
              // Transactions list
              <div className="divide-y divide-border">
                {transactions.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    transaction={tx}
                    onEdit={() => handleEditClick(tx)}
                    onDelete={() => handleDeleteClick(tx.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            {!isError && total > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-6 py-4 sm:flex-row">
                <div className="text-sm text-muted-foreground">
                  {startItem} a {endItem} | {total} resultados
                </div>
                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <PaginationButton
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </PaginationButton>

                  {/* Page numbers */}
                  <PaginationNumbers
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />

                  {/* Next */}
                  <PaginationButton
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Próxima página"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </PaginationButton>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* New Transaction Modal */}
      <NewTransactionModal open={isNewModalOpen} onOpenChange={setIsNewModalOpen} />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        transaction={editingTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteTransaction.isPending}
      />
    </div>
  )
}

// =============================================================================
// Transaction Row
// =============================================================================

type TransactionItem = NonNullable<
  NonNullable<ReturnType<typeof useTransactions>["data"]>["transactions"]
>["items"][number]

interface TransactionRowProps {
  transaction: TransactionItem
  onEdit: () => void
  onDelete: () => void
}

function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === TransactionType.Income
  const category = transaction.category

  // Get category colors
  const colors = getCategoryColors(category?.color)

  // Format amount
  const formattedAmount = formatBRLFromCents(transaction.amountCents)
  const amountPrefix = isIncome ? "+ " : "- "
  const amountColor = isIncome ? "text-(--success)" : "text-(--danger)"

  return (
    <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:gap-0">
      {/* Description cell (icon + text) */}
      <div className="flex flex-1 items-center gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: colors.tileBg }}
        >
          <CategoryIcon
            iconKey={category?.icon}
            className="h-4 w-4"
            style={{ color: colors.tileColor }}
          />
        </div>
        <span className="truncate text-base font-medium text-foreground">
          {transaction.description}
        </span>
      </div>

      {/* Mobile layout: Data, Category, Type, Value in a row */}
      <div className="flex flex-wrap items-center gap-3 lg:hidden">
        <span className="text-sm text-muted-foreground">
          {formatDateShort(transaction.date)}
        </span>
        {category && (
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            style={{ backgroundColor: colors.pillBg, color: colors.pillColor }}
          >
            {category.title}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          {isIncome ? (
            <CircleArrowUp className="h-4 w-4 text-(--success)" />
          ) : (
            <CircleArrowDown className="h-4 w-4 text-(--danger)" />
          )}
          <span className={cn("text-sm", isIncome ? "text-(--success)" : "text-(--danger)")}>
            {isIncome ? "Entrada" : "Saída"}
          </span>
        </div>
        <span className={cn("text-sm font-semibold tabular-nums", amountColor)}>
          {amountPrefix}{formattedAmount}
        </span>
      </div>

      {/* Desktop layout */}
      {/* Date */}
      <div className="hidden w-[112px] justify-center lg:flex">
        <span className="text-sm text-muted-foreground">
          {formatDateShort(transaction.date)}
        </span>
      </div>

      {/* Category */}
      <div className="hidden w-[160px] justify-center lg:flex">
        {category ? (
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            style={{ backgroundColor: colors.pillBg, color: colors.pillColor }}
          >
            {category.title}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </div>

      {/* Type */}
      <div className="hidden w-[120px] justify-center lg:flex">
        <div className="flex items-center gap-1.5">
          {isIncome ? (
            <CircleArrowUp className="h-4 w-4 text-(--success)" />
          ) : (
            <CircleArrowDown className="h-4 w-4 text-(--danger)" />
          )}
          <span className={cn("text-sm", isIncome ? "text-(--success)" : "text-(--danger)")}>
            {isIncome ? "Entrada" : "Saída"}
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="hidden w-[140px] justify-end lg:flex">
        <span className={cn("text-sm font-semibold tabular-nums", amountColor)}>
          {amountPrefix}{formattedAmount}
        </span>
      </div>

      {/* Actions */}
      <div className="flex w-[100px] justify-center gap-1">
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="Deletar transação"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="Editar transação"
          onClick={onEdit}
          className="text-muted-foreground hover:text-foreground"
        >
          <SquarePen className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// Transaction Row Skeleton
// =============================================================================

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      {/* Icon */}
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-muted" />

      {/* Description */}
      <div className="flex-1">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      </div>

      {/* Date */}
      <div className="hidden w-[112px] justify-center lg:flex">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>

      {/* Category */}
      <div className="hidden w-[160px] justify-center lg:flex">
        <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
      </div>

      {/* Type */}
      <div className="hidden w-[120px] justify-center lg:flex">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>

      {/* Value */}
      <div className="hidden w-[140px] justify-end lg:flex">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
      </div>

      {/* Actions */}
      <div className="flex w-[100px] justify-center gap-1">
        <div className="h-7 w-7 animate-pulse rounded-md bg-muted" />
        <div className="h-7 w-7 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}

// =============================================================================
// Pagination Numbers
// =============================================================================

interface PaginationNumbersProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function PaginationNumbers({ currentPage, totalPages, onPageChange }: PaginationNumbersProps) {
  // Generate page numbers to display
  const pages: (number | "ellipsis")[] = []

  if (totalPages <= 5) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show first, last, current, and neighbors
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "ellipsis", totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages)
    }
  }

  return (
    <>
      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <PaginationEllipsis key={`ellipsis-${idx}`} />
        ) : (
          <PaginationButton
            key={p}
            isActive={p === currentPage}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PaginationButton>
        )
      )}
    </>
  )
}

// =============================================================================
// Delete Confirm Dialog
// =============================================================================

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir transação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
