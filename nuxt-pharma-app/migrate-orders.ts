import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL || ''
const sql = postgres(connectionString, { prepare: false })

async function migrate() {
  try {
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER`
    console.log('✅ Added user_id column')
    
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT`
    console.log('✅ Added shipping_address column')
    
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS note TEXT`
    console.log('✅ Added note column')
    
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `
    console.log('\nOrders table columns:')
    cols.forEach((c: any) => console.log(`  ${c.column_name}: ${c.data_type}`))
    console.log('\n✅ Migration complete!')
  } catch (err: any) {
    console.error('❌ Migration error:', err.message)
  } finally {
    await sql.end()
  }
}

migrate()
