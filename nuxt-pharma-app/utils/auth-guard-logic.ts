/**
 * auth-guard-logic.ts — Pure, testable auth-guard logic
 *
 * This module contains all the decision logic for route protection,
 * extracted from the Nuxt middleware so it can be tested without
 * any Nuxt context (no defineNuxtRouteMiddleware, no useAuth, no navigateTo).
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

// ---------------------------------------------------------------------------
// Route classification constants
// ---------------------------------------------------------------------------

export const ADMIN_PAGES = [
  '/dashboard',
  '/inventory',
  '/expiry-alerts',
  '/settings',
  '/test-products',
] as const

export const PUBLIC_PAGES = ['/'] as const

export const SHARED_PAGES = ['/health', '/chat', '/orders'] as const

// ---------------------------------------------------------------------------
// Session validation
// ---------------------------------------------------------------------------

export interface UserSession {
  id: number
  fullName: string
  email: string
  role: 'pharmacist' | 'patient'
  isActive: boolean
  avatarUrl?: string | null
  phone?: string | null
  congenitalDiseases?: string | null
  drugAllergies?: string | null
  weight?: string | null
  height?: string | null
  bloodPressure?: string | null
  heartRate?: string | null
  medications?: string | null
}

export function isValidSession(data: unknown): data is UserSession {
  if (!data || typeof data !== 'object') return false
  const obj = data as Record<string, unknown>
  if (obj.id == null) return false
  if (!obj.fullName || typeof obj.fullName !== 'string' || obj.fullName.trim() === '') return false
  if (!obj.email || typeof obj.email !== 'string') return false
  if (!obj.role || typeof obj.role !== 'string') return false
  if (obj.role !== 'pharmacist' && obj.role !== 'patient') return false
  return true
}

export function parseSession(raw: string | null): UserSession | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!isValidSession(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Pure testable auth-guard logic
// ---------------------------------------------------------------------------

export type AuthGuardResult =
  | { redirect: string; allowed?: never }
  | { allowed: true; redirect?: never }

/**
 * Evaluates route access for the given path and raw session string.
 *
 * Logic order:
 * 1. If route is a public page ('/'):
 *    - If valid session exists → redirect to role home
 *    - Otherwise → allow (show login)
 * 2. Parse and validate session
 * 3. No valid session → redirect to '/'
 * 4. Admin page + non-pharmacist → redirect to '/chat'
 * 5. Allow access
 *
 * @param path       - The current route path (e.g. '/dashboard')
 * @param sessionRaw - Raw JSON string from localStorage, or null
 * @returns          - { redirect: '...' } or { allowed: true }
 */
export function runAuthGuard(path: string, sessionRaw: string | null): AuthGuardResult {
  const isPublicPage = (PUBLIC_PAGES as readonly string[]).includes(path)

  // Step 1: Public pages (login) — check if already authenticated
  if (isPublicPage) {
    const session = parseSession(sessionRaw)
    if (session) {
      const destination = session.role === 'pharmacist' ? '/dashboard' : '/chat'
      return { redirect: destination }
    }
    // No valid session on public page → allow (show login)
    return { allowed: true }
  }

  // Step 2 & 3: Validate session for protected pages
  const session = parseSession(sessionRaw)
  if (!session) {
    return { redirect: '/' }
  }

  // Step 4: Admin page check — only pharmacist may enter
  const isAdminPage = (ADMIN_PAGES as readonly string[]).includes(path)
  if (isAdminPage && session.role !== 'pharmacist') {
    return { redirect: '/chat' }
  }

  // Step 5: Allow access
  return { allowed: true }
}
