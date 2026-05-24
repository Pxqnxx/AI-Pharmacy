import { defineEventHandler } from 'h3'
import { db } from '../../drizzle/db'
import { orders as ordersTable, products as productsTable } from '../../drizzle/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    // 1. Fetch all orders and products from database
    const allOrders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.date), desc(ordersTable.id))

    const allProducts = await db
      .select()
      .from(productsTable)

    // Create a quick lookup for product names
    const productLookup: Record<string, string> = {}
    allProducts.forEach((p) => {
      productLookup[p.id] = p.name
    })

    // 2. Map database status to UI tab values
    // DB values: 'delivered', 'pending', 'cancelled'
    // UI values: 'completed', 'processing', 'cancelled'
    const statusMapping: Record<string, string> = {
      delivered: 'completed',
      pending: 'processing',
      cancelled: 'cancelled',
    }

    // 3. Format orders for the frontend view
    const formattedOrders = allOrders.map((o) => {
      const itemsList = (o.items as any[]) || []
      const primaryItem = itemsList[0]
      const primaryProductName = primaryItem ? (productLookup[primaryItem.product_id] || 'สินค้าทางการแพทย์') : 'ไม่มีรายการสินค้า'

      let computedProductName = primaryProductName
      if (itemsList.length > 1) {
        computedProductName += ` และอื่นๆ`
      }

      const totalQuantity = itemsList.reduce((acc, item) => acc + (item.qty || 0), 0)

      // Convert DB date format (YYYY-MM-DD) to a beautiful Thai display style (e.g. 22 พ.ค. 2569)
      let displayDate = o.date
      try {
        const parts = o.date.split('-')
        if (parts.length === 3) {
          const monthsThai = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
          ]
          const part0 = parts[0] || ''
          const part1 = parts[1] || ''
          const part2 = parts[2] || ''
          const year = parseInt(part0) + 543 // Buddhist Era
          const month = monthsThai[parseInt(part1) - 1] || ''
          const day = parseInt(part2)
          displayDate = `${day} ${month} ${year}`
        }
      } catch (err) {
        // Fallback to raw date string if parsing fails
      }

      return {
        id: o.id.replace('O', 'PAI-'), // e.g. O001 -> PAI-001
        status: statusMapping[o.status] || o.status,
        date: displayDate,
        price: o.total,
        productName: computedProductName,
        quantity: totalQuantity,
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
