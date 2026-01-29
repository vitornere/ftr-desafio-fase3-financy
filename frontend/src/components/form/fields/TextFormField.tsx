import type { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface TextFormFieldProps<TFieldValues extends FieldValues> {
  /**
   * Form control from useForm()
   */
  control: Control<TFieldValues>
  /**
   * Field name (must be a valid path in the form schema)
   */
  name: Path<TFieldValues>
  /**
   * Label text displayed above the input
   */
  label: string
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Description text displayed below the input
   */
  description?: string
  /**
   * Input type (text, email, password, etc.)
   * @default "text"
   */
  type?: React.HTMLInputTypeAttribute
  /**
   * Whether the input is disabled
   */
  disabled?: boolean
  /**
   * Autocomplete attribute for the input
   */
  autoComplete?: string
  /**
   * Additional CSS classes for the input
   */
  className?: string
  /**
   * Additional props passed to the Input component
   */
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    "value" | "onChange" | "type" | "disabled" | "name"
  >
}

/**
 * TextFormField - A reusable form field for text inputs.
 * Wraps shadcn FormField with Input for reduced boilerplate.
 *
 * @example
 * ```tsx
 * <TextFormField
 *   control={form.control}
 *   name="email"
 *   label="Email"
 *   type="email"
 *   placeholder="seu@email.com"
 *   autoComplete="email"
 * />
 * ```
 */
export function TextFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  disabled,
  autoComplete,
  className,
  inputProps,
}: TextFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              className={cn(className)}
              {...inputProps}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
