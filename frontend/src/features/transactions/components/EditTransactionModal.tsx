import * as React from "react"
import { Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateInput } from "@/components/form/DateInput"
import { MoneyInput } from "@/components/form/MoneyInput"
import { useCategories } from "@/features/categories/hooks"
import { TransactionType as GqlTransactionType } from "@/graphql/graphql"

import { useUpdateTransaction } from "../hooks"
import { TransactionTypeToggle, type TransactionType } from "./TransactionTypeToggle"

export interface TransactionData {
  id: string
  description: string
  date: string
  amountCents: number
  type: GqlTransactionType
  categoryId?: string | null
}

interface EditTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: TransactionData | null
}

/**
 * Convert ISO date to YYYY-MM-DD format for date input.
 */
function isoToDateString(isoDate: string): string {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * EditTransactionModal - Modal for editing an existing transaction.
 * Features:
 * - Transaction type toggle (expense/income)
 * - Description, date, amount inputs
 * - Category select
 * - Form validation
 * - Accessible (ESC to close, focus trap)
 */
function EditTransactionModal({ open, onOpenChange, transaction }: EditTransactionModalProps) {
  // Form state
  const [type, setType] = React.useState<TransactionType>("expense")
  const [description, setDescription] = React.useState("")
  const [date, setDate] = React.useState<string | null>(null)
  const [amountCents, setAmountCents] = React.useState<number | null>(null)
  const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined)

  // Fetch categories from API
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories()

  // Update transaction mutation
  const updateTransaction = useUpdateTransaction()
  const isSubmitting = updateTransaction.isPending

  // Use API categories only (no mock fallback)
  const categories = React.useMemo(() => {
    const items = categoriesData?.categories?.items
    if (items && items.length > 0) {
      return items.map((cat) => ({
        id: cat.id,
        title: cat.title,
        color: cat.color,
      }))
    }
    return []
  }, [categoriesData])

  const hasCategories = categories.length > 0

  // Populate form when transaction changes
  React.useEffect(() => {
    if (transaction && open) {
      setType(transaction.type === GqlTransactionType.Income ? "income" : "expense")
      setDescription(transaction.description)
      setDate(isoToDateString(transaction.date))
      setAmountCents(transaction.amountCents)
      setCategoryId(transaction.categoryId ?? undefined)
    }
  }, [transaction, open])

  // Validation
  const isValid = React.useMemo(() => {
    return (
      type &&
      description.trim().length >= 2 &&
      date !== null &&
      amountCents !== null &&
      amountCents > 0
    )
  }, [type, description, date, amountCents])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid || isSubmitting || !transaction) return

    // Map local type to GraphQL enum
    const gqlType = type === "expense" ? GqlTransactionType.Expense : GqlTransactionType.Income

    // Convert date from YYYY-MM-DD to ISO string
    // The API expects DateTimeISO format
    const isoDate = new Date(`${date}T12:00:00`).toISOString()

    try {
      await updateTransaction.mutateAsync({
        id: transaction.id,
        type: gqlType,
        description: description.trim(),
        date: isoDate,
        amountCents: amountCents!,
        categoryId: categoryId || null,
      })

      // Close modal on success (toast is handled by the hook)
      onOpenChange(false)
    } catch {
      // Error toast is handled by the hook
      // Keep modal open for user to retry
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/20" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogContent
            showCloseButton={false}
            className="flex w-[calc(100vw-32px)] max-w-[448px] flex-col gap-6 rounded-xl border border-border bg-background p-6 max-h-[calc(100vh-32px)] overflow-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold leading-none text-foreground">
                  Editar transação
                </h2>
                <p className="text-sm text-muted-foreground">
                  Atualize os dados da transação
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                aria-label="Fechar"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Transaction Type Toggle */}
              <TransactionTypeToggle
                value={type}
                onChange={setType}
                disabled={isSubmitting}
              />

              {/* Description */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Input
                  id="edit-description"
                  type="text"
                  placeholder="Ex. Almoço no restaurante"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 rounded-lg"
                />
              </div>

              {/* Date and Amount - 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-date">Data</Label>
                  <DateInput
                    id="edit-date"
                    value={date}
                    onChange={setDate}
                    disabled={isSubmitting}
                    className="h-12 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="edit-amount">Valor</Label>
                  <MoneyInput
                    id="edit-amount"
                    value={amountCents}
                    onChange={setAmountCents}
                    placeholder="0,00"
                    disabled={isSubmitting}
                    className="h-12 rounded-lg"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  disabled={isSubmitting || isLoadingCategories || !hasCategories}
                >
                  <SelectTrigger
                    id="edit-category"
                    className="h-12 w-full rounded-lg"
                  >
                    <SelectValue
                      placeholder={
                        isLoadingCategories
                          ? "Carregando..."
                          : hasCategories
                            ? "Selecione"
                            : "Sem categorias"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="h-12 w-full rounded-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </form>
          </DialogContent>
        </div>
      </DialogPortal>
    </Dialog>
  )
}

export { EditTransactionModal }
export type { EditTransactionModalProps }
