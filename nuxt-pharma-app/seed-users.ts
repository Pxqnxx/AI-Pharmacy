import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from './drizzle/schema'

async function seedUsers() {
  const connectionString = process.env.DATABASE_URL || ''
  console.log('🌱 Inserting default demo users into Supabase...')
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set in environment variables')
    process.exit(1)
  }

  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client)

  try {
    // Delete existing users first to ensure a clean state
    await db.delete(users)
    
    await db.insert(users).values([
      {
        fullName: 'ระบบจัดการแอดมิน',
        phone: '081-234-5678',
        email: 'admin@pharmaai.com',
        password: '12345678',
        role: 'pharmacist',
        isActive: true,
        avatarUrl: null,
      },
      {
        fullName: 'คุณ ณิชชา',
        phone: '089-876-5432',
        email: 'nichcha@pharmaai.com',
        password: '12345678',
        role: 'patient',
        isActive: true,
        avatarUrl: null,
        congenitalDiseases: 'โรคเบาหวาน, โรคไขมันในเลือดสูง',
        drugAllergies: 'กลุ่มยาเพนิซิลลิน (Penicillin), ยาแอสไพริน',
        weight: '58',
        height: '165',
        bloodPressure: '120/80',
        heartRate: '72',
        medications: 'Atorvastatin 20mg (ยาลดไขมันในเลือด) • ทานวันละ 1 เม็ด • 6 เดือน • ทานก่อนนอน\nMetformin 500mg (ยาควบคุมระดับน้ำตาล) • ทานวันละ 2 เม็ด ครั้งละ 1 เม็ด • 3 เดือน • ทานหลังอาหารเช้าและเย็นทันที\nVitamin C 1000mg • ทานวันละ 1 เม็ด • 1 เดือน • ทานหลังอาหารเช้า',
      }
    ])
    
    console.log('✅ Default demo users successfully seeded in Supabase!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await client.end()
    console.log('🔒 Database connection closed')
  }
}

seedUsers()
