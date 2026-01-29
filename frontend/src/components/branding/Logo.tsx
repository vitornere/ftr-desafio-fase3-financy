import LogoSvg from "@/assets/logo"
import { cn } from "@/lib/utils"

export type LogoProps = React.SVGProps<SVGSVGElement>

/**
 * Logo component - The full Financy logo with text.
 * Uses currentColor for fill, so color can be controlled via text-* classes.
 *
 * @example
 * ```tsx
 * <Logo />
 * <Logo className="text-primary" />
 * <Logo width={200} height={48} className="text-gray-800" />
 * ```
 */
function Logo({ className, ...props }: LogoProps) {
  return (
    <LogoSvg
      className={cn("text-[var(--brand-base)]", className)}
      {...props}
    />
  )
}

export { Logo }
