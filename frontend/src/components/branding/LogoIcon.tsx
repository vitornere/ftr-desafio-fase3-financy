import LogoIconSvg from "@/assets/logo_icon"
import { cn } from "@/lib/utils"

export type LogoIconProps = React.SVGProps<SVGSVGElement>

/**
 * LogoIcon component - The Financy icon/symbol only (no text).
 * Uses currentColor for fill, so color can be controlled via text-* classes.
 *
 * @example
 * ```tsx
 * <LogoIcon />
 * <LogoIcon className="text-primary" />
 * <LogoIcon width={24} height={24} className="text-gray-800" />
 * ```
 */
function LogoIcon({ className, ...props }: LogoIconProps) {
  return (
    <LogoIconSvg
      className={cn("text-[var(--brand-base)]", className)}
      {...props}
    />
  )
}

export { LogoIcon }
