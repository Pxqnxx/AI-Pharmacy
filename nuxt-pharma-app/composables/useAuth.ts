/**
 * useAuth — Session Management Composable
 *
 * Manages user session stored in localStorage under the key 'user'.
 * Always checks process.client before accessing localStorage (SSR safety).
 *
 * Requirements: 1.5, 4.4, 7.1
 */

import type { UserSession } from '~/utils/auth-guard-logic'

const SESSION_KEY = 'user'

/**
 * Validates that a parsed object is a well-formed UserSession.
 *
 * Rules:
 * - Must have id, fullName, email, role (all non-null / non-empty)
 * - role must be exactly 'pharmacist' or 'patient'
 * - fullName must be a non-empty string
 */
function isValidSession(data: unknown): data is UserSession {
  if (!data || typeof data !== 'object') return false

  const obj = data as Record<string, unknown>

  // Required fields must be present and non-null
  if (obj.id == null) return false
  if (!obj.fullName || typeof obj.fullName !== 'string' || obj.fullName.trim() === '') return false
  if (!obj.email || typeof obj.email !== 'string') return false
  if (!obj.role || typeof obj.role !== 'string') return false

  // role must be one of the two known values
  if (obj.role !== 'pharmacist' && obj.role !== 'patient') return false

  return true
}

export function useAuth() {
  /**
   * Reads and validates the session from localStorage.
   * Returns null if:
   *  - Not running on the client
   *  - No data stored
   *  - JSON parse fails
   *  - Required fields are missing or invalid
   *  - fullName is empty
   */
  function getSession(): UserSession | null {
    if (!process.client) return null

    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw)
      if (!isValidSession(parsed)) return null
      return parsed
    } catch {
      return null
    }
  }

  /**
   * Persists a UserSession to localStorage.
   * No-op when not running on the client.
   */
  function setSession(user: UserSession): void {
    if (!process.client) return
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }

  /**
   * Removes the session from localStorage.
   * No-op when not running on the client.
   */
  function clearSession(): void {
    if (!process.client) return
    localStorage.removeItem(SESSION_KEY)
  }

  /**
   * Returns true when a valid session exists.
   */
  function isAuthenticated(): boolean {
    return getSession() !== null
  }

  /**
   * Returns the default route for the current session's role:
   *  - 'pharmacist' → '/dashboard'
   *  - 'patient'    → '/chat'
   *  - no session   → '/' (login page)
   */
  function getDefaultRoute(): string {
    const session = getSession()
    if (!session) return '/'
    return session.role === 'pharmacist' ? '/dashboard' : '/chat'
  }

  return {
    getSession,
    setSession,
    clearSession,
    isAuthenticated,
    getDefaultRoute,
  }
}
