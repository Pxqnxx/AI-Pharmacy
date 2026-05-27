import { defineNuxtPlugin, useRouter, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
import { ADMIN_PAGES, PUBLIC_PAGES } from '~/utils/auth-guard-logic'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { getSession, clearSession } = useAuth()

  // Enforce auth check immediately on initial client-side load (hard refresh/direct URL access)
  let path = window.location.pathname
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }
  const isPublicPage = (PUBLIC_PAGES as readonly string[]).includes(path)

  if (!isPublicPage) {
    const session = getSession()
    if (!session) {
      clearSession()
      window.location.href = '/'
      return
    }
    const isAdminPage = (ADMIN_PAGES as readonly string[]).includes(path)
    if (isAdminPage && session.role !== 'pharmacist') {
      window.location.href = '/chat'
      return
    }
  } else {
    // On a public page: if already logged in, redirect to respective role-home
    const session = getSession()
    if (session) {
      const destination = session.role === 'pharmacist' ? '/dashboard' : '/chat'
      window.location.href = destination
      return
    }
  }
})
