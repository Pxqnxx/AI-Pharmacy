import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || ''

if (!connectionString) {
  console.warn('⚠️ Warning: DATABASE_URL is not defined in environment variables.')
}

// Disable prefetch as Supabase uses connection pooling (e.g. PgBouncer/Supabase pooler) 
// which doesn't support prefetch protocol (prepared statements on session level).
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client)
export { client }
