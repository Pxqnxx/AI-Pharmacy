/**
 * auth-guard.ts — Global Route Protection Middleware
 *
 * Runs before every client-side navigation. Checks session validity and
 * enforces role-based access control.
 *
 * Pure logic lives in utils/auth-guard-logic.ts for testability.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { ADMIN_PAGES, PUBLIC_PAGES } from '~/utils/auth-guard-logic'

export default defineNuxtRouteMiddleware((to) => {
  // Only run on the client (localStorage is not available during SSR)
  if (!process.client) return

  const { getSession, clearSession } = useAuth()
  const path = to.path

  const isPublicPage = (PUBLIC_PAGES as readonly string[]).includes(path)

  // Public page: check if already logged in → redirect by role
  if (isPublicPage) {
    const session = getSession()
    if (session) {
      const destination = session.role === 'pharmacist' ? '/dashboard' : '/chat'
      return navigateTo(destination)
    }
    return // allow through to login page
  }

  // Protected page: validate session
  const session = getSession()
  if (!session) {
    clearSession()
    return navigateTo('/')
  }

  // Admin page: only pharmacist allowed
  const isAdminPage = (ADMIN_PAGES as readonly string[]).includes(path)
  if (isAdminPage && session.role !== 'pharmacist') {
    return navigateTo('/chat')
  }

  // Allow access
})
