import type { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MoneyInput } from "../MoneyInput"

export interface MoneyFormFieldProps<TFieldValues extends FieldValues> {
  /**
   * Form control from useForm()
   */
  control: Control<TFieldValues>
  /**
   * Field name (expects number | null for cents value)
   */
  name: Path<TFieldValues>
  /**
   * Label text displayed above the input
   */
  label: string
  /**
   * Placeholder text
   * @default "0,00"
   */
  placeholder?: string
  /**
   * Description text displayed below the input
   */
  description?: string
  /**
   * Whether the input is disabled
   */
  disabled?: boolean
  /**
   * Additional CSS classes for the input
   */
  className?: string
}

/**
 * MoneyFormField - A reusable form field for BRL currency input.
 * Wraps shadcn FormField with MoneyInput for reduced boilerplate.
 * Stores values as cents (integer).
 *
 * @example
 * ```tsx
 * <MoneyFormField
 *   control={form.control}
 *   name="amountCents"
 *   label="Valor"
 *   placeholder="0,00"
 * />
 * ```
 */
export function MoneyFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "0,00",
  description,
  disabled,
  className,
}: MoneyFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MoneyInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              disabled={disabled}
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
