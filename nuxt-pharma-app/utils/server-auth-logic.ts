/**
 * server-auth-logic.ts — Pure, testable server-side auth logic
 *
 * This module contains the decision logic for server-side API protection,
 * extracted from the Nuxt server middleware so it can be tested without
 * any Nuxt/H3 context.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

// ---------------------------------------------------------------------------
// API path classification constants
// ---------------------------------------------------------------------------

export const ADMIN_API_PATHS = [
  '/api/dashboard',
  '/api/inventory',
  // NOTE: /api/orders is NOT here — patients need GET access for their own order history.
  // Auth for /api/orders is handled per-method in the middleware.
] as const

export const PUBLIC_API_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
] as const

export const SYMPTOMS_API_PATH = '/api/symptoms'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ServerAuthResult =
  | { allowed: true; status?: never; error?: never }
  | { allowed?: never; status: 401 | 403; error: string }

export interface RequestHeaders {
  'x-user-role'?: string
  'x-user-id'?: string
  [key: string]: string | undefined
}

// ---------------------------------------------------------------------------
// Pure testable server auth check
// ---------------------------------------------------------------------------

/**
 * Evaluates whether a server-side API request should be allowed.
 *
 * Logic:
 * 1. If path is in PUBLIC_API_PATHS → allow
 * 2. If path is in ADMIN_API_PATHS:
 *    - No x-user-role or x-user-id headers → 401 Unauthorized
 *    - x-user-role !== 'pharmacist' → 403 Forbidden
 *    - Otherwise → allow
 * 3. If path is /api/symptoms:
 *    - No x-user-role or x-user-id headers → 401 Unauthorized
 *    - Has headers (any role) → allow
 * 4. All other paths → allow
 *
 * @param path    - The request path (e.g. '/api/dashboard')
 * @param headers - Request headers object
 * @returns       - { allowed: true } or { status: 401|403, error: string }
 */
export function runServerAuthCheck(
  path: string,
  headers: RequestHeaders,
): ServerAuthResult {
  // Step 1: Public API paths — always allow
  if ((PUBLIC_API_PATHS as readonly string[]).includes(path)) {
    return { allowed: true }
  }

  // Step 2: Admin API paths — require pharmacist session
  if ((ADMIN_API_PATHS as readonly string[]).includes(path)) {
    const role = headers['x-user-role']
    const userId = headers['x-user-id']

    // No session headers → 401
    if (!role || !userId) {
      return { status: 401, error: 'Unauthorized' }
    }

    // Non-pharmacist role → 403
    if (role !== 'pharmacist') {
      return { status: 403, error: 'Forbidden' }
    }

    // Pharmacist with valid headers → allow
    return { allowed: true }
  }

  // Step 3: Symptoms API — require any authenticated session
  if (path === SYMPTOMS_API_PATH) {
    const role = headers['x-user-role']
    const userId = headers['x-user-id']

    // No session headers → 401
    if (!role || !userId) {
      return { status: 401, error: 'Unauthorized' }
    }

    // Any role with headers → allow
    return { allowed: true }
  }

  // Step 4: All other paths → allow
  return { allowed: true }
}
