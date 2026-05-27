/**
 * Unit tests for server-side API protection (via utils/server-auth-logic.ts)
 *
 * Tests cover:
 * - /api/auth/login does not require session → allowed
 * - /api/auth/register does not require session → allowed
 * - Admin API without headers → 401
 * - Admin API with patient session → 403
 * - Admin API with pharmacist session → allowed
 * - /api/symptoms with patient session → allowed
 * - /api/symptoms without headers → 401
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { describe, it, expect } from 'vitest'
import {
  runServerAuthCheck,
  ADMIN_API_PATHS,
  PUBLIC_API_PATHS,
  SYMPTOMS_API_PATH,
} from '../../utils/server-auth-logic'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const pharmacistHeaders = {
  'x-user-role': 'pharmacist',
  'x-user-id': '1',
}

const patientHeaders = {
  'x-user-role': 'patient',
  'x-user-id': '2',
}

const emptyHeaders = {}

// ---------------------------------------------------------------------------
// Requirement 5.3: Public endpoints — no session required
// ---------------------------------------------------------------------------

describe('runServerAuthCheck — public API paths', () => {
  it('allows /api/auth/login without any session headers', () => {
    const result = runServerAuthCheck('/api/auth/login', emptyHeaders)
    expect(result.allowed).toBe(true)
  })

  it('allows /api/auth/register without any session headers', () => {
    const result = runServerAuthCheck('/api/auth/register', emptyHeaders)
    expect(result.allowed).toBe(true)
  })

  it('allows /api/auth/login even with pharmacist headers', () => {
    const result = runServerAuthCheck('/api/auth/login', pharmacistHeaders)
    expect(result.allowed).toBe(true)
  })

  it('allows /api/auth/register even with patient headers', () => {
    const result = runServerAuthCheck('/api/auth/register', patientHeaders)
    expect(result.allowed).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Requirement 5.1: Admin API without session → 401
// ---------------------------------------------------------------------------

describe('runServerAuthCheck — admin API without headers → 401', () => {
  it('returns 401 for /api/dashboard without headers', () => {
    const result = runServerAuthCheck('/api/dashboard', emptyHeaders)
    expect(result.status).toBe(401)
    expect(result.error).toBe('Unauthorized')
  })

  it('returns 401 for /api/inventory without headers', () => {
    const result = runServerAuthCheck('/api/inventory', emptyHeaders)
    expect(result.status).toBe(401)
    expect(result.error).toBe('Unauthorized')
  })

  it('allows /api/orders without headers (middleware handles auth, not runServerAuthCheck)', () => {
    // NOTE: /api/orders auth is now handled directly by middleware per-method,
    // NOT by runServerAuthCheck. So this function returns allowed:true for any path
    // not in ADMIN_API_PATHS. Middleware enforces the 401 when headers are missing.
    const result = runServerAuthCheck('/api/orders', emptyHeaders)
    expect(result.allowed).toBe(true)
  })

  it('returns 401 for /api/dashboard with only x-user-role (missing x-user-id)', () => {
    const result = runServerAuthCheck('/api/dashboard', { 'x-user-role': 'pharmacist' })
    expect(result.status).toBe(401)
  })

  it('returns 401 for /api/dashboard with only x-user-id (missing x-user-role)', () => {
    const result = runServerAuthCheck('/api/dashboard', { 'x-user-id': '1' })
    expect(result.status).toBe(401)
  })
})

// ---------------------------------------------------------------------------
// Requirement 5.2: Admin API with patient session → 403
// ---------------------------------------------------------------------------

describe('runServerAuthCheck — admin API with patient session → 403', () => {
  it('returns 403 for /api/dashboard with patient session', () => {
    const result = runServerAuthCheck('/api/dashboard', patientHeaders)
    expect(result.status).toBe(403)
    expect(result.error).toBe('Forbidden')
  })

  it('returns 403 for /api/inventory with patient session', () => {
    const result = runServerAuthCheck('/api/inventory', patientHeaders)
    expect(result.status).toBe(403)
    expect(result.error).toBe('Forbidden')
  })

  it('allows /api/orders with patient session (patients can view their own order history)', () => {
    // Business rule changed: patients now have GET access to /api/orders
    // to view their own order history. The middleware handles this directly.
    const result = runServerAuthCheck('/api/orders', patientHeaders)
    expect(result.allowed).toBe(true)
  })

  it('returns 403 for /api/dashboard with unknown role', () => {
    const result = runServerAuthCheck('/api/dashboard', {
      'x-user-role': 'admin',
      'x-user-id': '99',
    })
    expect(result.status).toBe(403)
  })
})

// ---------------------------------------------------------------------------
// Admin API with pharmacist session → allowed
// ---------------------------------------------------------------------------

describe('runServerAuthCheck — admin API with pharmacist session → allowed', () => {
  it('allows /api/dashboard with pharmacist session', () => {
    const result = runServerAuthCheck('/api/dashboard', pharmacistHeaders)
    expect(result.allowed).toBe(true)
  })

  it('allows /api/inventory with pharmacist session', () => {
    const result = runServerAuthCheck('/api/inventory', pharmacistHeaders)
    expect(result.allowed).toBe(true)
  })

  it('allows /api/orders with pharmacist session', () => {
    const result = runServerAuthCheck('/api/orders', pharmacistHeaders)
    expect(result.allowed).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Requirement 5.4: /api/symptoms — accessible to all authenticated roles
// ---------------------------------------------------------------------------

describe('runServerAuthCheck — /api/symptoms', () => {
  it('allows /api/symptoms with patient session', () => {
    const result = runServerAuthCheck('/api/symptoms', patientHeaders)
    expect(result.allowed).toBe(true)
  })

  it('allows /api/symptoms with pharmacist session', () => {
    const result = runServerAuthCheck('/api/symptoms', pharmacistHeaders)
    expect(result.allowed).toBe(true)
  })

  it('returns 401 for /api/symptoms without headers', () => {
    const result = runServerAuthCheck('/api/symptoms', emptyHeaders)
    expect(result.status).toBe(401)
    expect(result.error).toBe('Unauthorized')
  })
})

// ---------------------------------------------------------------------------
// Other paths — always allowed
// ---------------------------------------------------------------------------

describe('runServerAuthCheck — other paths', () => {
  it('allows /api/products without headers', () => {
    const result = runServerAuthCheck('/api/products', emptyHeaders)
    expect(result.allowed).toBe(true)
  })

  it('allows /api/unknown-endpoint without headers', () => {
    const result = runServerAuthCheck('/api/unknown-endpoint', emptyHeaders)
    expect(result.allowed).toBe(true)
  })
})
