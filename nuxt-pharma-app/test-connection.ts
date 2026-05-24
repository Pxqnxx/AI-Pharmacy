import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from './drizzle/schema'

async function testConnection() {
  const connectionString = process.env.DATABASE_URL || ''
  
  console.log('Testing Supabase connection...')
  console.log('Connection string:', connectionString.substring(0, 30) + '...')
  
  try {
    // Disable prefetch as it is not supported for "Transaction" pool mode
    const client = postgres(connectionString, { prepare: false })
    const db = drizzle(client);
    
    console.log('✅ Database connection established')
    
    // Test a simple query
    const result = await db.select().from(users).limit(1);
    console.log('✅ Query executed successfully')
    console.log('Sample data:', result)
    
    await client.end()
    console.log('✅ Connection closed successfully')
    
  } catch (error) {
    console.error('❌ Connection failed:', error)
    throw error
  }
}

testConnection()
