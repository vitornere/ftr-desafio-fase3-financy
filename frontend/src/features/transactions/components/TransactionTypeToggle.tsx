import { CircleArrowDown, CircleArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

type TransactionType = "expense" | "income"

interface TransactionTypeToggleProps {
  value: TransactionType
  onChange: (type: TransactionType) => void
  disabled?: boolean
}

/**
 * Toggle component for selecting between expense and income transaction types.
 * Styled as a segment control with colored borders when selected.
 */
function TransactionTypeToggle({
  value,
  onChange,
  disabled = false,
}: TransactionTypeToggleProps) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-xl border border-border p-2",
        disabled && "opacity-50"
      )}
    >
      <button
        type="button"
        onClick={() => onChange("expense")}
        disabled={disabled}
        className={cn(
          "flex h-[46px] flex-1 items-center justify-center gap-3 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none cursor-pointer",
          value === "expense"
            ? "border border-(--danger) bg-gray-100 text-foreground"
            : "border border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        <CircleArrowDown
          className={cn(
            "h-5 w-5",
            value === "expense" ? "text-(--danger)" : "text-muted-foreground"
          )}
        />
        Despesa
      </button>

      <button
        type="button"
        onClick={() => onChange("income")}
        disabled={disabled}
        className={cn(
          "flex h-[46px] flex-1 items-center justify-center gap-3 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none cursor-pointer",
          value === "income"
            ? "border border-primary bg-gray-100 text-foreground"
            : "border border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        <CircleArrowUp
          className={cn(
            "h-5 w-5",
            value === "income" ? "text-primary" : "text-muted-foreground"
          )}
        />
        Receita
      </button>
    </div>
  )
}

export { TransactionTypeToggle }
export type { TransactionType, TransactionTypeToggleProps }
