import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PasswordFieldProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  showToggle?: boolean
}

/**
 * Password input with lock icon and visibility toggle.
 */
const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ showToggle = true, className, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    const toggleVisibility = () => setIsVisible((prev) => !prev)

    return (
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <Lock className="size-4" />
        </div>
        <Input
          ref={ref}
          type={isVisible ? "text" : "password"}
          className={cn("h-11 pl-10", showToggle && "pr-10", className)}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            {isVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
    )
  }
)

PasswordField.displayName = "PasswordField"

export { PasswordField }
