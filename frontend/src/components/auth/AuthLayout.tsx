import { Logo } from "@/components/branding"

interface AuthLayoutProps {
  children: React.ReactNode
}

/**
 * Auth layout shell with centered logo and content.
 * Used for login and register pages.
 */
function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background flex flex-col min-h-[calc(100vh-4rem)] items-center px-4 py-16 gap-2">
      <Logo className="mb-6 h-10 w-auto" />
      <div className="w-full max-w-[460px]">{children}</div>
    </div>
  )
}

export { AuthLayout }
