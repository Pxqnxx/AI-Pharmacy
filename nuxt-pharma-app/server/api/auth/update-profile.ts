import { defineEventHandler, readBody, getRequestHeaders, createError } from 'h3'
import { db } from '../../../drizzle/db'
import { users as usersTable } from '../../../drizzle/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const headers = getRequestHeaders(event) as Record<string, string | undefined>
    const userIdStr = headers['x-user-id']
    const role = headers['x-user-role']

    if (!userIdStr || !role) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Unauthorized',
      })
    }

    const userId = parseInt(userIdStr)
    if (isNaN(userId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid User ID',
      })
    }

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
      medications,
      age,
      gender,
    } = body

    if (fullName !== undefined && fullName.trim() === '') {
      return {
        success: false,
        error: 'ชื่อ-นามสกุลจริงต้องไม่เป็นค่าว่าง',
      }
    }

    // Prepare update parameters
    const updateData: Record<string, any> = {}
    if (fullName !== undefined) updateData.fullName = fullName.trim()
    if (phone !== undefined) updateData.phone = phone.trim() || null
    if (congenitalDiseases !== undefined) updateData.congenitalDiseases = congenitalDiseases.trim() || null
    if (drugAllergies !== undefined) updateData.drugAllergies = drugAllergies.trim() || null
    if (weight !== undefined) updateData.weight = weight.trim() || null
    if (height !== undefined) updateData.height = height.trim() || null
    if (bloodPressure !== undefined) updateData.bloodPressure = bloodPressure.trim() || null
    if (heartRate !== undefined) updateData.heartRate = heartRate.trim() || null
    if (medications !== undefined) updateData.medications = medications.trim() || null
    if (age !== undefined) updateData.age = age ? parseInt(String(age), 10) : null
    if (gender !== undefined) updateData.gender = gender || null

    updateData.updatedAt = new Date()

    // Perform database update
    const updatedUsers = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, userId))
      .returning()

    const updatedUser = updatedUsers[0]
    if (!updatedUser) {
      return {
        success: false,
        error: 'ไม่พบข้อมูลผู้ใช้งานที่ต้องการอัปเดต',
      }
    }

    return {
      success: true,
      message: 'อัปเดตข้อมูลโปรไฟล์สุขภาพสำเร็จ!',
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        avatarUrl: updatedUser.avatarUrl,
        createdAt: updatedUser.createdAt,
        congenitalDiseases: updatedUser.congenitalDiseases,
        drugAllergies: updatedUser.drugAllergies,
        weight: updatedUser.weight,
        height: updatedUser.height,
        bloodPressure: updatedUser.bloodPressure,
        heartRate: updatedUser.heartRate,
        medications: updatedUser.medications,
        age: updatedUser.age,
        gender: updatedUser.gender,
      }
    }
  } catch (error: any) {
    console.error('Update profile API error:', error)
    return {
      success: false,
      error: error.message || 'Internal Server Error',
    }
  }
})
