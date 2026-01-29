import { cn } from "@/lib/utils"

interface AuthDividerProps {
  label?: string
  className?: string
}

/**
 * Divider with centered label for auth pages.
 * Displays a horizontal line with "ou" text in the center.
 */
function AuthDivider({ label = "ou", className }: AuthDividerProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="bg-border h-px flex-1" />
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="bg-border h-px flex-1" />
    </div>
  )
}

export { AuthDivider }
