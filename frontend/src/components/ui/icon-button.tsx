import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>

export interface IconButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size"> {
  /**
   * Size of the icon button
   * @default "default"
   */
  size?: "xs" | "sm" | "default" | "lg"
}

const sizeMap = {
  xs: "icon-xs",
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
} as const

/**
 * IconButton component - a wrapper around Button with icon sizing.
 * Commonly used for edit, delete, and other icon-only actions.
 *
 * @example
 * ```tsx
 * import { Pencil, Trash2 } from "lucide-react"
 *
 * <IconButton variant="ghost" aria-label="Edit">
 *   <Pencil />
 * </IconButton>
 *
 * <IconButton variant="destructive" size="sm" aria-label="Delete">
 *   <Trash2 />
 * </IconButton>
 * ```
 */
function IconButton({
  className,
  size = "default",
  variant = "ghost" as ButtonVariant,
  ...props
}: IconButtonProps) {
  return (
    <Button
      data-slot="icon-button"
      variant={variant}
      size={sizeMap[size]}
      className={cn(className)}
      {...props}
    />
  )
}

export { IconButton }
