import { toast } from "sonner"

/**
 * Toast wrapper functions for consistent notification styling.
 * Uses Sonner under the hood.
 */

/**
 * Show a success toast notification.
 *
 * @param message - Success message to display
 */
export function toastSuccess(message: string): void {
  toast.success(message)
}

/**
 * Show an error toast notification.
 *
 * @param message - Error message to display
 */
export function toastError(message: string): void {
  toast.error(message)
}

/**
 * Show an info toast notification.
 *
 * @param message - Info message to display
 */
export function toastInfo(message: string): void {
  toast.info(message)
}

/**
 * Show a warning toast notification.
 *
 * @param message - Warning message to display
 */
export function toastWarning(message: string): void {
  toast.warning(message)
}

/**
 * Show a loading toast that can be updated.
 *
 * @param message - Loading message to display
 * @returns Toast ID that can be used to update or dismiss
 */
export function toastLoading(message: string): string | number {
  return toast.loading(message)
}

/**
 * Dismiss a specific toast by ID.
 *
 * @param toastId - Toast ID to dismiss
 */
export function toastDismiss(toastId: string | number): void {
  toast.dismiss(toastId)
}
