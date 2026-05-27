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

    const userRoleHeader = getRequestHeader(event, 'x-user-role')

    // Fetch all products from database (available for both Gemini context and fallback matching)
    const allProducts = await db
      .select()
      .from(productsTable)

    // 3. Try to call Gemini API
    try {
      const productsContext = allProducts.map(p => 
        `- ID: ${p.id}, ชื่อ: ${p.name}, แบรนด์: ${p.brand}, หมวดหมู่: ${p.category}, ราคา: ฿${p.price}, สต็อกคงเหลือ: ${p.stock} ${p.unit}, รายละเอียด: ${p.description}, วิธีใช้: ${p.usage}, คำเตือน: ${p.warning}`
      ).join('\n')

      const apiKey = 'AIzaSyAjhtPlXa_kH-Q9CmP-WhH-N9W346ftnzM'
      const model = 'gemini-3.1-flash-lite-preview'
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      let systemInstruction = ''
      if (userRoleHeader === 'pharmacist') {
        systemInstruction = `คุณคือ "PharmaAI System Assistant" ผู้ช่วยอัจฉริยะประจำระบบจัดการคลังและร้านยาอัจฉริยะ PharmaAI
หน้าที่ของคุณคือช่วยเหลือและตอบคำถามเภสัชกร (แอดมิน) เกี่ยวกับการใช้งานระบบ, การบริหารจัดการคลังสินค้า, วิธีการดูภาพรวมสถิติ, วิธีการจัดการคำสั่งซื้อของลูกค้า, วิธีวิเคราะห์ยาหมดอายุ และให้คำแนะนำเชิงธุรกิจในการเพิ่มประสิทธิภาพของร้านยา

โปรดแนะนำรายละเอียดส่วนต่างๆ ของระบบให้แอดมินทราบดังนี้:
1. หน้าแดชบอร์ดหลัก (Dashboard): แสดงภาพรวมยอดขาย (รายได้รวม), คำสั่งซื้อทั้งหมด, อัตราส่วนแชทบอท, การ์ดแสดงรายการสต็อกวิกฤตด่วน และตารางธุรกรรมล่าสุด
2. หน้าจัดการคลังสินค้า (Inventory): แสดงรายการทะเบียนยาทั้งหมด, SKU, ปริมาณคงเหลือจริง และการแจ้งเตือนสต็อกต่ำ แอดมินสามารถกดปุ่ม "ปรับปรุงแก้ไข" เพื่อจัดการรายละเอียด หรือกด "สั่งยาเพิ่มด่วน" ได้
3. หน้าเช็กยาใกล้หมดอายุ (Expiry Alerts): แดชบอร์ดสรุปยาหมดอายุคาคลัง ยาหมดอายุวิกฤต (30 วัน) และหมดอายุเฝ้าระวัง (90 วัน) แอดมินสามารถกำหนดสไลเดอร์ช่วงเวลาแจ้งเตือนได้ด้วยตัวเอง และมีปุ่มจัดการเชิงรุกด่วน ได้แก่ ลดราคาพิเศษเพื่อระบายสต็อก, ส่งเคลมคืนบริษัท หรือจำหน่ายทิ้ง (Write Off)
4. หน้าประวัติธุรกรรม (Orders): แอดมินสามารถดูรายการคำสั่งซื้อของลูกค้าทั้งหมดในระบบ และควบคุมการจัดการคำสั่งซื้อโดยตรง เช่น ยืนยันจัดส่งสำเร็จ หรือยกเลิกคำสั่งซื้อ หรือย้อนสถานะกลับมาเป็นกำลังจัดส่งได้

คำแนะนำในการตอบกลับ:
1. ตอบกลับเป็นภาษาไทยที่สุภาพ เป็นมิตร มีความเป็นมืออาชีพ และตอบคำถามได้ตรงประเด็น
2. แนะนำขั้นตอนการคลิกหรือใช้งานหน้าต่างระบบต่างๆ ตามจริง
3. เน้นการใช้ Markdown (เช่น ตัวหนา **ข้อความ** หรือหัวข้อ ## และรายการแบบจุดนำ -) เพื่อให้อ่านและนำทางเมนูระบบได้เข้าใจง่าย
4. ให้ข้อแนะนำเชิงรุก เช่น เคล็ดลับการบริหารสต็อกต่ำ หรือคำแนะนำการจัดกิจกรรมส่งเสริมการขายเพื่อลดภาระยาล็อตใกล้หมดอายุ`
      } else {
        systemInstruction = `คุณคือ เภสัชกรอัจฉริยะ (PharmaAI) ของร้านขายยาชื่อ "PharmaAI"
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
      }

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
      
      // Check if user's natural query contains the symptom name or keywords
      return (
        q.includes(symptomName) ||
        keywords.some((k) => q.includes(k.toLowerCase()))
      )
    })

    if (matched.length > 0) {
      const bestMatch = matched[0]
      if (bestMatch) {
        // Find matching product records listed in s.relatedProducts IDs
        const relatedProdIds = (bestMatch.relatedProducts as string[]) || []
        const relatedProds = allProducts.filter((p) => relatedProdIds.includes(p.id))
        const productsNamesStr = relatedProds.map((p) => `**${p.name}**`).join(', ')
        
        let productsAdvice = ''
        if (productsNamesStr) {
          productsAdvice = `\n\n💊 ยาที่แนะนำในคลังของเรา: ${productsNamesStr} (สามารถกดใส่ตะกร้าด้านล่างได้ทันที)`
        }

        const fallbackReply = `จากการประเมินอาการ "${bestMatch.symptom}":\n\n📝 คำอธิบาย: ${bestMatch.description}\n\n💡 คำแนะนำการดูแลสุขภาพเบื้องต้น: ${bestMatch.advice}${productsAdvice}\n\n⚠️ คำเตือนความปลอดภัย: ${bestMatch.disclaimer}`
        return {
          success: true,
          query: q,
          aiReply: fallbackReply,
          isFallback: true
        }
      }
    }

    // Ultimate fallback if no keywords matched
    const standardFallbackReply = `ผมได้รับข้อมูลอาการ "${q}" แล้วครับ สำหรับอาการนี้เบื้องต้นแนะนำหลีกเลี่ยงปัจจัยกระตุ้น ดื่มน้ำอุ่น และพักผ่อนให้เพียงพอ หากอาการไม่ดีขึ้นแนะนำให้เข้าใช้เมนูสั่งซื้อเพื่อเลือกดูเวชภัณฑ์ยาที่ต้องการนะครับ`
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
