/**
 * Money utility functions for BRL currency handling.
 * All internal values are stored as cents (integer) to avoid floating point issues.
 */

/**
 * Format cents as BRL currency string.
 * 
 * @param cents - Amount in cents (integer)
 * @returns Formatted string like "R$ 1.234,56"
 * 
 * @example
 * formatBRLFromCents(123456) // "R$ 1.234,56"
 * formatBRLFromCents(100)    // "R$ 1,00"
 * formatBRLFromCents(0)      // "R$ 0,00"
 */
export function formatBRLFromCents(cents: number): string {
  const value = cents / 100
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

/**
 * Format cents as BRL string without currency symbol.
 * 
 * @param cents - Amount in cents (integer)
 * @returns Formatted string like "1.234,56"
 */
export function formatBRLValueFromCents(cents: number): string {
  const value = cents / 100
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Parse a BRL formatted string to cents.
 * Accepts various formats:
 * - "12" -> 1200
 * - "12,3" -> 1230
 * - "12,34" -> 1234
 * - "R$ 12,34" -> 1234
 * - "1.234,56" -> 123456
 * - "R$ 1.234,56" -> 123456
 * 
 * @param input - User input string
 * @returns Amount in cents (integer) or null if invalid/empty
 * 
 * @example
 * parseBRLToCents("R$ 12,34")   // 1234
 * parseBRLToCents("1.234,56")   // 123456
 * parseBRLToCents("")           // null
 * parseBRLToCents("abc")        // null
 */
export function parseBRLToCents(input: string): number | null {
  if (!input || typeof input !== "string") {
    return null
  }

  // Remove currency symbol, spaces, and trim
  let cleaned = input
    .replace(/R\$/g, "")
    .replace(/\s/g, "")
    .trim()

  if (cleaned === "") {
    return null
  }

  // Handle Brazilian format: 1.234,56
  // Remove thousand separators (dots) and replace comma with dot
  cleaned = cleaned.replace(/\./g, "").replace(",", ".")

  const parsed = parseFloat(cleaned)

  if (isNaN(parsed)) {
    return null
  }

  // Convert to cents and round to avoid floating point issues
  return Math.round(parsed * 100)
}

/**
 * Check if a string can be parsed as a valid BRL amount.
 * 
 * @param input - User input string
 * @returns true if valid, false otherwise
 */
export function isValidBRLInput(input: string): boolean {
  return parseBRLToCents(input) !== null
}
