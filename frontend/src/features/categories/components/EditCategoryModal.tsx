import * as React from "react"
import {
  BriefcaseBusiness,
  CarFront,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Wrench,
  Utensils,
  PawPrint,
  House,
  Gift,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
  Loader2,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { useUpdateCategory } from "../hooks"

// =============================================================================
// Types
// =============================================================================

export interface CategoryData {
  id: string
  title: string
  description?: string | null
  icon: string
  color: string
}

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryData | null
}

// =============================================================================
// Icon Options
// =============================================================================

interface IconOption {
  key: string
  icon: LucideIcon
}

const ICON_OPTIONS: IconOption[] = [
  { key: "briefcase-business", icon: BriefcaseBusiness },
  { key: "car-front", icon: CarFront },
  { key: "heart-pulse", icon: HeartPulse },
  { key: "piggy-bank", icon: PiggyBank },
  { key: "shopping-cart", icon: ShoppingCart },
  { key: "ticket", icon: Ticket },
  { key: "toolbox", icon: Wrench },
  { key: "utensils", icon: Utensils },
  { key: "paw-print", icon: PawPrint },
  { key: "house", icon: House },
  { key: "gift", icon: Gift },
  { key: "dumbbell", icon: Dumbbell },
  { key: "book-open", icon: BookOpen },
  { key: "baggage-claim", icon: BaggageClaim },
  { key: "mailbox", icon: Mailbox },
  { key: "receipt-text", icon: ReceiptText },
]

/**
 * Find the best matching icon key from ICON_OPTIONS.
 * Handles cases where the stored icon doesn't exactly match available options.
 */
function findMatchingIconKey(storedIcon: string): string {
  const normalizedStored = storedIcon.toLowerCase().trim()

  // 1. Exact match
  const exactMatch = ICON_OPTIONS.find((opt) => opt.key === normalizedStored)
  if (exactMatch) return exactMatch.key

  // 2. Partial match - stored icon contains or is contained in option key
  const partialMatch = ICON_OPTIONS.find(
    (opt) =>
      opt.key.includes(normalizedStored) ||
      normalizedStored.includes(opt.key.split("-")[0])
  )
  if (partialMatch) return partialMatch.key

  // 3. Match by common aliases
  const iconAliases: Record<string, string> = {
    work: "briefcase-business",
    trabalho: "briefcase-business",
    business: "briefcase-business",
    briefcase: "briefcase-business",
    car: "car-front",
    transport: "car-front",
    transporte: "car-front",
    carro: "car-front",
    health: "heart-pulse",
    saude: "heart-pulse",
    medical: "heart-pulse",
    savings: "piggy-bank",
    poupanca: "piggy-bank",
    finance: "piggy-bank",
    shopping: "shopping-cart",
    market: "shopping-cart",
    mercado: "shopping-cart",
    compras: "shopping-cart",
    entertainment: "ticket",
    lazer: "ticket",
    tool: "toolbox",
    tools: "toolbox",
    food: "utensils",
    alimentacao: "utensils",
    restaurant: "utensils",
    pet: "paw-print",
    pets: "paw-print",
    home: "house",
    casa: "house",
    moradia: "house",
    presente: "gift",
    fitness: "dumbbell",
    gym: "dumbbell",
    academia: "dumbbell",
    esporte: "dumbbell",
    education: "book-open",
    educacao: "book-open",
    study: "book-open",
    estudo: "book-open",
    travel: "baggage-claim",
    viagem: "baggage-claim",
    bills: "receipt-text",
    contas: "receipt-text",
    utilities: "receipt-text",
  }

  const aliasMatch = iconAliases[normalizedStored]
  if (aliasMatch) return aliasMatch

  // 4. Default to first option
  return ICON_OPTIONS[0].key
}

// =============================================================================
// Color Options
// =============================================================================

const COLOR_OPTIONS = [
  "#16A34A", // green
  "#2563EB", // blue
  "#9333EA", // purple
  "#DB2777", // pink
  "#DC2626", // red
  "#EA580C", // orange
  "#CA8A04", // yellow
]

