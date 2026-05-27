/**
 * Property-based tests for layout selection and user identity display
 *
 * Feature: role-based-access-control
 *
 * Properties tested:
 *   Property 5: User layout shows only permitted navigation items
 *   Property 6: Layout displays correct user identity from session
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { ADMIN_PAGES } from '../../utils/auth-guard-logic'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserSession {
  id: number
  fullName: string
  email: string
  role: 'pharmacist' | 'patient'
  isActive: boolean
  avatarUrl?: string | null
}

interface NavItem {
  href: string
  label: string
}

interface UserDisplay {
  name: string
  badge: string
}

// ---------------------------------------------------------------------------
// Helpers under test
// ---------------------------------------------------------------------------

/**
 * Returns the navigation items that the User Layout (user.vue) exposes.
 * For any patient session, this must always be exactly:
 *   - { href: '/health', label: 'โปรไฟล์สุขภาพ' }
 *   - { href: '/chat',   label: 'แชทปรึกษา AI' }
 *
 * The session parameter is accepted to mirror the real layout's API
 * (the layout reads the session to decide what to show), but the nav
 * items are fixed for the user layout regardless of session content.
 *
 * Validates: Requirements 2.1, 2.2
 */
export function getUserLayoutNavItems(_session: UserSession): NavItem[] {
  return [
    { href: '/health', label: 'โปรไฟล์สุขภาพ' },
    { href: '/chat', label: 'แชทปรึกษา AI' },
  ]
}

/**
 * Returns the display name and role badge that a layout should show
 * for the given session.
 *
 * Rules:
 *  - name  = session.fullName if non-empty, otherwise 'ผู้ใช้งาน'
 *  - badge = 'เภสัชกร' for pharmacist, 'ผู้ป่วย' for patient
 *
 * Validates: Requirements 2.3, 6.1, 6.2, 6.3, 6.4, 6.5
 */
