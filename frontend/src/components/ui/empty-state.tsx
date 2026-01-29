import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  /**
   * Title text for the empty state.
   */
  title: string
  /**
   * Optional description text.
   */
  description?: string
  /**
   * Optional icon to display above the title.
   */
  icon?: ReactNode
  /**
   * Optional action button or CTA.
   */
  action?: ReactNode
  /**
   * Additional CSS classes for the container.
   */
  className?: string
}

/**
 * EmptyState - A reusable empty state component for when there's no data to display.
 * Use for empty lists, no search results, etc.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<FolderOpen className="size-12 text-muted-foreground" />}
 *   title="Nenhuma categoria"
 *   description="Crie sua primeira categoria para organizar suas transações."
 *   action={<Button onClick={openCreateModal}>Criar categoria</Button>}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-8 text-center",
        className
      )}
    >
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
