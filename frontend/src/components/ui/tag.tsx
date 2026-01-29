import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Tag color variants based on the accent palette from the style guide.
 * Each color has a light background with darker text for optimal readability.
 */
const tagVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      color: {
        red: "bg-[var(--accent-red-bg)] text-[var(--accent-red-text)]",
        orange: "bg-[var(--accent-orange-bg)] text-[var(--accent-orange-text)]",
        yellow: "bg-[var(--accent-yellow-bg)] text-[var(--accent-yellow-text)]",
        green: "bg-[var(--accent-green-bg)] text-[var(--accent-green-text)]",
        teal: "bg-[var(--accent-teal-bg)] text-[var(--accent-teal-text)]",
        blue: "bg-[var(--accent-blue-bg)] text-[var(--accent-blue-text)]",
        indigo: "bg-[var(--accent-indigo-bg)] text-[var(--accent-indigo-text)]",
        purple: "bg-[var(--accent-purple-bg)] text-[var(--accent-purple-text)]",
        pink: "bg-[var(--accent-pink-bg)] text-[var(--accent-pink-text)]",
        gray: "bg-[var(--accent-gray-bg)] text-[var(--accent-gray-text)]",
      },
    },
    defaultVariants: {
      color: "gray",
    },
  }
)

export type TagColor = NonNullable<VariantProps<typeof tagVariants>["color"]>

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
  VariantProps<typeof tagVariants> { }

/**
 * Tag component for displaying colored labels/categories.
 * Uses the accent palette with light backgrounds and darker text.
 *
 * @example
 * ```tsx
 * <Tag color="green">Alimentação</Tag>
 * <Tag color="blue">Transporte</Tag>
 * <Tag color="purple">Lazer</Tag>
 * ```
 */
function Tag({ className, color = "gray", ...props }: TagProps) {
  return (
    <span
      data-slot="tag"
      data-color={color}
      className={cn(tagVariants({ color }), className)}
      {...props}
    />
  )
}

export { Tag, tagVariants }
