import { defineEventHandler, readBody } from 'h3'
import { db } from '../../../drizzle/db'
import { users as usersTable } from '../../../drizzle/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { 
      fullName, 
      phone, 
      congenitalDiseases, 
      drugAllergies, 
      weight, 
      height, 
      bloodPressure, 
      heartRate, 
      email, 
      password, 
      role,
      age,
      gender,
    } = body

    if (!fullName || !email || !password) {
      return {
        success: false,
        error: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, อีเมล, รหัสผ่าน)',
      }
    }

    // Server-side guard: อนุญาตให้สมัครได้เฉพาะ 'patient' เท่านั้น
    if (role && role !== 'patient') {
      return {
        success: false,
        error: 'การสมัครสมาชิกสาธารณะอนุญาตเฉพาะผู้ป่วย/ลูกค้าเท่านั้น',
      }
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return {
        success: false,
        error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว',
      }
    }

    // Insert user — force role to 'patient' always
    const inserted = await db.insert(usersTable).values({
      fullName,
      phone: phone || null,
      congenitalDiseases: congenitalDiseases || null,
      drugAllergies: drugAllergies || null,
      email,
      password,
      role: 'patient',     // บังคับเป็น patient เสมอ ไม่รับค่าจาก request
      isActive: true,
      avatarUrl: null,

      // Save custom registration metrics or use robust fallback values
      weight: weight || null, 
      height: height || null, 
      bloodPressure: bloodPressure || null,
      heartRate: heartRate || null,
      medications: '',
      age: age ? parseInt(age, 10) : null,
      gender: gender || null,
    }).returning({
      id: usersTable.id,
      fullName: usersTable.fullName,
      email: usersTable.email,
      role: usersTable.role,
      isActive: usersTable.isActive,
      createdAt: usersTable.createdAt,
    })

    return {
      success: true,
      message: 'สมัครสมาชิกสำเร็จ!',
      user: inserted[0],
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: error.message || 'Internal Server Error',
    }
  }
})

