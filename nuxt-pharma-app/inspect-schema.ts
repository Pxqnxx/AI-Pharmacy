import 'dotenv/config'
import postgres from 'postgres'

async function inspectSchema() {
  const connectionString = process.env.DATABASE_URL || ''
  const client = postgres(connectionString, { prepare: false })

  try {
    // ตรวจสอบว่า users table อยู่ใน schema ไหนบ้าง
    const tables = await client`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name = 'users'
      ORDER BY table_schema;
    `
    console.log('📋 Tables named "users" found in schemas:')
    console.table(tables)

    // ดู columns ของ users table ใน public schema
    const columns = await client`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      ORDER BY ordinal_position;
    `
    console.log('\n📊 Columns in public.users:')
    console.table(columns)

    // query จาก public.users โดยตรง
    const rows = await client`SELECT * FROM public.users LIMIT 2;`
    console.log('\n👤 Data in public.users:')
    console.log(rows)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
  }
}

inspectSchema()
