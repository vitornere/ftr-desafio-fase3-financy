import { z } from "zod"

// =============================================================================
// TransactionType Enum (matches GraphQL)
// =============================================================================
export const TransactionTypeEnum = z.enum(["INCOME", "EXPENSE"])
export type TransactionType = z.infer<typeof TransactionTypeEnum>

// =============================================================================
// Login Schema
// =============================================================================
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .trim()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// =============================================================================
// Register Schema
// =============================================================================
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .trim()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

// =============================================================================
// Category Schema
// =============================================================================
export const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Título deve ter no mínimo 2 caracteres")
    .max(60, "Título deve ter no máximo 60 caracteres"),
  description: z
    .string()
    .trim()
    .max(140, "Descrição deve ter no máximo 140 caracteres")
    .optional()
    .or(z.literal("")),
  icon: z
    .string()
    .min(1, "Ícone é obrigatório"),
  color: z
    .string()
    .min(1, "Cor é obrigatória"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

// =============================================================================
// Transaction Schema
// =============================================================================
/**
 * Transaction form schema.
 * - `date` is stored as YYYY-MM-DD string for form handling
 * - `amountCents` is an integer (cents)
 * - `categoryId` is optional (null means "não categorizado")
 * 
 * Use mappers to convert to GraphQL input format.
 */
export const transactionSchema = z.object({
  type: TransactionTypeEnum,
  description: z
    .string()
    .trim()
    .min(2, "Descrição deve ter no mínimo 2 caracteres")
    .max(80, "Descrição deve ter no máximo 80 caracteres"),
  amountCents: z
    .number()
    .int("Valor deve ser um número inteiro")
    .positive("Valor deve ser maior que zero"),
  date: z
    .string()
    .min(1, "Data é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  categoryId: z
    .string()
    .nullable()
    .optional(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
