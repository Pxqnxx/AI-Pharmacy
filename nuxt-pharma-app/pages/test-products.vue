<template>
  <div>
    <!-- Page Header and Live Connection Status -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2"> Live Products DB Test</h2>
        <p class="font-body-md text-body-md text-on-surface-variant">ทดสอบดึงข้อมูลสดของผลิตภัณฑ์จาก Supabase Postgres ผ่าน Drizzle ORM</p>
      </div>
      <div class="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full border border-emerald-200/50 shadow-sm shrink-0">
        <span class="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
        <span class="font-label-md text-label-md font-bold">เชื่อมต่อฐานข้อมูลสำเร็จ</span>
      </div>
    </div>

    <!-- Bento Grid Summary Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-gutter">
      <!-- Metric 1: Total Products -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">รายการสินค้าทั้งหมด</span>
          <span class="material-symbols-outlined text-primary text-[22px] icon-fill">inventory</span>
        </div>
        <div>
          <span class="font-display-lg text-display-lg font-bold text-on-surface">{{ products.length }}</span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">รายการ</span>
        </div>
      </div>

      <!-- Metric 2: Inventory Value -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-secondary/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">มูลค่าคลังสินค้าสะสม</span>
          <span class="material-symbols-outlined text-secondary text-[22px]">payments</span>
        </div>
        <div>
          <span class="font-display-lg text-display-lg font-bold text-on-surface">฿{{ totalValue.toLocaleString() }}</span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">บาท</span>
        </div>
      </div>

      <!-- Metric 3: Out of Stock -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-error/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">สินค้าหมด (Out of Stock)</span>
          <span class="material-symbols-outlined text-error text-[22px] icon-fill">dangerous</span>
        </div>
        <div>
          <span class="font-display-lg text-display-lg font-bold text-on-surface" :class="outOfStockCount > 0 ? 'text-error animate-pulse' : 'text-on-surface'">
            {{ outOfStockCount }}
          </span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">รายการ</span>
        </div>
      </div>
    </div>

    <!-- Search Input & Real-Time Filter -->
    <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm mb-gutter">
      <div class="flex flex-col sm:flex-row items-center gap-4 justify-between mb-6">
        <h3 class="font-headline-md text-headline-md text-on-surface font-bold">ตารางรายการผลิตภัณฑ์ในระบบ</h3>
        <!-- Search input box -->
        <div class="relative w-full sm:w-80">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาชื่อ หรือหมวดหมู่สินค้า..."
            class="w-full bg-surface-container-low border border-outline-variant rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-body-md text-body-md text-on-surface transition-all shadow-xs"
          />
        </div>
      </div>

      <!-- Scrollable Data Table -->
      <div class="overflow-x-auto border border-outline-variant/60 rounded-xl">
        <table class="min-w-full divide-y divide-outline-variant">
          <thead class="bg-surface-container-low">
            <tr>
              <th class="px-6 py-4 text-left font-label-md text-label-md text-on-surface-variant font-bold">ID</th>
              <th class="px-6 py-4 text-left font-label-md text-label-md text-on-surface-variant font-bold">ชื่อผลิตภัณฑ์</th>
              <th class="px-6 py-4 text-left font-label-md text-label-md text-on-surface-variant font-bold">หมวดหมู่</th>
              <th class="px-6 py-4 text-left font-label-md text-label-md text-on-surface-variant font-bold">ราคา</th>
              <th class="px-6 py-4 text-left font-label-md text-label-md text-on-surface-variant font-bold">ระดับสต็อก</th>
              <th class="px-6 py-4 text-left font-label-md text-label-md text-on-surface-variant font-bold">คะแนนเฉลี่ย</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant bg-white">
            <tr 
              v-for="item in filteredProducts" 
              :key="item.id"
              class="hover:bg-surface-container-lowest transition-colors group cursor-pointer"
            >
              <td class="px-6 py-4 font-label-md text-label-md text-tertiary">{{ item.id }}</td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-label-md text-label-md text-on-surface font-bold group-hover:text-primary transition-colors">{{ item.name }}</p>
                  <p class="font-label-sm text-label-sm text-on-surface-variant/80 mt-0.5">{{ item.brand }} • {{ item.unit }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2.5 py-1 rounded-full font-label-sm text-[11px] border"
                  :class="[
                    item.type === 'ยา' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20'
                  ]"
                >
                  {{ item.category }}
                </span>
              </td>
              <td class="px-6 py-4 font-headline-md text-label-md font-bold text-on-surface">฿{{ item.price }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1.5 w-32">
                  <div class="flex items-center justify-between text-[11px] font-label-sm">
                    <span :class="item.stock === 0 ? 'text-error font-bold' : 'text-on-surface-variant'">
                      {{ item.stock === 0 ? 'สินค้าหมด' : `${item.stock} ชิ้น` }}
                    </span>
                  </div>
                  <!-- Visual stock bar -->
                  <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-500"
                      :class="[
                        item.stock === 0 ? 'bg-transparent' :
                        item.stock <= 5 ? 'bg-error' :
                        item.stock <= 20 ? 'bg-orange-500' : 'bg-emerald-500'
                      ]"
                      :style="{ width: Math.min((item.stock / 60) * 100, 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1 text-orange-500">
                  <span class="material-symbols-outlined text-[18px] icon-fill">star</span>
                  <span class="font-label-md text-label-md font-bold">{{ item.rating }}</span>
                  <span class="text-[10px] text-on-surface-variant">({{ item.sold }} ขายแล้ว)</span>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">
                <span class="material-symbols-outlined text-4xl block mb-2 opacity-50">search_off</span>
                ไม่พบผลลัพธ์สินค้าที่ตรงกับคำค้นหาของคุณ
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
})

// 1. Fetch live products dynamically from Drizzle API (Nuxt auto-imports useFetch)
const { data: result } = useFetch<any>('/api/products')

const products = computed<any[]>(() => result.value?.products || [])

// 2. Client-side search logic
const searchQuery = ref('')

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return products.value
  
  return products.value.filter((p) => {
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q)
    );
  })
})

// 3. Aggregate metrics calculations
const totalValue = computed(() => {
  return products.value.reduce((acc, p) => acc + (p.price * p.stock), 0)
})

const outOfStockCount = computed(() => {
  return products.value.filter((p) => p.stock === 0).length
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
