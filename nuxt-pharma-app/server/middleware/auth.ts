/**
 * server/middleware/auth.ts — Server-Side API Protection
 *
 * Nuxt server middleware that protects API endpoints based on user role.
 * Uses the pure helper `runServerAuthCheck` from utils/server-auth-logic.ts
 * for testable logic.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { defineEventHandler, getRequestHeaders, setResponseStatus, sendError, createError } from 'h3'
import { runServerAuthCheck } from '../../utils/server-auth-logic'

export default defineEventHandler((event) => {
  const path = event.path || event.node.req.url || ''

  // Only process /api/* routes
  if (!path.startsWith('/api/')) {
    return
  }

  const headers = getRequestHeaders(event) as Record<string, string | undefined>
  const method = event.node.req.method || ''

  // /api/orders: allow any authenticated user (patient or pharmacist) for both GET and POST
  // - GET: patient sees own order history, pharmacist sees all orders
  // - POST: any authenticated user can place an order
  if (path === '/api/orders') {
    const role = headers['x-user-role']
    const userId = headers['x-user-id']
    if (!role || !userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
      })
    }
    // Both patient and pharmacist are allowed — allow
    return
  }

  const result = runServerAuthCheck(path, headers)

  if (!result.allowed) {
    throw createError({
      statusCode: result.status,
      statusMessage: result.error,
      message: result.error,
    })
  }
})
