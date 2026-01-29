import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Menu, LogOut } from "lucide-react"
import { Logo, LogoIcon } from "@/components/branding"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet"
import { appNav } from "@/config/nav"
import { clearTokens } from "@/lib/auth"
import { AppNavLink } from "./AppNavLink"

/**
 * UserAvatar - Displays user initials in a circular badge.
 * Placeholder implementation - can be enhanced with actual user data later.
 */
function UserAvatar({ initials = "CT" }: { initials?: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
      {initials}
    </div>
  )
}

/**
 * AppHeader - Responsive header component for the authenticated app layout.
 *
 * Desktop (>= md): 3-column grid with logo left, nav centered, avatar right
 * Mobile (< md): Logo + hamburger menu that opens a Sheet drawer
 */
function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearTokens()
    setMobileMenuOpen(false)
    navigate({ to: "/login" })
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="h-[69px] border-b border-border bg-background">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center px-4 sm:px-6 lg:px-12 2xl:px-16">
        {/* Desktop Layout: 3-column grid */}
        <div className="hidden h-full w-full md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8">
          {/* Left: Logo */}
          <Link to="/app" className="flex items-center">
            <Logo className="h-6 w-auto" />
          </Link>

          {/* Center: Navigation */}
          <nav className="flex items-center justify-center gap-6">
            {appNav.map((item) => (
              <AppNavLink key={item.to} to={item.to} exact={item.exact}>
                {item.label}
              </AppNavLink>
            ))}
          </nav>

          {/* Right: User Avatar */}
          <div className="flex items-center justify-end">
            <UserAvatar />
          </div>
        </div>

        {/* Mobile Layout: Logo + Hamburger */}
        <div className="flex h-full w-full items-center justify-between md:hidden">
          {/* Left: Logo Icon */}
          <Link to="/app" className="flex items-center">
            <LogoIcon className="h-8 w-auto" />
          </Link>

          {/* Right: Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm" showCloseButton={false}>
          <SheetHeader className="flex-row items-center justify-between border-b border-border pb-4">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <Logo className="h-6 w-auto" />
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Fechar menu">
                <span className="sr-only">Fechar</span>
                ×
              </Button>
            </SheetClose>
          </SheetHeader>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 px-4 py-6">
            {appNav.map((item) => (
              <AppNavLink
                key={item.to}
                to={item.to}
                exact={item.exact}
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2 text-base hover:bg-muted"
              >
                {item.label}
              </AppNavLink>
            ))}
          </nav>

          {/* Footer: Logout Button */}
          <div className="mt-auto border-t border-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export { AppHeader, UserAvatar }
