export const queryKeys = {
  authMe: ["me"] as const,
  categories: ["categories"] as const,
  transactions: (filters?: Record<string, unknown>) =>
    ["transactions", filters] as const,
  summary: (month: number, year: number) => ["summary", { month, year }] as const,
} as const;
