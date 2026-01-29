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
    <div className="bg-background flex min-h-screen flex-col items-center px-4 py-8">
      <Logo className="mb-6 h-10 w-auto" />
      <div className="w-full max-w-[460px]">{children}</div>
    </div>
  )
}

export { AuthLayout }
