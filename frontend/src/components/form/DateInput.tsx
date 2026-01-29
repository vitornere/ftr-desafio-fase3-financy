import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface DateInputProps {
  /**
   * Value in YYYY-MM-DD format. Null/undefined means empty.
   */
  value?: string | null
  /**
   * Called when value changes. Receives YYYY-MM-DD string or null if empty.
   */
  onChange?: (value: string | null) => void
  /**
   * Called when input loses focus.
   */
  onBlur?: () => void
  /**
   * Placeholder text (not visible on date inputs, but useful for accessibility).
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
   * Minimum date in YYYY-MM-DD format.
   */
  min?: string
  /**
   * Maximum date in YYYY-MM-DD format.
   */
  max?: string
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
 * DateInput component using native date input.
 * Accepts and emits YYYY-MM-DD format strings.
 *
 * @example
 * ```tsx
 * // With react-hook-form Controller
 * <Controller
 *   name="date"
 *   control={control}
 *   render={({ field }) => (
 *     <DateInput
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *     />
 *   )}
 * />
 * ```
 */
function DateInput({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  className,
  name,
  id,
  min,
  max,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: DateInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange?.(inputValue === "" ? null : inputValue)
  }

  return (
    <Input
      type="date"
      value={value ?? ""}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        // Ensure consistent styling across browsers
        "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
        "[&::-webkit-calendar-picker-indicator]:opacity-60",
        "[&::-webkit-calendar-picker-indicator]:hover:opacity-100",
        className
      )}
      name={name}
      id={id}
      min={min}
      max={max}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
    />
  )
}

export { DateInput }
