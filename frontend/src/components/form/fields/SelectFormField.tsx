import type { Control, FieldValues, Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SelectFormFieldItem {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectFormFieldProps<TFieldValues extends FieldValues> {
  /**
   * Form control from useForm()
   */
  control: Control<TFieldValues>
  /**
   * Field name (expects string value; empty maps to undefined/null)
   */
  name: Path<TFieldValues>
  /**
   * Label text displayed above the select
   */
  label: string
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string
  /**
   * Description text displayed below the select
   */
  description?: string
  /**
   * Whether the select is disabled
   */
  disabled?: boolean
  /**
   * Array of items to display in the select
   */
  items: SelectFormFieldItem[]
  /**
   * Whether to allow empty selection
   * @default true
   */
  allowEmpty?: boolean
  /**
   * Label for the empty option
   * @default "Sem categoria"
   */
  emptyLabel?: string
  /**
   * Optional callback when value changes (for side effects)
   */
  onValueChange?: (value: string) => void
  /**
   * Additional CSS classes for the trigger
   */
  className?: string
}

/**
 * SelectFormField - A reusable form field for select inputs.
 * Wraps shadcn FormField with Select for reduced boilerplate.
 *
 * @example
 * ```tsx
 * <SelectFormField
 *   control={form.control}
 *   name="categoryId"
 *   label="Categoria"
 *   placeholder="Selecione uma categoria"
 *   items={categories.map(c => ({ value: c.id, label: c.title }))}
 *   allowEmpty
 *   emptyLabel="Sem categoria"
 * />
 * ```
 */
export function SelectFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Selecione...",
  description,
  disabled,
  items,
  allowEmpty = true,
  emptyLabel = "Sem categoria",
  onValueChange,
  className,
}: SelectFormFieldProps<TFieldValues>) {
  // Special value for empty selection (since Select doesn't allow empty string as value)
  const EMPTY_VALUE = "__empty__"

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert null/undefined to empty value for Select
        const selectValue = field.value ?? (allowEmpty ? EMPTY_VALUE : "")

        const handleValueChange = (value: string) => {
          // Convert empty value back to null/undefined
          const newValue = value === EMPTY_VALUE ? null : value
          field.onChange(newValue)
          onValueChange?.(value === EMPTY_VALUE ? "" : value)
        }

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              value={selectValue}
              onValueChange={handleValueChange}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {allowEmpty && (
                  <SelectItem value={EMPTY_VALUE}>{emptyLabel}</SelectItem>
                )}
                {items.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
