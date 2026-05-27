import { defineEventHandler, readBody } from 'h3'
import { db } from '../../../drizzle/db'
import { users as usersTable } from '../../../drizzle/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, role } = body

    if (!email || !password) {
      return {
        success: false,
        error: 'กรุณากรอกอีเมลและรหัสผ่าน',
      }
    }

    // Find user by email and password
    const matchedUsers = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email),
          eq(usersTable.password, password)
        )
      )
      .limit(1)

    const matchedUser = matchedUsers[0]
    if (!matchedUser) {
      return {
        success: false,
        error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      }
    }

    // Check if account is active
    if (!matchedUser.isActive) {
      return {
        success: false,
        error: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ',
      }
    }

    // ตรวจสอบ role ที่เลือกตรงกับ role ในฐานข้อมูลหรือเปล่า
    if (role && matchedUser.role !== role) {
      const roleLabel = matchedUser.role === 'pharmacist' ? 'เภสัชกร / แอดมิน' : 'ผู้ป่วย / ลูกค้า'
      const selectedLabel = role === 'pharmacist' ? 'เภสัชกร / แอดมิน' : 'ผู้ป่วย / ลูกค้า'
      return {
        success: false,
        error: `บัญชีนี้ลงทะเบียนในฐานะ "${roleLabel}" ไม่ใช่ "${selectedLabel}" กรุณาเลือกประเภทให้ถูกต้อง`,
      }
    }

    // Update lastLoginAt timestamp
    await db
      .update(usersTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(usersTable.id, matchedUser.id))

    return {
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ!',
      user: {
        id: matchedUser.id,
        fullName: matchedUser.fullName,
        phone: matchedUser.phone,
        email: matchedUser.email,
        role: matchedUser.role,
        isActive: matchedUser.isActive,
        avatarUrl: matchedUser.avatarUrl,
        createdAt: matchedUser.createdAt,
        lastLoginAt: new Date(), // ส่งค่า lastLoginAt ที่เพิ่งบันทึก
        congenitalDiseases: matchedUser.congenitalDiseases,
        drugAllergies: matchedUser.drugAllergies,
        weight: matchedUser.weight,
        height: matchedUser.height,
        bloodPressure: matchedUser.bloodPressure,
        heartRate: matchedUser.heartRate,
        medications: matchedUser.medications,
        age: matchedUser.age,
        gender: matchedUser.gender,
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return {
      success: false,
      error: error.message || 'Internal Server Error',
    }
  }
})

