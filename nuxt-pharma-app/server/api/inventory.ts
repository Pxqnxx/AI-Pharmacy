import { defineEventHandler } from 'h3'
import { db } from '../../drizzle/db'
import { products as productsTable } from '../../drizzle/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    // 1. Fetch all products from Postgres
    const allProducts = await db
      .select()
      .from(productsTable)
      .orderBy(asc(productsTable.id))

    // Fallback professional placeholder images for different categories
    const imagePlaceholders: Record<string, string> = {
      'ยาแก้ปวด-ลดไข้': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXdHDGAIAPejrsQ6mIKw6j7WRYQ5dw3fQDeT93JDJvxuXnk4rvOPSL0nf3__QjgPgWCnBPbU5XATC6gOuExF16k4a6HfkJY9PpH32-39WcFqP2cuStzJLvDtZJSZhZoC3xKDiNnh21P4fVM6vj5OApCwLCO5BpxueGmk2UOwioaQzpgyHfmsVW6YSW04ttN4ctlJZRdHWmcWSZ6OmuH9lmDZifSLMUpADVNGaseWa_w6IlZ-AiwEm_0N6-Zb3NDVdaNpi9iagAY8i5',
      'ยาแก้แพ้': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbvZRalhKNzbmGDRLWIqR7vjCUiOBOXegqYMbSVY2NU43HduRIlr-X5S3kWvP9iGk0S-I-0czQyuOx3TFp0_krryE3-5LceGfQWF2JjSibszQOgzugIxRel5QzFtvZRb9ogYl9yjUZasUcL6zCjRCMseImx4bH8KA7DNcDfV8JsRDYonzkABgPd7-Xggu-G56W6M5aMX6hPUwga0dqXyMvvFa4yTktmQ-cQUQOPJKjmXWOOf1G4pwgSIXjrOUFOLj9ca1IHvNbX8Qc',
      'วิตามินและแร่ธาตุ': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3SOW2vMsmYJtgurC5DLYrMD1SPuPf_qXwN0Km4js2pGsAncNTNJjNUrl6llJmFRdE5tbK9Q8LhIhEOkFf-PQxuBk4sjEkP5D9jFAxed5dOBDu5WWCmC3e1YtxZGaBUDlUtjyjtBkAK6earpvshccUfSyzJlWNdx2v8m3fcWW3LoCQJaGGI5RvmIQfc9L4K_HCklUZ3bcaNk6vqcf6ZuJCYp45xly6i5Yo82HAJgAtihcBat9B6vz3XkzlnAQk694e7oURj6o_yUBX',
      'ยาระบบทางเดินอาหาร': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXdHDGAIAPejrsQ6mIKw6j7WRYQ5dw3fQDeT93JDJvxuXnk4rvOPSL0nf3__QjgPgWCnBPbU5XATC6gOuExF16k4a6HfkJY9PpH32-39WcFqP2cuStzJLvDtZJSZhZoC3xKDiNnh21P4fVM6vj5OApCwLCO5BpxueGmk2UOwioaQzpgyHfmsVW6YSW04ttN4ctlJZRdHWmcWSZ6OmuH9lmDZifSLMUpADVNGaseWa_w6IlZ-AiwEm_0N6-Zb3NDVdaNpi9iagAY8i5',
    }

    const defaultImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXdHDGAIAPejrsQ6mIKw6j7WRYQ5dw3fQDeT93JDJvxuXnk4rvOPSL0nf3__QjgPgWCnBPbU5XATC6gOuExF16k4a6HfkJY9PpH32-39WcFqP2cuStzJLvDtZJSZhZoC3xKDiNnh21P4fVM6vj5OApCwLCO5BpxueGmk2UOwioaQzpgyHfmsVW6YSW04ttN4ctlJZRdHWmcWSZ6OmuH9lmDZifSLMUpADVNGaseWa_w6IlZ-AiwEm_0N6-Zb3NDVdaNpi9iagAY8i5'

    // 2. Identify and format low stock alerts
    const lowStockAlerts = allProducts
      .filter((p) => p.stock <= 10)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        stockLevel: p.stock,
        unit: p.unit,
        status: p.stock <= 5 ? 'critical' : 'warning',
        icon: p.type === 'ยา' ? 'pill' : 'science',
      }))

    // 3. Format inventory list items
    const inventoryItems = allProducts.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      sku: p.id,
      stockLevel: p.stock,
      imageUrl: imagePlaceholders[p.category] || defaultImage,
      brand: p.brand,
      category: p.category,
      price: p.price,
      type: p.type,
      unit: p.unit,
    }))

    return {
      success: true,
      lowStockAlerts,
      inventoryItems,
    }
  } catch (error: any) {
    console.error('API Error /api/inventory:', error)
    return {
      success: false,
      error: error.message || 'Internal Server Error',
    }
  }
})
