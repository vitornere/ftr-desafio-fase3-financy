import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InlineLoaderProps {
  /**
   * Loading message to display.
   * @default "Carregando..."
   */
  message?: string
  /**
   * Additional CSS classes.
   */
  className?: string
  /**
   * Size of the loader icon.
   * @default "default"
   */
  size?: "sm" | "default" | "lg"
}

const sizeClasses = {
  sm: "size-4",
  default: "size-5",
  lg: "size-6",
}

const textSizeClasses = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
}

/**
 * InlineLoader - A simple inline loading indicator with optional message.
 * Use for inline loading states within content areas.
 *
 * @example
 * ```tsx
 * {isLoading && <InlineLoader message="Carregando transações..." />}
 * ```
 */
export function InlineLoader({
  message = "Carregando...",
  className,
  size = "default",
}: InlineLoaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-4 text-muted-foreground",
        className
      )}
    >
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {message && (
        <span className={cn(textSizeClasses[size])}>{message}</span>
      )}
    </div>
  )
}
