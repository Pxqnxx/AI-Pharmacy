/**
 * Property-based tests for server-side API protection (via utils/server-auth-logic.ts)
 *
 * Feature: role-based-access-control
 *
 * Properties tested:
 *   Property 11: Admin API returns 401 for unauthenticated requests
 *   Property 12: Admin API returns 403 for patient requests
 *   Property 13: Symptoms API is accessible to all authenticated roles
 *
 * Validates: Requirements 5.1, 5.2, 5.4
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import {
  runServerAuthCheck,
  ADMIN_API_PATHS,
  SYMPTOMS_API_PATH,
  type RequestHeaders,
} from '../../utils/server-auth-logic'

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Generates a valid patient session headers object */
function arbitraryPatientHeaders(): fc.Arbitrary<RequestHeaders> {
  return fc.record({
    'x-user-role': fc.constant('patient'),
    'x-user-id': fc.integer({ min: 1, max: 1_000_000 }).map(String),
  })
}

/** Generates a valid pharmacist session headers object */
function arbitraryPharmacistHeaders(): fc.Arbitrary<RequestHeaders> {
  return fc.record({
    'x-user-role': fc.constant('pharmacist'),
    'x-user-id': fc.integer({ min: 1, max: 1_000_000 }).map(String),
  })
}

/** Generates headers for any authenticated role (pharmacist or patient) */
function arbitraryAuthenticatedHeaders(): fc.Arbitrary<RequestHeaders> {
  return fc.oneof(arbitraryPharmacistHeaders(), arbitraryPatientHeaders())
}

// ---------------------------------------------------------------------------
// Property 11: Admin API returns 401 for unauthenticated requests
// Feature: role-based-access-control, Property 11: Admin API returns 401 for unauthenticated requests
// Validates: Requirements 5.1
// ---------------------------------------------------------------------------

describe('Property 11: Admin API returns 401 for unauthenticated requests', () => {
  it('returns 401 for any admin API path with no session headers', () => {
    /**
     * **Validates: Requirements 5.1**
     *
     * For any admin API endpoint path and any request without valid session headers,
     * the server should respond with HTTP status 401.
     */
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_API_PATHS),
        (apiPath) => {
          const result = runServerAuthCheck(apiPath, {})
          return result.status === 401
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns 401 for any admin API path with only x-user-role header (missing x-user-id)', () => {
    /**
     * **Validates: Requirements 5.1**
     *
     * Partial headers (only role, no id) should also be treated as unauthenticated.
     */
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_API_PATHS),
        fc.string({ minLength: 1 }),
        (apiPath, role) => {
          const result = runServerAuthCheck(apiPath, { 'x-user-role': role })
          return result.status === 401
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns 401 for any admin API path with only x-user-id header (missing x-user-role)', () => {
    /**
     * **Validates: Requirements 5.1**
     *
     * Partial headers (only id, no role) should also be treated as unauthenticated.
     */
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_API_PATHS),
        fc.integer({ min: 1, max: 1_000_000 }).map(String),
        (apiPath, userId) => {
          const result = runServerAuthCheck(apiPath, { 'x-user-id': userId })
          return result.status === 401
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 12: Admin API returns 403 for patient requests
// Feature: role-based-access-control, Property 12: Admin API returns 403 for patient requests
// Validates: Requirements 5.2
// ---------------------------------------------------------------------------

describe('Property 12: Admin API returns 403 for patient requests', () => {
  it('returns 403 for any admin API path with a valid patient session', () => {
    /**
     * **Validates: Requirements 5.2**
     *
     * For any admin API endpoint path and any request with a valid patient session header,
     * the server should respond with HTTP status 403.
     */
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_API_PATHS),
        arbitraryPatientHeaders(),
        (apiPath, headers) => {
          const result = runServerAuthCheck(apiPath, headers)
          return result.status === 403
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 13: Symptoms API is accessible to all authenticated roles
// Feature: role-based-access-control, Property 13: Symptoms API is accessible to all authenticated roles
// Validates: Requirements 5.4
// ---------------------------------------------------------------------------

describe('Property 13: Symptoms API is accessible to all authenticated roles', () => {
  it('allows /api/symptoms for any authenticated session (pharmacist or patient)', () => {
    /**
     * **Validates: Requirements 5.4**
     *
     * For any valid session (pharmacist or patient), a request to /api/symptoms
     * should succeed (be allowed).
     */
    fc.assert(
      fc.property(
        arbitraryAuthenticatedHeaders(),
        (headers) => {
          const result = runServerAuthCheck(SYMPTOMS_API_PATH, headers)
          return result.allowed === true
        },
      ),
      { numRuns: 100 },
    )
  })
})
