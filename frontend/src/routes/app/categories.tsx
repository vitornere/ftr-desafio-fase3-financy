import { createFileRoute } from "@tanstack/react-router"
import { FolderOpen } from "lucide-react"

export const Route = createFileRoute("/app/categories")({
  component: CategoriesPage,
})

function CategoriesPage() {
  return (
    <div className="space-y-6 pt-12">
      <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground">Em breve</p>
        <p className="mt-1 text-sm text-muted-foreground">
          O gerenciamento de categorias será implementado aqui.
        </p>
      </div>
    </div>
  )
}
