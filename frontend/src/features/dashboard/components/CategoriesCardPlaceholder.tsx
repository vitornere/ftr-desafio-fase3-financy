import { Link } from "@tanstack/react-router"
import { ChevronRight, FolderOpen } from "lucide-react"

import { Card } from "@/components/ui/card"

/**
 * CategoriesCardPlaceholder - Placeholder card for the categories section.
 * Will be replaced with actual category stats implementation.
 */
function CategoriesCardPlaceholder() {
  return (
    <Card className="flex flex-col gap-0 overflow-hidden rounded-xl border-border p-0 shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border py-5 pl-6 pr-3">
        <span className="text-xs font-medium uppercase tracking-[0.6px] text-(--gray-500)">
          Categorias
        </span>
        <Link
          to="/app/categories"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Gerenciar
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Body - Placeholder */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Em breve</p>
      </div>
    </Card>
  )
}

export { CategoriesCardPlaceholder }
