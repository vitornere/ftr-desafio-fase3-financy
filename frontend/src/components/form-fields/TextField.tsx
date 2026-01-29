import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TextFieldProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode
}

/**
 * Input field with optional leading icon.
 * Used for text, email, and other standard inputs.
 */
const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ icon, className, ...props }, ref) => {
    if (!icon) {
      return <Input ref={ref} className={cn("h-11", className)} {...props} />
    }

    return (
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
        <Input
          ref={ref}
          className={cn("h-11 pl-10", className)}
          {...props}
        />
      </div>
    )
  }
)

TextField.displayName = "TextField"

export { TextField }
