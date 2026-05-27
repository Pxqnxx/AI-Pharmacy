import { defineEventHandler, readBody, getMethod } from 'h3'
import { db } from '../../drizzle/db'
import { products as productsTable } from '../../drizzle/schema'
import { asc, eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // ─── PATCH METHOD: Restock or Update product details (Pharmacist only) ─────
  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      const { productId, stockToAdd, name, brand, description, price, stock, category } = body

      if (!productId) {
        return {
          success: false,
          error: 'ข้อมูลไม่ครบถ้วน (ต้องการ productId)',
        }
      }

      // If stockToAdd is provided, perform atomic stock replenishment
      if (typeof stockToAdd === 'number') {
        await db
          .update(productsTable)
          .set({
            stock: sql`${productsTable.stock} + ${stockToAdd}`,
          })
          .where(eq(productsTable.id, productId))
      } else {
        // Otherwise, update general product details
        const updateFields: any = {}
        if (name !== undefined) updateFields.name = name
        if (brand !== undefined) updateFields.brand = brand
        if (description !== undefined) updateFields.description = description
        if (price !== undefined && typeof price === 'number') updateFields.price = price
        if (stock !== undefined && typeof stock === 'number') updateFields.stock = stock
        if (category !== undefined) updateFields.category = category

        if (Object.keys(updateFields).length > 0) {
          await db
            .update(productsTable)
            .set(updateFields)
            .where(eq(productsTable.id, productId))
        }
      }

      return {
        success: true,
      }
    } catch (err: any) {
      console.error('API Error PATCH /api/products:', err)
      return {
        success: false,
        error: err.message || 'Failed to update product details',
      }
    }
  }

  // ─── GET METHOD: Fetch all products ────────────────────────────────────────
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
