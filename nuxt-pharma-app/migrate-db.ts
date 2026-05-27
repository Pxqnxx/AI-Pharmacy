import 'dotenv/config'
import postgres from 'postgres'

async function runMigration() {
  const connectionString = process.env.DATABASE_URL || ''
  console.log('🔄 Running manual SQL migration for users table on Supabase...')
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set in environment variables')
    process.exit(1)
  }

  const client = postgres(connectionString, { prepare: false })

  try {
    // Drop the existing users table if it has outdated schema
    console.log('⚠️ Dropping old users table if exists...')
    await client`DROP TABLE IF EXISTS users CASCADE;`
    
    // Recreate the users table with full schema matching drizzle/schema.ts
    console.log('🛠️ Creating users table with the updated schema...')
    await client`
      CREATE TABLE users (
        id                  SERIAL PRIMARY KEY,
        full_name           TEXT NOT NULL,
        phone               VARCHAR(256),
        email               TEXT NOT NULL UNIQUE,
        password            TEXT NOT NULL,
        role                TEXT NOT NULL,
        is_active           BOOLEAN NOT NULL DEFAULT TRUE,
        avatar_url          TEXT,
        created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login_at       TIMESTAMP,
        congenital_diseases TEXT,
        drug_allergies      TEXT,
        weight              TEXT,
        height              TEXT,
        blood_pressure      TEXT,
        heart_rate          TEXT,
        medications         TEXT
      );
    `
    console.log('✅ Users table successfully created with all columns!')
    console.log('   Columns: id, full_name, phone, email, password, role,')
    console.log('            is_active, avatar_url, created_at, updated_at, last_login_at')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await client.end()
    console.log('🔒 Database connection closed')
  }
}

runMigration()

