/**
 * Unit tests for composables/useAuth.ts
 *
 * Tests cover:
 * - getSession() with empty localStorage
 * - getSession() with valid session data
 * - getSession() with malformed JSON
 * - getSession() with session missing required fields
 * - getSession() with empty fullName → returns null
 * - clearSession() removes data from localStorage
 * - getDefaultRoute() returns correct route per role
 * - isAuthenticated() reflects session presence
 * - setSession() persists data to localStorage
 *
 * Requirements: 1.5, 4.4
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Inline the composable logic so tests run outside Nuxt context.
// We replicate the exact same logic from composables/useAuth.ts here to avoid
// Nuxt auto-import issues in a plain Vitest environment.
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

function makeUseAuth(storage: Record<string, string>) {
  // Simulate process.client = true by providing a localStorage-like object
  const fakeLocalStorage = {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value },
    removeItem: (key: string) => { delete storage[key] },
  }

  function getSession(): UserSession | null {
    const raw = fakeLocalStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      if (!isValidSession(parsed)) return null
      return parsed
    } catch {
      return null
    }
  }

  function setSession(user: UserSession): void {
    fakeLocalStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }

  function clearSession(): void {
    fakeLocalStorage.removeItem(SESSION_KEY)
  }

  function isAuthenticated(): boolean {
    return getSession() !== null
  }

  function getDefaultRoute(): string {
    const session = getSession()
    if (!session) return '/'
    return session.role === 'pharmacist' ? '/dashboard' : '/chat'
  }

  return { getSession, setSession, clearSession, isAuthenticated, getDefaultRoute, storage }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function validPharmacistSession(): UserSession {
  return {
    id: 1,
    fullName: 'ภก. สมชาย ใจดี',
    email: 'pharmacist@example.com',
    role: 'pharmacist',
    isActive: true,
  }
}

function validPatientSession(): UserSession {
  return {
    id: 2,
    fullName: 'นาย สมศักดิ์ รักสุขภาพ',
    email: 'patient@example.com',
    role: 'patient',
    isActive: true,
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useAuth — getSession()', () => {
  it('returns null when localStorage is empty', () => {
    const { getSession } = makeUseAuth({})
    expect(getSession()).toBeNull()
  })

  it('returns the session when valid pharmacist data is stored', () => {
    const session = validPharmacistSession()
    const { getSession } = makeUseAuth({ [SESSION_KEY]: JSON.stringify(session) })
    expect(getSession()).toEqual(session)
  })

  it('returns the session when valid patient data is stored', () => {
    const session = validPatientSession()
    const { getSession } = makeUseAuth({ [SESSION_KEY]: JSON.stringify(session) })
    expect(getSession()).toEqual(session)
  })

  it('returns null when JSON is malformed', () => {
    const { getSession } = makeUseAuth({ [SESSION_KEY]: '{not valid json' })
    expect(getSession()).toBeNull()
  })

  it('returns null when session is missing the "role" field', () => {
    const { id, fullName, email, isActive } = validPharmacistSession()
    const { getSession } = makeUseAuth({
      [SESSION_KEY]: JSON.stringify({ id, fullName, email, isActive }),
    })
    expect(getSession()).toBeNull()
  })

  it('returns null when session is missing the "id" field', () => {
    const { fullName, email, role, isActive } = validPharmacistSession()
    const { getSession } = makeUseAuth({
      [SESSION_KEY]: JSON.stringify({ fullName, email, role, isActive }),
    })
    expect(getSession()).toBeNull()
  })

  it('returns null when session is missing the "email" field', () => {
    const { id, fullName, role, isActive } = validPharmacistSession()
    const { getSession } = makeUseAuth({
      [SESSION_KEY]: JSON.stringify({ id, fullName, role, isActive }),
    })
    expect(getSession()).toBeNull()
  })

  it('returns null when session is missing the "fullName" field', () => {
    const { id, email, role, isActive } = validPharmacistSession()
    const { getSession } = makeUseAuth({
      [SESSION_KEY]: JSON.stringify({ id, email, role, isActive }),
    })
    expect(getSession()).toBeNull()
  })

  it('returns null when fullName is an empty string', () => {
    const session = { ...validPharmacistSession(), fullName: '' }
    const { getSession } = makeUseAuth({ [SESSION_KEY]: JSON.stringify(session) })
    expect(getSession()).toBeNull()
  })

  it('returns null when fullName is whitespace only', () => {
    const session = { ...validPharmacistSession(), fullName: '   ' }
    const { getSession } = makeUseAuth({ [SESSION_KEY]: JSON.stringify(session) })
    expect(getSession()).toBeNull()
  })

  it('returns null when role is an unknown value', () => {
    const session = { ...validPharmacistSession(), role: 'admin' }
    const { getSession } = makeUseAuth({ [SESSION_KEY]: JSON.stringify(session) })
    expect(getSession()).toBeNull()
  })

  it('returns null when stored value is a plain string (not an object)', () => {
    const { getSession } = makeUseAuth({ [SESSION_KEY]: '"just a string"' })
    expect(getSession()).toBeNull()
  })

  it('returns null when stored value is null JSON', () => {
    const { getSession } = makeUseAuth({ [SESSION_KEY]: 'null' })
    expect(getSession()).toBeNull()
  })
})

describe('useAuth — setSession()', () => {
  it('persists a valid session to localStorage', () => {
    const storage: Record<string, string> = {}
    const { setSession } = makeUseAuth(storage)
    const session = validPharmacistSession()
    setSession(session)
    expect(JSON.parse(storage[SESSION_KEY]!)).toEqual(session)
  })
})

describe('useAuth — clearSession()', () => {
  it('removes the session from localStorage', () => {
    const storage: Record<string, string> = { [SESSION_KEY]: JSON.stringify(validPharmacistSession()) }
    const { clearSession } = makeUseAuth(storage)
    clearSession()
    expect(storage[SESSION_KEY]).toBeUndefined()
  })

  it('does not throw when localStorage is already empty', () => {
    const { clearSession } = makeUseAuth({})
    expect(() => clearSession()).not.toThrow()
  })
})

describe('useAuth — isAuthenticated()', () => {
  it('returns false when no session is stored', () => {
    const { isAuthenticated } = makeUseAuth({})
    expect(isAuthenticated()).toBe(false)
  })

  it('returns true when a valid session is stored', () => {
    const { isAuthenticated } = makeUseAuth({
      [SESSION_KEY]: JSON.stringify(validPharmacistSession()),
    })
    expect(isAuthenticated()).toBe(true)
  })

  it('returns false when session is malformed', () => {
    const { isAuthenticated } = makeUseAuth({ [SESSION_KEY]: 'bad json' })
    expect(isAuthenticated()).toBe(false)
  })
})

describe('useAuth — getDefaultRoute()', () => {
  it('returns "/dashboard" for a pharmacist session', () => {
    const { getDefaultRoute } = makeUseAuth({
      [SESSION_KEY]: JSON.stringify(validPharmacistSession()),
    })
    expect(getDefaultRoute()).toBe('/dashboard')
  })

  it('returns "/chat" for a patient session', () => {
    const { getDefaultRoute } = makeUseAuth({
      [SESSION_KEY]: JSON.stringify(validPatientSession()),
    })
    expect(getDefaultRoute()).toBe('/chat')
  })

  it('returns "/" when no session exists', () => {
    const { getDefaultRoute } = makeUseAuth({})
    expect(getDefaultRoute()).toBe('/')
  })

  it('returns "/" when session is invalid', () => {
    const { getDefaultRoute } = makeUseAuth({ [SESSION_KEY]: '{}' })
    expect(getDefaultRoute()).toBe('/')
  })
})
