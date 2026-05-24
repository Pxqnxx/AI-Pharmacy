import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { customers, products, orders, symptomsFaq } from './schema'

async function runSeed() {
  const connectionString = process.env.DATABASE_URL || ''
  console.log('🌱 Starting database seeding...')
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set in environment variables')
    process.exit(1)
  }

  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client)

  try {
    const jsonDir = path.join(process.cwd(), 'JSON')

    // 1. Seed Customers
    console.log('👥 Seeding Customers...')
    const customersRaw = JSON.parse(fs.readFileSync(path.join(jsonDir, 'customers.json'), 'utf-8'))
    const customerRecords = customersRaw.customers.map((c: any) => ({
      id: c.id,
      alias: c.alias,
      ageGroup: c.age_group,
      gender: c.gender,
      healthConditions: c.health_conditions,
      totalOrders: c.total_orders,
      totalSpent: c.total_spent,
      lastOrder: c.last_order,
      preferredPayment: c.preferred_payment,
      preferredCategories: c.preferred_categories,
    }))

    // Truncate and insert to ensure clean state
    await db.delete(orders)
    await db.delete(customers)
    await db.insert(customers).values(customerRecords)
    console.log(`✅ Seeded ${customerRecords.length} customer records`)

    // 2. Seed Products
    console.log('📦 Seeding Products...')
    const productsRaw = JSON.parse(fs.readFileSync(path.join(jsonDir, 'products.json'), 'utf-8'))
    const productRecords = productsRaw.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      type: p.type,
      price: p.price,
      stock: p.stock,
      unit: p.unit,
      expiryDate: p.expiry_date,
      description: p.description,
      usage: p.usage,
      warning: p.warning,
      related: p.related,
      rating: parseFloat(p.rating),
      sold: p.sold,
    }))

    await db.delete(products)
    await db.insert(products).values(productRecords)
    console.log(`✅ Seeded ${productRecords.length} product records`)

    // 3. Seed Orders
    console.log('💳 Seeding Orders...')
    const ordersRaw = JSON.parse(fs.readFileSync(path.join(jsonDir, 'orders.json'), 'utf-8'))
    const orderRecords = ordersRaw.orders.map((o: any) => ({
      id: o.id,
      customerId: o.customer_id,
      date: o.date,
      status: o.status,
      paymentMethod: o.payment_method,
      items: o.items,
      total: o.total,
      shippingFee: o.shipping_fee,
    }))

    await db.insert(orders).values(orderRecords)
    console.log(`✅ Seeded ${orderRecords.length} order records`)

    // 4. Seed Symptoms FAQ
    console.log('💬 Seeding Symptoms FAQ...')
    const symptomsRaw = JSON.parse(fs.readFileSync(path.join(jsonDir, 'symptoms_faq.json'), 'utf-8'))
    const symptomRecords = symptomsRaw.symptoms_faq.map((s: any) => ({
      id: s.id,
      symptom: s.symptom,
      keywords: s.keywords,
      description: s.description,
      relatedCategories: s.related_categories,
      relatedProducts: s.related_products,
      advice: s.advice,
      disclaimer: s.disclaimer,
    }))

    await db.delete(symptomsFaq)
    await db.insert(symptomsFaq).values(symptomRecords)
    console.log(`✅ Seeded ${symptomRecords.length} symptoms FAQ records`)

    console.log('🌱 Seeding process complete!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await client.end()
    console.log('🔒 Database connection closed')
  }
}

runSeed()
