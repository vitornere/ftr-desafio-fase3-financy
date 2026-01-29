import type {
  TransactionFiltersInput,
  PaginationInput,
} from "@/graphql/graphql";

export const queryKeys = {
  authMe: ["me"] as const,
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (filters?: TransactionFiltersInput, pagination?: PaginationInput) =>
      ["transactions", "list", { filters, pagination }] as const,
  },
  summary: {
    all: ["summary"] as const,
    byMonth: (month: number, year: number) =>
      ["summary", { month, year }] as const,
  },
} as const;
