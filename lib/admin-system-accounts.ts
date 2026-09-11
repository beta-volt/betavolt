/**
 * 🏛️ BetaVolt — System Recovery & Protected Accounts Policy
 * 
 * Defines protected system-level accounts that are excluded from standard
 * UI administration rosters and immunized against client-side mutations.
 */

export const SYSTEM_ADMIN_EMAILS = ['core.admin@betavolt.com.sa'];

export function isSystemAccount(user: { email?: string | null; user_metadata?: Record<string, unknown> | null }): boolean {
  if (!user) return false;
  if (user.user_metadata?.is_system_account === true) return true;
  if (user.email && SYSTEM_ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  return false;
}