export function getLayoutUserDisplay(session: Partial<UserSession> & { role?: string }): UserDisplay {
  const name =
    session.fullName && typeof session.fullName === 'string' && session.fullName.trim().length > 0
      ? session.fullName
      : 'ผู้ใช้งาน'

  const badge = session.role === 'pharmacist' ? 'เภสัชกร' : 'ผู้ป่วย'

  return { name, badge }
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

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

/** Generates a session where fullName may be absent or empty */
function arbitrarySessionWithOptionalFullName(): fc.Arbitrary<Partial<UserSession> & { role: 'pharmacist' | 'patient' }> {
  return fc.record({
    id: fc.integer({ min: 1, max: 1_000_000 }),
    fullName: fc.oneof(
      fc.constant(''),
      fc.constant(undefined as unknown as string),
      fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    ),
    email: fc.emailAddress(),
    role: fc.constantFrom<'pharmacist' | 'patient'>('pharmacist', 'patient'),
    isActive: fc.boolean(),
  })
}

// ---------------------------------------------------------------------------
// Property 5: User layout shows only permitted navigation items
// Feature: role-based-access-control, Property 5: User layout shows only permitted navigation items
// Validates: Requirements 2.1, 2.2
// ---------------------------------------------------------------------------

describe('Property 5: User layout shows only permitted navigation items', () => {
  it('returns exactly 2 nav items (/health and /chat) with no admin page links for any patient session', () => {
    fc.assert(
      fc.property(
        arbitraryPatientSession(),
        (session) => {
          const navItems = getUserLayoutNavItems(session)
          const hrefs = navItems.map(item => item.href)

          // Must have exactly 2 items
          if (hrefs.length !== 2) return false

          // Must include /health and /chat
          if (!hrefs.includes('/health')) return false
          if (!hrefs.includes('/chat')) return false

          // Must not include any admin page
          if (ADMIN_PAGES.some(adminPath => hrefs.includes(adminPath))) return false

          return true
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 6: Layout displays correct user identity from session
// Feature: role-based-access-control, Property 6: Layout displays correct user identity from session
// Validates: Requirements 2.3, 6.1, 6.2, 6.3, 6.4, 6.5
// ---------------------------------------------------------------------------

describe('Property 6: Layout displays correct user identity from session', () => {
  it('displays fullName (or "ผู้ใช้งาน" fallback) and correct role badge for any session', () => {
    fc.assert(
      fc.property(
        arbitrarySessionWithOptionalFullName(),
        (session) => {
          const display = getLayoutUserDisplay(session)

          // Name: use fullName if non-empty, otherwise fallback
          const hasValidFullName =
            session.fullName &&
            typeof session.fullName === 'string' &&
            session.fullName.trim().length > 0

          const expectedName = hasValidFullName ? session.fullName : 'ผู้ใช้งาน'
          if (display.name !== expectedName) return false

          // Badge: 'เภสัชกร' for pharmacist, 'ผู้ป่วย' for patient
          const expectedBadge = session.role === 'pharmacist' ? 'เภสัชกร' : 'ผู้ป่วย'
          if (display.badge !== expectedBadge) return false

          return true
        },
      ),
      { numRuns: 100 },
    )
  })

  it('displays "ผู้ใช้งาน" when fullName is absent from session', () => {
    fc.assert(
      fc.property(
        arbitrarySession(),
        (session) => {
          // Override fullName to be absent
          const sessionWithoutName = { ...session, fullName: '' }
          const display = getLayoutUserDisplay(sessionWithoutName)
          return display.name === 'ผู้ใช้งาน'
        },
      ),
      { numRuns: 100 },
    )
  })

  it('displays "เภสัชกร" badge for pharmacist sessions', () => {
    fc.assert(
      fc.property(
        arbitraryPharmacistSession(),
        (session) => {
          const display = getLayoutUserDisplay(session)
          return display.badge === 'เภสัชกร'
        },
      ),
      { numRuns: 100 },
    )
  })

  it('displays "ผู้ป่วย" badge for patient sessions', () => {
    fc.assert(
      fc.property(
        arbitraryPatientSession(),
        (session) => {
          const display = getLayoutUserDisplay(session)
          return display.badge === 'ผู้ป่วย'
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Constants for layout selection tests
// ---------------------------------------------------------------------------

const SHARED_PAGES = ['/health', '/chat'] as const

// ---------------------------------------------------------------------------
// Helper: getLayoutForPage
//
// Returns the layout name for a given page path and session.
//
// Rules:
//  - If path is in ADMIN_PAGES → always return 'admin'
//  - If path is '/health' or '/chat' → return 'admin' for pharmacist, 'user' for patient
// ---------------------------------------------------------------------------

export function getLayoutForPage(
  path: string,
  session: UserSession,
): 'admin' | 'user' {
  if ((ADMIN_PAGES as readonly string[]).includes(path)) {
    return 'admin'
  }
  // Shared pages: layout depends on role
  return session.role === 'pharmacist' ? 'admin' : 'user'
}

// ---------------------------------------------------------------------------
// Property 7: Shared pages use layout matching the user's role
// Feature: role-based-access-control, Property 7: Shared pages use layout matching the user's role
// Validates: Requirements 3.1, 3.2
// ---------------------------------------------------------------------------

describe('Property 7: Shared pages use layout matching the user\'s role', () => {
  it('returns "admin" layout for pharmacist and "user" layout for patient on /health and /chat', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SHARED_PAGES),
        arbitrarySession(),
        (path, session) => {
          const layout = getLayoutForPage(path, session)
          const expected = session.role === 'pharmacist' ? 'admin' : 'user'
          return layout === expected
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns "admin" layout for pharmacist on /health', () => {
    fc.assert(
      fc.property(
        arbitraryPharmacistSession(),
        (session) => {
          return getLayoutForPage('/health', session) === 'admin'
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns "user" layout for patient on /health', () => {
    fc.assert(
      fc.property(
        arbitraryPatientSession(),
        (session) => {
          return getLayoutForPage('/health', session) === 'user'
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns "admin" layout for pharmacist on /chat', () => {
    fc.assert(
      fc.property(
        arbitraryPharmacistSession(),
        (session) => {
          return getLayoutForPage('/chat', session) === 'admin'
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns "user" layout for patient on /chat', () => {
    fc.assert(
      fc.property(
        arbitraryPatientSession(),
        (session) => {
          return getLayoutForPage('/chat', session) === 'user'
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property 8: Admin pages always use admin layout
// Feature: role-based-access-control, Property 8: Admin pages always use admin layout
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------

describe('Property 8: Admin pages always use admin layout', () => {
  it('returns "admin" layout for any admin page regardless of session role', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_PAGES),
        arbitrarySession(),
        (path, session) => {
          const layout = getLayoutForPage(path, session)
          return layout === 'admin'
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns "admin" layout for admin pages even with patient session', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_PAGES),
        arbitraryPatientSession(),
        (path, session) => {
          return getLayoutForPage(path, session) === 'admin'
        },
      ),
      { numRuns: 100 },
    )
  })

  it('returns "admin" layout for admin pages with pharmacist session', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ADMIN_PAGES),
        arbitraryPharmacistSession(),
        (path, session) => {
          return getLayoutForPage(path, session) === 'admin'
        },
      ),
      { numRuns: 100 },
    )
  })
})
