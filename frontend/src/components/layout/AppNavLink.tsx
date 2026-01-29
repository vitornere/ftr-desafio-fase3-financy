import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

interface AppNavLinkProps {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  exact?: boolean
}

/**
 * Navigation link component with TanStack Router active state styling.
 * Renders active links with primary color and semibold font.
 */
function AppNavLink({ to, children, className, onClick, exact }: AppNavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "text-sm transition-colors hover:text-foreground",
        className
      )}
      activeProps={{
        className: "text-primary font-semibold",
      }}
      inactiveProps={{
        className: "text-muted-foreground font-normal",
      }}
      activeOptions={{ exact: exact ?? false, includeSearch: false, includeHash: false }}
    >
      {children}
    </Link>
  )
}

export { AppNavLink }
