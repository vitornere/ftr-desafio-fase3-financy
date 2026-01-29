/**
 * Get initials from a name string.
 * Returns up to 2 uppercase letters from the first and last words.
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Alice") // "A"
 * getInitials("João da Silva") // "JS"
 * getInitials() // ""
 */
export function getInitials(name?: string): string {
  if (!name) return ""

  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return ""
  if (words.length === 1) return words[0].charAt(0).toUpperCase()

  const first = words[0].charAt(0)
  const last = words[words.length - 1].charAt(0)

  return (first + last).toUpperCase()
}