// =============================================================================
// Icon Picker Component
// =============================================================================

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function IconPicker({ value, onChange, disabled }: IconPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-(--gray-700)">
        Ícone
      </Label>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {ICON_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = value === option.key

          return (
            <button
              key={option.key}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.key)}
              className={cn(
                "flex h-[42px] w-[42px] items-center justify-center rounded-lg border transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                isSelected
                  ? "border-(--brand-base) bg-(--gray-100)"
                  : "border-(--gray-300) bg-background hover:bg-(--gray-100)"
              )}
              aria-label={option.key}
              aria-pressed={isSelected}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isSelected
                    ? "text-(--gray-600)"
                    : "text-(--gray-500)"
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Color Picker Component
// =============================================================================

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-(--gray-700)">
        Cor
      </Label>
      <div className="flex flex-wrap items-center gap-4">
        {COLOR_OPTIONS.map((color) => {
          const isSelected = value === color

          return (
            <button
              key={color}
              type="button"
              disabled={disabled}
              onClick={() => onChange(color)}
              className={cn(
                "flex h-[30px] w-[50px] items-center justify-center rounded-lg border p-1 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                isSelected
                  ? "border-(--brand-base) bg-(--gray-100)"
                  : "border-(--gray-300) bg-background hover:bg-(--gray-100)"
              )}
              aria-label={`Cor ${color}`}
              aria-pressed={isSelected}
            >
              <span
                className="h-[20px] w-[40px] rounded"
                style={{ backgroundColor: color }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

function EditCategoryModal({ open, onOpenChange, category }: EditCategoryModalProps) {
  // Form state
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [icon, setIcon] = React.useState(ICON_OPTIONS[0].key)
  const [color, setColor] = React.useState(COLOR_OPTIONS[0])

  // Update category mutation
  const updateCategory = useUpdateCategory()
  const isSubmitting = updateCategory.isPending

  // Validation
  const isValid = title.trim().length > 0

  // Populate form when category changes
  React.useEffect(() => {
    if (category && open) {
      setTitle(category.title)
      setDescription(category.description ?? "")
      // Find matching icon key (handles different naming conventions)
      setIcon(findMatchingIconKey(category.icon))
      // Use stored color if valid, otherwise default to first option
      const isValidColor = COLOR_OPTIONS.includes(category.color)
      setColor(isValidColor ? category.color : COLOR_OPTIONS[0])
    }
  }, [category, open])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid || isSubmitting || !category) return

    try {
      await updateCategory.mutateAsync({
        id: category.id,
        title: title.trim(),
        description: description.trim() || undefined,
        icon,
        color,
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
            className="flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[448px] flex-col gap-6 overflow-auto rounded-xl border border-border bg-background p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-(--gray-800)">
                  Editar categoria
                </h2>
                <p className="text-sm text-(--gray-600)">
                  Atualize os dados da categoria
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-(--gray-300) bg-background transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                aria-label="Fechar"
              >
                <X className="h-4 w-4 text-(--gray-700)" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Título */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-category-title"
                  className="text-sm font-medium text-(--gray-700)"
                >
                  Título
                </Label>
                <Input
                  id="edit-category-title"
                  type="text"
                  placeholder="Ex. Alimentação"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 rounded-lg border-(--gray-300) px-3 placeholder:text-(--gray-400)"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-category-description"
                  className="text-sm font-medium text-(--gray-700)"
                >
                  Descrição
                </Label>
                <Input
                  id="edit-category-description"
                  type="text"
                  placeholder="Descrição da categoria"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 rounded-lg border-(--gray-300) px-3 placeholder:text-(--gray-400)"
                />
                <p className="text-xs text-(--gray-500)">Opcional</p>
              </div>

              {/* Icon Picker */}
              <IconPicker
                value={icon}
                onChange={setIcon}
                disabled={isSubmitting}
              />

              {/* Color Picker */}
              <ColorPicker
                value={color}
                onChange={setColor}
                disabled={isSubmitting}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="h-12 w-full rounded-lg bg-(--brand-base) text-white hover:bg-(--brand-dark)"
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

export { EditCategoryModal }
export type { EditCategoryModalProps }
