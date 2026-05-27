/**
 * Property-based tests for composables/useAuth.ts — session validation
 *
 * Feature: role-based-access-control
 * Property 10: Session contains all required fields after login
 *
 * Validates: Requirements 4.4
 *
 * Uses fast-check to generate arbitrary session objects and verify that
 * getSession() returns null whenever any required field is missing or invalid.
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'

// ---------------------------------------------------------------------------
// Inline the same validation logic as composables/useAuth.ts
// (avoids Nuxt auto-import issues in plain Vitest environment)
// ---------------------------------------------------------------------------

const SESSION_KEY = 'user'

interface UserSession {
  id: number
  fullName: string
  email: string
  role: 'pharmacist' | 'patient'
  isActive: boolean
  avatarUrl?: string | null
}

function isValidSession(data: unknown): data is UserSession {
  if (!data || typeof data !== 'object') return false
  const obj = data as Record<string, unknown>
  if (obj.id == null) return false
  if (!obj.fullName || typeof obj.fullName !== 'string' || obj.fullName.trim() === '') return false
  if (!obj.email || typeof obj.email !== 'string') return false
  if (!obj.role || typeof obj.role !== 'string') return false
  if (obj.role !== 'pharmacist' && obj.role !== 'patient') return false
  return true
}

function makeGetSession(storage: Record<string, string>) {
  return function getSession(): UserSession | null {
    const raw = storage[SESSION_KEY] ?? null
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      if (!isValidSession(parsed)) return null
      return parsed
    } catch {
      return null
    }
  }
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Generates a valid UserSession object */
const arbitraryValidSession = (): fc.Arbitrary<UserSession> =>
  fc.record({
    id: fc.integer({ min: 1, max: 1_000_000 }),
    fullName: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    email: fc.emailAddress(),
    role: fc.constantFrom<'pharmacist' | 'patient'>('pharmacist', 'patient'),
    isActive: fc.boolean(),
    avatarUrl: fc.option(fc.webUrl(), { nil: null }),
  })

/** Generates a session object with one required field removed */
const arbitrarySessionMissingField = (): fc.Arbitrary<Record<string, unknown>> => {
  const requiredFields = ['id', 'fullName', 'email', 'role'] as const
  return fc.tuple(
    arbitraryValidSession(),
    fc.constantFrom(...requiredFields),
  ).map(([session, fieldToRemove]) => {
    const copy = { ...session } as Record<string, unknown>
    delete copy[fieldToRemove]
    return copy
  })
}

/** Generates a session with an invalid role value */
const arbitrarySessionWithInvalidRole = (): fc.Arbitrary<Record<string, unknown>> =>
  fc.tuple(
    arbitraryValidSession(),
    fc.string().filter(s => s !== 'pharmacist' && s !== 'patient'),
  ).map(([session, badRole]) => ({ ...session, role: badRole }))

/** Generates a session with an empty or whitespace-only fullName */
const arbitrarySessionWithEmptyFullName = (): fc.Arbitrary<Record<string, unknown>> =>
  fc.tuple(
    arbitraryValidSession(),
    fc.stringMatching(/^\s*$/), // empty or whitespace only
  ).map(([session, emptyName]) => ({ ...session, fullName: emptyName }))

// ---------------------------------------------------------------------------
// Property 10: Session contains all required fields after login
// Feature: role-based-access-control, Property 10: Session contains all required fields after login
// Validates: Requirements 4.4
// ---------------------------------------------------------------------------

describe('Property 10: Session validation — getSession() returns null for invalid sessions', () => {
  it('returns a valid session for any well-formed session object', () => {
    fc.assert(
      fc.property(arbitraryValidSession(), (session) => {
        const getSession = makeGetSession({ [SESSION_KEY]: JSON.stringify(session) })
        const result = getSession()
        return (
          result !== null &&
          result.id === session.id &&
          result.fullName === session.fullName &&
          result.email === session.email &&
          result.role === session.role
        )
      }),
      { numRuns: 100 },
    )
  })

  it('returns null for any session missing a required field', () => {
    fc.assert(
      fc.property(arbitrarySessionMissingField(), (incompleteSession) => {
        const getSession = makeGetSession({ [SESSION_KEY]: JSON.stringify(incompleteSession) })
        return getSession() === null
      }),
      { numRuns: 100 },
    )
  })

  it('returns null for any session with an invalid role value', () => {
    fc.assert(
      fc.property(arbitrarySessionWithInvalidRole(), (badSession) => {
        const getSession = makeGetSession({ [SESSION_KEY]: JSON.stringify(badSession) })
        return getSession() === null
      }),
      { numRuns: 100 },
    )
  })

  it('returns null for any session with an empty or whitespace-only fullName', () => {
    fc.assert(
      fc.property(arbitrarySessionWithEmptyFullName(), (badSession) => {
        const getSession = makeGetSession({ [SESSION_KEY]: JSON.stringify(badSession) })
        return getSession() === null
      }),
      { numRuns: 100 },
    )
  })

  it('returns null for any non-object JSON value stored as session', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('null'),
          fc.constant('"a string"'),
          fc.constant('42'),
          fc.constant('true'),
          fc.constant('[]'),
        ),
        (rawValue) => {
          const getSession = makeGetSession({ [SESSION_KEY]: rawValue })
          return getSession() === null
        },
      ),
      { numRuns: 100 },
    )
  })
})
