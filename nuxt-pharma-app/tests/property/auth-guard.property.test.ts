/**
 * Property-based tests for middleware/auth-guard.ts (via utils/auth-guard-logic.ts)
 *
 * Feature: role-based-access-control
 *
 * Properties tested:
 *   Property 1: Unauthenticated access always redirects to login
 *   Property 2: Patient cannot access admin pages
 *   Property 3: Pharmacist can access all pages
 *   Property 4: Authenticated user on login page redirects to role-appropriate home
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { runAuthGuard, ADMIN_PAGES, SHARED_PAGES } from '../../utils/auth-guard-logic'

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

interface UserSession {
  id: number
  fullName: string
  email: string
  role: 'pharmacist' | 'patient'
  isActive: boolean
  avatarUrl?: string | null
}

/** Generates a valid pharmacist session object */
function arbitraryPharmacistSession(): fc.Arbitrary<UserSession> {
  return fc.record({
    id: fc.integer({ min: 1, max: 1_000_000 }),
    fullName: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    email: fc.emailAddress(),
    role: fc.constant<'pharmacist'>('pharmacist'),
    isActive: fc.boolean(),
    avatarUrl: fc.option(fc.webUrl(), { nil: null }),
  })
}

/** Generates a valid patient session object */
function arbitraryPatientSession(): fc.Arbitrary<UserSession> {
  return fc.record({
    id: fc.integer({ min: 1, max: 1_000_000 }),
    fullName: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    email: fc.emailAddress(),
    role: fc.constant<'patient'>('patient'),
    isActive: fc.boolean(),
    avatarUrl: fc.option(fc.webUrl(), { nil: null }),
  })
}

/** Generates a valid session for either role */
function arbitrarySession(): fc.Arbitrary<UserSession> {
  return fc.oneof(arbitraryPharmacistSession(), arbitraryPatientSession())
}

// ---------------------------------------------------------------------------
// Property 1: Unauthenticated access always redirects to login
// Feature: role-based-access-control, Property 1: Unauthenticated access always redirects to login
// Validates: Requirements 1.1, 1.5
// ---------------------------------------------------------------------------

