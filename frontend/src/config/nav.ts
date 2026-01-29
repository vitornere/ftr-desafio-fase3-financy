/**
 * Navigation configuration - Single source of truth for app navigation items.
 * Add new nav items here to update the header automatically.
 */

export type AppNavItem = {
  to: string
  label: string
  exact?: boolean
}

export const appNav: AppNavItem[] = [
  { to: "/app", label: "Dashboard", exact: true },
  { to: "/app/transactions", label: "Transações" },
  { to: "/app/categories", label: "Categorias" },
]
