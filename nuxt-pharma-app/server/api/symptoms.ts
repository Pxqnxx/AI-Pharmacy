import { defineEventHandler, getQuery } from 'h3'
import { db } from '../../drizzle/db'
import { symptomsFaq as symptomsTable, products as productsTable } from '../../drizzle/schema'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const q = (query.q as string || '').trim().toLowerCase()

    // 1. Fetch all symptoms from database (for fallback search)
    const allSymptoms = await db
      .select()
      .from(symptomsTable)

    // 2. If no query is provided, return all symptoms FAQs (like standard API list)
    if (!q) {
      return {
        success: true,
        symptoms: allSymptoms,
      }
    }

    // 3. Try to call Gemini API
    try {
      const allProducts = await db
        .select()
        .from(productsTable)
      
      const productsContext = allProducts.map(p => 
        `- ID: ${p.id}, ชื่อ: ${p.name}, แบรนด์: ${p.brand}, หมวดหมู่: ${p.category}, ราคา: ฿${p.price}, สต็อกคงเหลือ: ${p.stock} ${p.unit}, รายละเอียด: ${p.description}, วิธีใช้: ${p.usage}, คำเตือน: ${p.warning}`
      ).join('\n')

      const apiKey = 'AIzaSyAjhtPlXa_kH-Q9CmP-WhH-N9W346ftnzM'
      const model = 'gemini-3.1-flash-lite-preview'
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      const systemInstruction = `คุณคือ เภสัชกรอัจฉริยะ (PharmaAI) ของร้านขายยาชื่อ "PharmaAI"
หน้าที่ของคุณคือรับฟังอาการเบื้องต้นจากผู้ใช้ ให้คำแนะนำการดูแลสุขภาพเบื้องต้นอย่างถูกต้องตามหลักการแพทย์ และแนะนำผลิตภัณฑ์เวชภัณฑ์ที่เหมาะสมที่สุดจากรายการยาในคลังสินค้าด้านล่างนี้เท่านั้น (ห้ามแนะนำยาที่ไม่มีในรายการเด็ดขาด)

นี่คือรายการยาเวชภัณฑ์ที่มีอยู่ในคลังสินค้าของเรา:
${productsContext}

คำแนะนำในการตอบกลับ:
1. ตอบกลับเป็นภาษาไทยที่สุภาพ เป็นมิตร และเป็นมืออาชีพ มีความน่าเชื่อถือ
2. อธิบายสาเหตุของอาการเบื้องต้นอย่างเข้าใจง่าย
3. แนะนำยาที่เหมาะสมจากคลังสินค้าด้านบนอย่างเจาะจง (บอกชื่อยา แบรนด์ วิธีใช้ และคำเตือนความปลอดภัยของยานั้นๆ)
4. หากสต็อกของยาตัวนั้นเป็น 0 ให้แจ้งผู้ใช้ว่าสินค้านี้หมดคลังชั่วคราวและแนะนำทางเลือกอื่นที่เหมาะสมแทน
5. ให้คำแนะนำการปฏิบัติตัวเพิ่มเติม (เช่น การพักผ่อน การประคบร้อน/เย็น หรืออาหารที่ควรเลี่ยง)
6. ใส่คำเตือนความปลอดภัย (Disclaimer) เสมอ ว่าเป็นเพียงคำแนะนำประเมินเบื้องต้นโดย AI หากอาการไม่ดีขึ้นหรือรุนแรงขึ้น ควรพบแพทย์หรือเภสัชกรโดยด่วน`

      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemInstruction}\n\nอาการของผู้ป่วย: "${q}"` }
              ]
            }
          ]
        })
      })

      const geminiData = await geminiResponse.json() as any
      const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      if (replyText) {
        return {
          success: true,
          query: q,
          aiReply: replyText,
        }
      }
    } catch (geminiError: any) {
      console.warn('Gemini API call failed, falling back to local search:', geminiError)
    }

    // 4. FALLBACK: Local keyword match search if Gemini fails or returns empty
    const matched = allSymptoms.filter((s) => {
      const keywords = (s.keywords as string[]) || []
      const symptomName = (s.symptom || '').toLowerCase()
      const description = (s.description || '').toLowerCase()
      
      return (
        symptomName.includes(q) ||
        description.includes(q) ||
        keywords.some((k) => k.toLowerCase().includes(q))
      )
    })

    if (matched.length > 0) {
      const bestMatch = matched[0]
      if (bestMatch) {
        const fallbackReply = `จากการประเมินอาการ "${bestMatch.symptom}":\n\n📝 คำอธิบาย: ${bestMatch.description}\n\n💡 คำแนะนำการดูแลสุขภาพเบื้องต้น: ${bestMatch.advice}\n\n⚠️ คำเตือนความปลอดภัย: ${bestMatch.disclaimer}`
        return {
          success: true,
          query: q,
          aiReply: fallbackReply,
          isFallback: true
        }
      }
    }

    const standardFallbackReply = `ผมได้รับข้อมูลอาการ "${q}" แล้วครับ สำหรับอาการนี้เบื้องต้นแนะนำหลีกเลี่ยงปัจจัยกระตุ้น ดื่มน้ำอุ่น และพักผ่อนให้เพียงพอ หากอาการไม่บรรเทาลง หรือทวีความรุนแรงมากขึ้น แนะนำให้เข้ามาปรึกษาแพทย์หรือเภสัชกรโดยตรงนะครับ`
    return {
      success: true,
      query: q,
      aiReply: standardFallbackReply,
      isFallback: true
    }

  } catch (error: any) {
    console.error('API Error /api/symptoms:', error)
    return {
      success: false,
      error: error.message || 'Internal Server Error',
    }
  }
})