describe('Property 1: Unauthenticated access always redirects to login', () => {
  it('redirects to "/" for any protected/shared route with null or malformed session', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_PAGES, ...SHARED_PAGES),
        fc.oneof(fc.constant(null), fc.string()), // null or any arbitrary string (likely malformed)
        (path, sessionRaw) => {
          const result = runAuthGuard(path, sessionRaw)
          return result.redirect === '/'
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 2: Patient cannot access admin pages
// Feature: role-based-access-control, Property 2: Patient cannot access admin pages
// Validates: Requirements 1.2
// ---------------------------------------------------------------------------

describe('Property 2: Patient cannot access admin pages', () => {
  it('redirects to "/chat" for any admin page with a valid patient session', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_PAGES),
        arbitraryPatientSession(),
        (path, session) => {
          const result = runAuthGuard(path, JSON.stringify(session))
          return result.redirect === '/chat'
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 3: Pharmacist can access all pages
// Feature: role-based-access-control, Property 3: Pharmacist can access all pages
// Validates: Requirements 1.3
// ---------------------------------------------------------------------------

describe('Property 3: Pharmacist can access all pages', () => {
  it('allows access for any admin or shared page with a valid pharmacist session', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_PAGES, ...SHARED_PAGES),
        arbitraryPharmacistSession(),
        (path, session) => {
          const result = runAuthGuard(path, JSON.stringify(session))
          return result.allowed === true
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 4: Authenticated user on login page redirects to role-appropriate home
// Feature: role-based-access-control, Property 4: Authenticated user on login page redirects to role-appropriate home
// Validates: Requirements 1.4, 4.1, 4.2
// ---------------------------------------------------------------------------

describe('Property 4: Authenticated user on login page redirects to role-appropriate home', () => {
  it('redirects pharmacist to "/dashboard" and patient to "/chat" when accessing "/"', () => {
    fc.assert(
      fc.property(
        arbitrarySession(),
        (session) => {
          const result = runAuthGuard('/', JSON.stringify(session))
          const expected = session.role === 'pharmacist' ? '/dashboard' : '/chat'
          return result.redirect === expected
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Helper: processLoginResponse
// ---------------------------------------------------------------------------

/**
 * Represents the shape of a login API response user object.
 */
interface LoginApiUser {
  id?: number | null
  fullName?: string | null
  email?: string | null
  role?: string | null
  isActive?: boolean
  avatarUrl?: string | null
}

interface LoginApiResponse {
  success: boolean
  user?: LoginApiUser
}

interface LoginProcessResult {
  success: boolean
  sessionSaved: boolean
  errorMessage?: string
}

/**
 * Pure helper that mirrors the handleLogin logic in pages/index.vue.
 *
 * Rules:
 * - If response.success is false or user is missing → failure
 * - If required fields (id, fullName, email, role) are missing → failure with 'ข้อมูลผู้ใช้ไม่ครบถ้วน'
 * - If apiResponse.user.role !== selectedRole → failure with 'role ไม่ตรงกัน'
 * - Otherwise → success, sessionSaved = true
 */
export function processLoginResponse(
  apiResponse: LoginApiResponse,
  selectedRole: string,
): LoginProcessResult {
  if (!apiResponse.success || !apiResponse.user) {
    return { success: false, sessionSaved: false }
  }

  const userData = apiResponse.user

  // Validate required fields
  if (!userData.id || !userData.fullName || !userData.email || !userData.role) {
    return {
      success: false,
      sessionSaved: false,
      errorMessage: 'ข้อมูลผู้ใช้ไม่ครบถ้วน กรุณาลองอีกครั้ง',
    }
  }

  // Check role mismatch
  if (userData.role !== selectedRole) {
    return {
      success: false,
      sessionSaved: false,
      errorMessage: 'role ไม่ตรงกัน',
    }
  }

  return { success: true, sessionSaved: true }
}

// ---------------------------------------------------------------------------
// Property 9: Role mismatch at login is rejected
// Feature: role-based-access-control, Property 9: Role mismatch at login is rejected
// Validates: Requirements 4.3
// ---------------------------------------------------------------------------

/** Generates a valid user object with a specific role */
function arbitraryUserWithRole(role: 'pharmacist' | 'patient') {
  return fc.record({
    id: fc.integer({ min: 1, max: 1_000_000 }),
    fullName: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
    email: fc.emailAddress(),
    role: fc.constant(role),
    isActive: fc.boolean(),
    avatarUrl: fc.option(fc.webUrl(), { nil: null }),
  })
}

describe('Property 9: Role mismatch at login is rejected', () => {
  it('rejects login when API response role differs from selected role (pharmacist user, patient selected)', () => {
    fc.assert(
      fc.property(
        arbitraryUserWithRole('pharmacist'),
        (user) => {
          const apiResponse: LoginApiResponse = { success: true, user }
          const result = processLoginResponse(apiResponse, 'patient')
          return result.success === false && result.sessionSaved === false
        },
      ),
      { numRuns: 100 },
    )
  })

  it('rejects login when API response role differs from selected role (patient user, pharmacist selected)', () => {
    fc.assert(
      fc.property(
        arbitraryUserWithRole('patient'),
        (user) => {
          const apiResponse: LoginApiResponse = { success: true, user }
          const result = processLoginResponse(apiResponse, 'pharmacist')
          return result.success === false && result.sessionSaved === false
        },
      ),
      { numRuns: 100 },
    )
  })

  it('allows login when API response role matches selected role', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<'pharmacist' | 'patient'>('pharmacist', 'patient').chain((role) =>
          arbitraryUserWithRole(role).map((user) => ({ user, role })),
        ),
        ({ user, role }) => {
          const apiResponse: LoginApiResponse = { success: true, user }
          const result = processLoginResponse(apiResponse, role)
          return result.success === true && result.sessionSaved === true
        },
      ),
      { numRuns: 100 },
    )
  })
})
