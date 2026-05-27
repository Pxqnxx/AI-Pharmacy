/**
 * Unit tests for middleware/auth-guard.ts — runAuthGuard()
 *
 * Tests cover:
 * - No session → redirect to '/'
 * - Malformed JSON session → redirect to '/'
 * - Session missing required fields → redirect to '/'
 * - Patient accessing admin page → redirect to '/chat'
 * - Pharmacist accessing admin page → allowed
 * - Pharmacist accessing shared page → allowed
 * - Logged-in user accessing '/' → redirect to role-appropriate home
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { describe, it, expect } from 'vitest'
import { runAuthGuard, ADMIN_PAGES, SHARED_PAGES } from '../../utils/auth-guard-logic'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface UserSession {
  id: number
  fullName: string
  email: string
  role: 'pharmacist' | 'patient'
  isActive: boolean
  avatarUrl?: string | null
}

function pharmacistSession(overrides: Partial<UserSession> = {}): string {
  return JSON.stringify({
    id: 1,
    fullName: 'ภก. สมชาย ใจดี',
    email: 'pharmacist@example.com',
    role: 'pharmacist',
    isActive: true,
    ...overrides,
  })
}

function patientSession(overrides: Partial<UserSession> = {}): string {
  return JSON.stringify({
    id: 2,
    fullName: 'นาย สมศักดิ์ รักสุขภาพ',
    email: 'patient@example.com',
    role: 'patient',
    isActive: true,
    ...overrides,
  })
}

// ---------------------------------------------------------------------------
// Requirement 1.1 & 1.5: Unauthenticated / invalid session → redirect '/'
// ---------------------------------------------------------------------------

describe('runAuthGuard — no session', () => {
  it('redirects to "/" when session is null on a protected page', () => {
    const result = runAuthGuard('/dashboard', null)
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when session is null on a shared page', () => {
    const result = runAuthGuard('/chat', null)
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when session is null on /health', () => {
    const result = runAuthGuard('/health', null)
    expect(result.redirect).toBe('/')
  })
})

describe('runAuthGuard — malformed session', () => {
  it('redirects to "/" when session JSON is malformed', () => {
    const result = runAuthGuard('/dashboard', '{not valid json')
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when session is a plain string', () => {
    const result = runAuthGuard('/dashboard', '"just a string"')
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when session is a number', () => {
    const result = runAuthGuard('/dashboard', '42')
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when session is null JSON', () => {
    const result = runAuthGuard('/dashboard', 'null')
    expect(result.redirect).toBe('/')
  })
})

describe('runAuthGuard — session missing required fields', () => {
  it('redirects to "/" when session is missing "role"', () => {
    const raw = JSON.stringify({ id: 1, fullName: 'Test', email: 'test@test.com', isActive: true })
    const result = runAuthGuard('/dashboard', raw)
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when session is missing "id"', () => {
    const raw = JSON.stringify({ fullName: 'Test', email: 'test@test.com', role: 'pharmacist', isActive: true })
    const result = runAuthGuard('/dashboard', raw)
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when session is missing "email"', () => {
    const raw = JSON.stringify({ id: 1, fullName: 'Test', role: 'pharmacist', isActive: true })
    const result = runAuthGuard('/dashboard', raw)
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when session is missing "fullName"', () => {
    const raw = JSON.stringify({ id: 1, email: 'test@test.com', role: 'pharmacist', isActive: true })
    const result = runAuthGuard('/dashboard', raw)
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when fullName is empty string', () => {
    const raw = JSON.stringify({ id: 1, fullName: '', email: 'test@test.com', role: 'pharmacist', isActive: true })
    const result = runAuthGuard('/dashboard', raw)
    expect(result.redirect).toBe('/')
  })

  it('redirects to "/" when role is an unknown value', () => {
    const raw = JSON.stringify({ id: 1, fullName: 'Test', email: 'test@test.com', role: 'admin', isActive: true })
    const result = runAuthGuard('/dashboard', raw)
    expect(result.redirect).toBe('/')
  })
})

// ---------------------------------------------------------------------------
// Requirement 1.2: Patient accessing admin pages → redirect '/chat'
// ---------------------------------------------------------------------------

describe('runAuthGuard — patient on admin pages', () => {
  it('redirects patient to "/chat" when accessing /dashboard', () => {
    const result = runAuthGuard('/dashboard', patientSession())
    expect(result.redirect).toBe('/chat')
  })

  it('redirects patient to "/chat" when accessing /inventory', () => {
    const result = runAuthGuard('/inventory', patientSession())
    expect(result.redirect).toBe('/chat')
  })

  it('redirects patient to "/chat" when accessing /expiry-alerts', () => {
    const result = runAuthGuard('/expiry-alerts', patientSession())
    expect(result.redirect).toBe('/chat')
  })


  it('redirects patient to "/chat" when accessing /settings', () => {
    const result = runAuthGuard('/settings', patientSession())
    expect(result.redirect).toBe('/chat')
  })

  it('redirects patient to "/chat" when accessing /test-products', () => {
    const result = runAuthGuard('/test-products', patientSession())
    expect(result.redirect).toBe('/chat')
  })
})

// ---------------------------------------------------------------------------
// Requirement 1.3: Pharmacist accessing admin pages → allowed
// ---------------------------------------------------------------------------

describe('runAuthGuard — pharmacist on admin pages', () => {
  it('allows pharmacist to access /dashboard', () => {
    const result = runAuthGuard('/dashboard', pharmacistSession())
    expect(result.allowed).toBe(true)
  })

  it('allows pharmacist to access /inventory', () => {
    const result = runAuthGuard('/inventory', pharmacistSession())
    expect(result.allowed).toBe(true)
  })

  it('allows pharmacist to access /expiry-alerts', () => {
    const result = runAuthGuard('/expiry-alerts', pharmacistSession())
    expect(result.allowed).toBe(true)
  })

  it('allows pharmacist to access /orders', () => {
    const result = runAuthGuard('/orders', pharmacistSession())
    expect(result.allowed).toBe(true)
  })

  it('allows pharmacist to access /settings', () => {
    const result = runAuthGuard('/settings', pharmacistSession())
    expect(result.allowed).toBe(true)
  })

  it('allows pharmacist to access /test-products', () => {
    const result = runAuthGuard('/test-products', pharmacistSession())
    expect(result.allowed).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Requirement 1.3: Pharmacist accessing shared pages → allowed
// ---------------------------------------------------------------------------

describe('runAuthGuard — pharmacist on shared pages', () => {
  it('allows pharmacist to access /health', () => {
    const result = runAuthGuard('/health', pharmacistSession())
    expect(result.allowed).toBe(true)
  })

  it('allows pharmacist to access /chat', () => {
    const result = runAuthGuard('/chat', pharmacistSession())
    expect(result.allowed).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Requirement 1.3: Patient accessing shared pages → allowed
// ---------------------------------------------------------------------------

describe('runAuthGuard — patient on shared pages', () => {
  it('allows patient to access /health', () => {
    const result = runAuthGuard('/health', patientSession())
    expect(result.allowed).toBe(true)
  })

  it('allows patient to access /chat', () => {
    const result = runAuthGuard('/chat', patientSession())
    expect(result.allowed).toBe(true)
  })

  it('allows patient to access /orders', () => {
    const result = runAuthGuard('/orders', patientSession())
    expect(result.allowed).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Requirement 1.4: Logged-in user accessing '/' → redirect to role home
// ---------------------------------------------------------------------------

describe('runAuthGuard — logged-in user on login page "/"', () => {
  it('redirects pharmacist from "/" to "/dashboard"', () => {
    const result = runAuthGuard('/', pharmacistSession())
    expect(result.redirect).toBe('/dashboard')
  })

  it('redirects patient from "/" to "/chat"', () => {
    const result = runAuthGuard('/', patientSession())
    expect(result.redirect).toBe('/chat')
  })

  it('allows unauthenticated user to stay on "/"', () => {
    const result = runAuthGuard('/', null)
    expect(result.allowed).toBe(true)
  })

  it('allows user with malformed session to stay on "/"', () => {
    const result = runAuthGuard('/', 'bad json')
    expect(result.allowed).toBe(true)
  })
})
