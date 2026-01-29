/**
 * Profile utility functions.
 * Helpers are in a separate file to comply with react-refresh/only-export-components.
 */

/**
 * Extract initials from a name.
 * Takes the first letter of the first and last word.
 *
 * @example
 * getInitials("Conta teste") // "CT"
 * getInitials("John") // "J"
 * getInitials("") // ""
 */
export function getInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return ""

  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }

  const first = words[0].charAt(0).toUpperCase()
  const last = words[words.length - 1].charAt(0).toUpperCase()
  return first + last
}
