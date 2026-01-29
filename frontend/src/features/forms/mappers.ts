import type {
  CreateCategoryInput,
  CreateTransactionInput,
  UpdateCategoryInput,
  UpdateTransactionInput,
} from "@/graphql/graphql"
import { TransactionType as GraphQLTransactionType } from "@/graphql/graphql"
import { toISODateTimeNoonUTC } from "@/lib/date"
import type {
  CategoryFormValues,
  TransactionFormValues,
} from "./schemas"

// =============================================================================
// Transaction Mappers
// =============================================================================

/**
 * Map transaction form values to CreateTransactionInput for GraphQL.
 * 
 * Conversions:
 * - `date` (YYYY-MM-DD) -> ISO datetime at noon UTC to avoid timezone issues
 * - `categoryId` empty string or null -> undefined (backend accepts null for uncategorized)
 * 
 * @param form - Transaction form values
 * @returns GraphQL CreateTransactionInput
 */
export function mapTransactionFormToCreateInput(
  form: TransactionFormValues
): CreateTransactionInput {
  return {
    type: form.type === "INCOME" ? GraphQLTransactionType.Income : GraphQLTransactionType.Expense,
    description: form.description,
    amountCents: form.amountCents,
    date: toISODateTimeNoonUTC(form.date),
    categoryId: form.categoryId || null,
  }
}

/**
 * Map transaction form values to UpdateTransactionInput for GraphQL.
 * 
 * @param form - Transaction form values with id
 * @returns GraphQL UpdateTransactionInput
 */
export function mapTransactionFormToUpdateInput(
  form: TransactionFormValues & { id: string }
): UpdateTransactionInput {
  return {
    id: form.id,
    type: form.type === "INCOME" ? GraphQLTransactionType.Income : GraphQLTransactionType.Expense,
    description: form.description,
    amountCents: form.amountCents,
    date: toISODateTimeNoonUTC(form.date),
    categoryId: form.categoryId || null,
  }
}

// =============================================================================
// Category Mappers
// =============================================================================

/**
 * Map category form values to CreateCategoryInput for GraphQL.
 * 
 * @param form - Category form values
 * @returns GraphQL CreateCategoryInput
 */
export function mapCategoryFormToCreateInput(
  form: CategoryFormValues
): CreateCategoryInput {
  return {
    title: form.title,
    icon: form.icon,
    color: form.color,
    description: form.description || undefined,
  }
}

/**
 * Map category form values to UpdateCategoryInput for GraphQL.
 * 
 * @param form - Category form values with id
 * @returns GraphQL UpdateCategoryInput
 */
export function mapCategoryFormToUpdateInput(
  form: CategoryFormValues & { id: string }
): UpdateCategoryInput {
  return {
    id: form.id,
    title: form.title,
    icon: form.icon,
    color: form.color,
    description: form.description || undefined,
  }
}
