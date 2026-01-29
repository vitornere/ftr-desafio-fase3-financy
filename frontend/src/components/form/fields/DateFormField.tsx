import type { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DateInput } from "../DateInput"

export interface DateFormFieldProps<TFieldValues extends FieldValues> {
  /**
   * Form control from useForm()
   */
  control: Control<TFieldValues>
  /**
   * Field name (expects string | null in YYYY-MM-DD format)
   */
  name: Path<TFieldValues>
  /**
   * Label text displayed above the input
   */
  label: string
  /**
   * Description text displayed below the input
   */
  description?: string
  /**
   * Whether the input is disabled
   */
  disabled?: boolean
  /**
   * Minimum date in YYYY-MM-DD format
   */
  min?: string
  /**
   * Maximum date in YYYY-MM-DD format
   */
  max?: string
  /**
   * Additional CSS classes for the input
   */
  className?: string
}

/**
 * DateFormField - A reusable form field for date input.
 * Wraps shadcn FormField with DateInput for reduced boilerplate.
 * Uses native date input with YYYY-MM-DD format.
 *
 * @example
 * ```tsx
 * <DateFormField
 *   control={form.control}
 *   name="date"
 *   label="Data"
 * />
 * ```
 */
export function DateFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  min,
  max,
  className,
}: DateFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DateInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
              min={min}
              max={max}
              className={className}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
