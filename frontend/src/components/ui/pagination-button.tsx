import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const paginationButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        active:
          "bg-primary text-primary-foreground hover:bg-[var(--brand-dark)]",
        ellipsis:
          "bg-transparent text-muted-foreground cursor-default pointer-events-none",
      },
      size: {
        default: "size-8",
        sm: "size-7 text-xs",
        lg: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface PaginationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof paginationButtonVariants> {
  /**
   * Whether this is the currently active page
   */
  isActive?: boolean
}

/**
 * PaginationButton component for pagination controls.
 * Supports default, active, and ellipsis states.
 *
 * @example
 * ```tsx
 * <PaginationButton>1</PaginationButton>
 * <PaginationButton isActive>2</PaginationButton>
 * <PaginationButton>3</PaginationButton>
 * <PaginationButton variant="ellipsis">...</PaginationButton>
 * ```
 */
function PaginationButton({
  className,
  variant,
  size,
  isActive,
  ...props
}: PaginationButtonProps) {
  // If isActive is true, force the active variant
  const resolvedVariant = isActive ? "active" : variant

  return (
    <button
      type="button"
      data-slot="pagination-button"
      data-active={isActive}
      className={cn(
        paginationButtonVariants({ variant: resolvedVariant, size }),
        className
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  )
}

/**
 * PaginationEllipsis component - a non-interactive ellipsis indicator.
 */
function PaginationEllipsis({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "inline-flex size-8 items-center justify-center text-sm text-muted-foreground",
        className
      )}
      aria-hidden
      {...props}
    >
      ...
    </span>
  )
}

export { PaginationButton, PaginationEllipsis, paginationButtonVariants }
