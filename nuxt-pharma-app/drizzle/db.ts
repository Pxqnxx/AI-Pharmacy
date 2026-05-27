import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || ''

if (!connectionString) {
  console.warn('⚠️ Warning: DATABASE_URL is not defined in environment variables.')
}

// Disable prefetch as Supabase uses connection pooling (e.g. PgBouncer/Supabase pooler) 
// which doesn't support prefetch protocol (prepared statements on session level).
// Also explicitly set search_path=public to avoid resolving 'users' to auth.users (Supabase internal table)
const client = postgres(connectionString, {
  prepare: false,
  connection: {
    search_path: 'public',  // Force Drizzle to always use public schema
  },
})

export const db = drizzle(client)
export { client }
