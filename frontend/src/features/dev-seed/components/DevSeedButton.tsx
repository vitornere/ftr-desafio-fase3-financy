import * as React from "react"
import { Database, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useIsDevSeedEnabled, useSeedDevData } from "../hooks"

/**
 * Check if the dev seed feature is enabled on the frontend.
 * This is the first gate - if this returns false, the button won't render at all.
 */
function isDevSeedEnabledOnClient(): boolean {
  return import.meta.env.VITE_DEV_SEED_ENABLED === "true"
}

/**
 * Get current month (1-12).
 */
function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

/**
 * Get current year.
 */
function getCurrentYear(): number {
  return new Date().getFullYear()
}

/**
 * DevSeedButton - A floating button that appears only in development
 * when the DEV_SEED_ENABLED flag is true on both frontend and backend.
 *
 * Opens a dialog to configure and trigger the seed mutation.
 */
export function DevSeedButton() {
  // First gate: frontend flag
  if (!isDevSeedEnabledOnClient()) {
    return null
  }

  return <DevSeedButtonInner />
}

/**
 * Inner component that does the actual work.
 * Separated to avoid hooks running when the feature is disabled.
 */
function DevSeedButtonInner() {
  // Second gate: backend flag
  const { data: serverEnabled, isLoading: isCheckingServer } = useIsDevSeedEnabled()
  const seedMutation = useSeedDevData()

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Form state
  const [month, setMonth] = React.useState(getCurrentMonth())
  const [year, setYear] = React.useState(getCurrentYear())
  const [categoriesCount, setCategoriesCount] = React.useState(10)
  const [transactionsCount, setTransactionsCount] = React.useState(80)
  const [clearExisting, setClearExisting] = React.useState(false)

  // Don't render if server says feature is disabled
  if (isCheckingServer || !serverEnabled?.isDevSeedEnabled) {
    return null
  }

  const handleSeed = async () => {
    try {
      await seedMutation.mutateAsync({
        month,
        year,
        categoriesCount,
        transactionsCount,
        clearExisting,
      })
      setIsDialogOpen(false)
    } catch {
      // Error is handled by the hook
    }
  }

  const isPending = seedMutation.isPending

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="h-12 gap-2 rounded-full bg-amber-600 px-4 shadow-lg hover:bg-amber-700"
          title="Gerar dados fake (DEV)"
        >
          <Database className="h-5 w-5" />
          <span className="hidden sm:inline">Seed DEV</span>
        </Button>
      </div>

      {/* Configuration dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-amber-600" />
              Popular dados (DEV)
            </DialogTitle>
            <DialogDescription>
              Gerar categorias e transações fake para testes. Os dados serão
              associados ao seu usuário atual.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Month / Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="seed-month">Mês</Label>
                <Input
                  id="seed-month"
                  type="number"
                  min={1}
                  max={12}
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  disabled={isPending}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="seed-year">Ano</Label>
                <Input
                  id="seed-year"
                  type="number"
                  min={2020}
                  max={2030}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Categories count */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="seed-categories">Categorias (máx 10)</Label>
              <Input
                id="seed-categories"
                type="number"
                min={1}
                max={10}
                value={categoriesCount}
                onChange={(e) =>
                  setCategoriesCount(Math.min(10, Math.max(1, Number(e.target.value))))
                }
                disabled={isPending}
              />
            </div>

            {/* Transactions count */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="seed-transactions">Transações (máx 200)</Label>
              <Input
                id="seed-transactions"
                type="number"
                min={1}
                max={200}
                value={transactionsCount}
                onChange={(e) =>
                  setTransactionsCount(
                    Math.min(200, Math.max(1, Number(e.target.value)))
                  )
                }
                disabled={isPending}
              />
            </div>

            {/* Clear existing checkbox */}
            <div className="flex items-center gap-2">
              <input
                id="seed-clear"
                type="checkbox"
                checked={clearExisting}
                onChange={(e) => setClearExisting(e.target.checked)}
                disabled={isPending}
                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
              />
              <Label htmlFor="seed-clear" className="cursor-pointer text-sm font-normal">
                Limpar dados existentes antes de gerar
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSeed}
              disabled={isPending}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Gerar dados
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
