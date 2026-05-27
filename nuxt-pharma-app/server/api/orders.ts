import { defineEventHandler, readBody, getMethod, getRequestHeader } from 'h3'
import { db } from '../../drizzle/db'
import { orders as ordersTable, products as productsTable } from '../../drizzle/schema'
import { desc, eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // ─── POST METHOD: Place a new order + decrement stock atomically ────────────
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { customerId, paymentMethod, items, total, shippingFee, shippingAddress, note } = body

      // Resolve user ID from request header (set by checkout page)
      const userIdHeader = getRequestHeader(event, 'x-user-id')
      const userId = userIdHeader ? parseInt(userIdHeader, 10) || null : null

      const orderId = 'PAI-' + Math.floor(Math.random() * 900000 + 100000).toString()
      const dateStr = new Date().toISOString().split('T')[0]

      const itemsList: Array<{ product_id: string; qty: number; price: number }> = items || []

      // Use a DB transaction: decrement stock for every item, then insert order
      await db.transaction(async (tx) => {
        for (const item of itemsList) {
          if (!item.product_id || !item.qty || item.qty <= 0) continue

          // Fetch current product to validate stock
          const [product] = await tx
            .select({ id: productsTable.id, stock: productsTable.stock, sold: productsTable.sold })
            .from(productsTable)
            .where(eq(productsTable.id, item.product_id))
            .limit(1)

          if (!product) {
            throw new Error(`ไม่พบสินค้า ID: ${item.product_id}`)
          }

          if (product.stock < item.qty) {
            throw new Error(`สินค้า "${item.product_id}" มีสต็อกไม่เพียงพอ (เหลือ ${product.stock} ชิ้น แต่สั่ง ${item.qty})`)
          }

          // Decrement stock, increment sold count
          await tx
            .update(productsTable)
            .set({
              stock: sql`${productsTable.stock} - ${item.qty}`,
              sold: sql`${productsTable.sold} + ${item.qty}`,
            })
            .where(eq(productsTable.id, item.product_id))
        }

        // Insert the order with userId for per-user history
        await tx.insert(ordersTable).values({
          id: orderId,
          customerId: customerId || null,
          userId: userId,
          date: dateStr,
          status: 'pending',
          paymentMethod: paymentMethod || 'PromptPay',
          items: itemsList,
          total: total || 0,
          shippingFee: shippingFee || 50,
          shippingAddress: shippingAddress || null,
          note: note || null,
        })
      })

      return {
        success: true,
        orderId,
      }
    } catch (err: any) {
      console.error('API Error POST /api/orders:', err)
      return {
        success: false,
        error: err.message || 'Failed to place order in database',
      }
    }
  }

  // ─── PATCH METHOD: Update order status (Pharmacist only) ───────────────────
  if (method === 'PATCH') {
    try {
      const userRoleHeader = getRequestHeader(event, 'x-user-role')
      if (userRoleHeader !== 'pharmacist') {
        return {
          success: false,
          error: 'ไม่มีสิทธิ์ในการเข้าถึงการจัดการนี้',
        }
      }

      const body = await readBody(event)
      const { orderId, status } = body

      if (!orderId || !status) {
        return {
          success: false,
          error: 'ข้อมูลไม่ครบถ้วน',
        }
      }

      // Update order status in DB
      await db
        .update(ordersTable)
        .set({ status })
        .where(eq(ordersTable.id, orderId))

      return {
        success: true,
      }
    } catch (err: any) {
      console.error('API Error PATCH /api/orders:', err)
      return {
        success: false,
        error: err.message || 'Failed to update order status',
      }
    }
  }

  // ─── GET METHOD: Fetch orders, optionally filtered by userId ──────────────
  try {
    const userIdHeader = getRequestHeader(event, 'x-user-id')
    const userRoleHeader = getRequestHeader(event, 'x-user-role')
    const filterUserId = userIdHeader ? parseInt(userIdHeader, 10) || null : null

    // Fetch orders — if a valid userId is present AND user is NOT a pharmacist, filter to that user only
    let allOrders
    if (filterUserId && userRoleHeader !== 'pharmacist') {
      allOrders = await db
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.userId, filterUserId))
        .orderBy(desc(ordersTable.date), desc(ordersTable.id))
    } else {
      allOrders = await db
        .select()
        .from(ordersTable)
        .orderBy(desc(ordersTable.date), desc(ordersTable.id))
    }

    const allProducts = await db.select().from(productsTable)

    // Product name lookup map
    const productLookup: Record<string, { name: string; image?: string; category: string }> = {}
    allProducts.forEach((p) => {
      productLookup[p.id] = { name: p.name, category: p.category }
    })

    // DB status → UI status mapping
    const statusMapping: Record<string, string> = {
      delivered: 'completed',
      pending: 'processing',
      cancelled: 'cancelled',
    }

    // Format orders for frontend
    const formattedOrders = allOrders.map((o) => {
      const itemsList = (o.items as any[]) || []
      const primaryItem = itemsList[0]
      const primaryProduct = primaryItem ? productLookup[primaryItem.product_id] : null
      const primaryProductName = primaryProduct?.name || 'สินค้าทางการแพทย์'

      let computedProductName = primaryProductName
      if (itemsList.length > 1) {
        computedProductName += ` และอีก ${itemsList.length - 1} รายการ`
      }

      const totalQuantity = itemsList.reduce((acc: number, item: any) => acc + (item.qty || 0), 0)

      // Convert YYYY-MM-DD to Thai Buddhist Era display
      let displayDate = o.date
      try {
        const parts = o.date.split('-')
        if (parts.length === 3) {
          const monthsThai = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
          ]
          const year = parseInt(parts[0] || '0') + 543
          const month = monthsThai[parseInt(parts[1] || '1') - 1] || ''
          const day = parseInt(parts[2] || '1')
          displayDate = `${day} ${month} ${year}`
        }
      } catch (_) { /* fallback to raw date */ }

      return {
        id: o.id,
        rawStatus: o.status,
        status: statusMapping[o.status] || o.status,
        date: displayDate,
        rawDate: o.date,
        price: o.total,
        shippingFee: o.shippingFee,
        paymentMethod: o.paymentMethod,
        shippingAddress: (o as any).shippingAddress || null,
        productName: computedProductName,
        quantity: totalQuantity,
        items: itemsList.map((item: any) => ({
          ...item,
          name: productLookup[item.product_id]?.name || item.product_id,
          category: productLookup[item.product_id]?.category || '',
        })),
      }
    })

    return {
      success: true,
      filterTabs: [
        { label: 'ทั้งหมด', value: 'all', isActive: true },
        { label: 'กำลังดำเนินการ', value: 'processing', isActive: false },
        { label: 'สำเร็จแล้ว', value: 'completed', isActive: false },
        { label: 'ยกเลิก', value: 'cancelled', isActive: false },
      ],
      orders: formattedOrders,
    }
  } catch (error: any) {
    console.error('API Error /api/orders:', error)
    return {
      success: false,
      error: error.message || 'Internal Server Error',
    }
  }
})
