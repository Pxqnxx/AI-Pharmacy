import { defineEventHandler } from 'h3'
import { db } from '../../drizzle/db'
import { orders as ordersTable, products as productsTable } from '../../drizzle/schema'
import { eq, ne, desc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    // 1. Calculate Revenue (sum of totals from non-cancelled orders)
    const revenueResult = await db
      .select({ sum: sql<number>`sum(${ordersTable.total})` })
      .from(ordersTable)
      .where(ne(ordersTable.status, 'cancelled'))
    
    const totalRevenue = revenueResult[0]?.sum || 0

    // 2. Count total orders
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(ordersTable)
    
    const totalOrdersCount = countResult[0]?.count || 0

    // 3. Count pending orders
    const pendingResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(ordersTable)
      .where(eq(ordersTable.status, 'pending'))
    
    const pendingOrdersCount = pendingResult[0]?.count || 0

    // 4. Retrieve Top 5 Selling Medications
    const topMedicinesList = await db
      .select({
        name: productsTable.name,
        sold: productsTable.sold,
      })
      .from(productsTable)
      .orderBy(desc(productsTable.sold))
      .limit(5)

    // Predefined visual color palette for MD3 charts
    const colors = [
      { color: '#0f766e', hoverColor: '#14b8a6' },
      { color: '#0284c7', hoverColor: '#38bdf8' },
      { color: '#4f46e5', hoverColor: '#6366f1' },
      { color: '#b45309', hoverColor: '#f59e0b' },
      { color: '#be123c', hoverColor: '#f43f5e' },
    ]

    const topMedicines = topMedicinesList.map((med, index) => ({
      name: med.name,
      value: med.sold,
      color: colors[index]?.color || '#0f766e',
      hoverColor: colors[index]?.hoverColor || '#14b8a6',
    }))

    // 5. Retrieve 5 Recent Transactions from Database
    const recentOrders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.date))
      .limit(5)

    // 6. Retrieve Critical Low-Stock Products (stock <= 10)
    const lowStockProducts = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        stock: productsTable.stock,
        unit: productsTable.unit,
        brand: productsTable.brand,
      })
      .from(productsTable)
      .where(sql`${productsTable.stock} <= 10`)
      .orderBy(productsTable.stock)
      .limit(5)

    return {
      success: true,
      user: {
        id: 'admin-001',
        name: 'ระบบจัดการแอดมิน',
        email: 'admin@pharmaai.com',
        role: 'มุมมองเภสัชกร',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxBLu7zT0jTqNe9TQngx_J3GsfySpVE1lxQOQcyZ26mDVejD0RSPb0PbLj_CmweAklHmXVk6Rq8PySysYwweBHZTpa1gM5nY3MLsyhR2piDo8G5_2CcRKIQvH9mil3m5cuncmBpdlYkKDqXy5uXKzvAMpDT4Q_HYOg3jMsf0h5eaWlNHSbefzMJsW28xyegn8TLNclHVeZWHnfuGh4X6Ut68qMU2Np6osxSQGQoSqqCpz9gcpGwCRwtioxqe5UbNOfItS333ifggY',
        version: 'v1.0.4',
      },
      kpis: [
        {
          id: 'revenue',
          label: 'รายได้รวม',
          value: totalRevenue.toLocaleString(),
          unit: 'THB',
          icon: 'payments',
          trend: {
            percentage: 12,
            direction: 'up',
          },
        },
        {
          id: 'orders',
          label: 'คำสั่งซื้อทั้งหมด',
          value: totalOrdersCount,
          icon: 'shopping_bag',
          status: `รอดำเนินการ: ${pendingOrdersCount}`,
        },
        {
          id: 'active-consultations',
          label: 'การปรึกษา AI ที่กำลังใช้งาน',
          value: 32,
          icon: 'group',
          status: 'ระบบปกติ',
          statusIcon: 'check_circle',
        },
      ],
      topMedicines,
      recentOrders,
      lowStockProducts,
    }
  } catch (error: any) {
    console.error('API Error /api/dashboard:', error)
    return {
      success: false,
      error: error.message || 'Internal Server Error',
    }
  }
})
