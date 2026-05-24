import { defineEventHandler } from 'h3'
import { db } from '../../drizzle/db'
import { products as productsTable } from '../../drizzle/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .orderBy(asc(productsTable.id))

    return {
      success: true,
      products,
    }
  } catch (error: any) {
    console.error('API Error /api/products:', error)
    return {
      success: false,
      error: error.message || 'Internal Server Error',
    }
  }
})
