import { createFileRoute } from "@tanstack/react-router"
import { Receipt } from "lucide-react"

interface TransactionsSearchParams {
  month?: number
  year?: number
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

    return {
      month:
        !isNaN(month) && month >= 1 && month <= 12
          ? month
          : getCurrentMonth(),
      year:
        !isNaN(year) && year >= 2000 && year <= 2100
          ? year
          : getCurrentYear(),
    }
  },
  component: TransactionsPage,
})

function TransactionsPage() {
  return (
    <div className="space-y-6 pt-12">
      <h1 className="text-2xl font-bold text-foreground">Transações</h1>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <Receipt className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground">Em breve</p>
        <p className="mt-1 text-sm text-muted-foreground">
          A listagem completa de transações será implementada aqui.
        </p>
      </div>
    </div>
  )
}
