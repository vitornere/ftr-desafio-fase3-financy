import * as React from "react"

import { Input } from "@/components/ui/input"
import { formatBRLValueFromCents, parseBRLToCents } from "@/lib/money"
import { cn } from "@/lib/utils"

export interface MoneyInputProps {
  /**
   * Value in cents (integer). Null means empty.
   */
  value?: number | null
  /**
   * Called when value changes. Receives cents or null if empty.
   */
  onChange?: (cents: number | null) => void
  /**
   * Called when input loses focus.
   */
  onBlur?: () => void
  /**
   * Placeholder text.
   * @default "0,00"
   */
  placeholder?: string
  /**
   * Whether the input is disabled.
   */
  disabled?: boolean
  /**
   * Additional CSS classes.
   */
  className?: string
  /**
   * Input name for form handling.
   */
  name?: string
  /**
   * Input id for label association.
   */
  id?: string
  /**
   * Aria-invalid for form validation.
   */
  "aria-invalid"?: boolean
  /**
   * Aria-describedby for accessibility.
   */
  "aria-describedby"?: string
}

/**
 * MoneyInput component for BRL currency input.
 * Displays and accepts Brazilian Real format (R$ 1.234,56)
 * but stores values as cents (integer).
 *
 * @example
 * ```tsx
 * // With react-hook-form Controller
 * <Controller
 *   name="amountCents"
 *   control={control}
 *   render={({ field }) => (
 *     <MoneyInput
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *     />
 *   )}
 * />
 * ```
 */
function MoneyInput({
  value,
  onChange,
  onBlur,
  placeholder = "0,00",
  disabled,
  className,
  name,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: MoneyInputProps) {
  // Internal display value for user typing
  const [displayValue, setDisplayValue] = React.useState(() =>
    value != null ? formatBRLValueFromCents(value) : ""
  )

  // Track if user is actively typing
  const [isTyping, setIsTyping] = React.useState(false)

  // Sync display value when external value changes (but not while typing)
  React.useEffect(() => {
    if (!isTyping) {
      setDisplayValue(value != null ? formatBRLValueFromCents(value) : "")
    }
  }, [value, isTyping])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    setIsTyping(true)

    // Parse and emit cents value
    if (inputValue === "") {
      onChange?.(null)
    } else {
      const cents = parseBRLToCents(inputValue)
      if (cents !== null) {
        onChange?.(cents)
      }
    }
  }

  const handleBlur = () => {
    setIsTyping(false)

    // Format on blur
    if (displayValue === "") {
      setDisplayValue("")
      onChange?.(null)
    } else {
      const cents = parseBRLToCents(displayValue)
      if (cents !== null) {
        setDisplayValue(formatBRLValueFromCents(cents))
        onChange?.(cents)
      } else {
        // Invalid input - reset to previous valid value
        setDisplayValue(value != null ? formatBRLValueFromCents(value) : "")
      }
    }

    onBlur?.()
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text on focus for easy replacement
    e.target.select()
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        R$
      </span>
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("pl-9", className)}
        name={name}
        id={id}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
    </div>
  )
}

export { MoneyInput }
