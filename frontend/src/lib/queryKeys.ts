export const queryKeys = {
  authMe: ["me"] as const,
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["transactions", filters] as const,
  },
  summary: (month: number, year: number) => ["summary", { month, year }] as const,
} as const;
