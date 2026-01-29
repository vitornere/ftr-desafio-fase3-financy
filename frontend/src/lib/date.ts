/**
 * Date utility functions for consistent date handling.
 * 
 * Design Decision:
 * - Forms use YYYY-MM-DD format (native input[type="date"] format)
 * - GraphQL expects DateTimeISO format (e.g., "2024-01-15T12:00:00.000Z")
 * - We convert at submit time using mappers, setting time to noon UTC to avoid timezone issues
 */

/**
 * Convert a Date object to YYYY-MM-DD string.
 * 
 * @param date - JavaScript Date object
 * @returns String in YYYY-MM-DD format
 * 
 * @example
 * toYYYYMMDD(new Date(2024, 0, 15)) // "2024-01-15"
 */
export function toYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Get today's date as YYYY-MM-DD string.
 * 
 * @returns Today's date in YYYY-MM-DD format
 * 
 * @example
 * todayYYYYMMDD() // "2024-01-15" (if today is Jan 15, 2024)
 */
export function todayYYYYMMDD(): string {
  return toYYYYMMDD(new Date())
}

/**
 * Validate if a string is in YYYY-MM-DD format.
 * 
 * @param s - String to validate
 * @returns true if valid YYYY-MM-DD format
 * 
 * @example
 * isValidYYYYMMDD("2024-01-15") // true
 * isValidYYYYMMDD("2024-1-15")  // false
 * isValidYYYYMMDD("15/01/2024") // false
 */
export function isValidYYYYMMDD(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return false
  }

  const date = new Date(s + "T00:00:00")
  if (isNaN(date.getTime())) {
    return false
  }

  // Verify the date components match (catches invalid dates like 2024-02-30)
  const [year, month, day] = s.split("-").map(Number)
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  )
}

/**
 * Convert YYYY-MM-DD to ISO datetime string at noon UTC.
 * Using noon UTC helps avoid date shifting due to timezone offsets.
 * 
 * @param dateString - Date in YYYY-MM-DD format
 * @returns ISO datetime string (e.g., "2024-01-15T12:00:00.000Z")
 * 
 * @example
 * toISODateTimeNoonUTC("2024-01-15") // "2024-01-15T12:00:00.000Z"
 */
export function toISODateTimeNoonUTC(dateString: string): string {
  return `${dateString}T12:00:00.000Z`
}

/**
 * Parse an ISO datetime string to YYYY-MM-DD format.
 * Useful for converting GraphQL responses back to form values.
 * 
 * @param isoString - ISO datetime string
 * @returns Date in YYYY-MM-DD format
 * 
 * @example
 * fromISOToYYYYMMDD("2024-01-15T12:00:00.000Z") // "2024-01-15"
 */
export function fromISOToYYYYMMDD(isoString: string): string {
  const date = new Date(isoString)
  return toYYYYMMDD(date)
}

/**
 * Get the first day of the current month as YYYY-MM-DD.
 */
export function firstDayOfMonthYYYYMMDD(): string {
  const now = new Date()
  return toYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), 1))
}

/**
 * Get the last day of the current month as YYYY-MM-DD.
 */
export function lastDayOfMonthYYYYMMDD(): string {
  const now = new Date()
  return toYYYYMMDD(new Date(now.getFullYear(), now.getMonth() + 1, 0))
}
