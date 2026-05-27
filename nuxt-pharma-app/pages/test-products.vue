<template>
  <div class="space-y-6" style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- ─── Page Header and Live Connection Status ───────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5 mb-1">
          <span class="material-symbols-outlined text-indigo-500 text-[28px] icon-fill">database</span>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">ทดสอบและวิเคราะห์ฐานข้อมูล</h2>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 ml-9">
          ตรวจสอบและวิเคราะห์การเชื่อมต่อแบบเรียลไทม์กับ Supabase Postgres ผ่าน Drizzle ORM
        </p>
      </div>

      <!-- Live Connection Badge -->
      <div class="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-sm shrink-0">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-xs font-black uppercase tracking-wider">เชื่อมต่อ Live DB สำเร็จ</span>
      </div>
    </div>

    <!-- ─── Bento Grid Summary Metrics ────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Metric 1: Total Products -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-14 h-14 bg-indigo-50 dark:bg-indigo-950/20 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">รายการสินค้าคงทะเบียน</span>
          <span class="material-symbols-outlined text-indigo-500 text-[20px] icon-fill">inventory</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-slate-800 dark:text-white">{{ products.length }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">รายการ</span>
        </div>
      </div>

      <!-- Metric 2: Total Inventory Value -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-14 h-14 bg-teal-50 dark:bg-teal-950/20 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">มูลค่าคลังสินค้าสะสม</span>
          <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[20px] icon-fill">payments</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-teal-600 dark:text-teal-400">฿{{ totalValue.toLocaleString() }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">บาท</span>
        </div>
      </div>

      <!-- Metric 3: Out of Stock -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-14 h-14 bg-red-50 dark:bg-red-950/20 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">สต็อกยาหมด (Out of Stock)</span>
          <span class="material-symbols-outlined text-red-500 text-[20px] icon-fill">dangerous</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black" :class="outOfStockCount > 0 ? 'text-red-500 font-black animate-pulse' : 'text-slate-800 dark:text-white'">{{ outOfStockCount }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">รายการ</span>
        </div>
      </div>
    </div>

    <!-- ─── Real-Time Live Data Table ────────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div class="flex flex-col sm:flex-row items-center gap-4 justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">ตารางวิเคราะห์รายการฐานข้อมูลสด</h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">ตรวจสอบโครงสร้าง ค่าน้ำหนัก ราคา และคะแนนประเมินดิบใน Drizzle Schema</p>
        </div>
        
        <!-- Text Search -->
        <div class="relative w-full sm:w-72">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาชื่อ หรือหมวดหมู่ยา..."
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 dark:text-slate-100 transition-all shadow-inner"
          />
        </div>
      </div>

      <!-- Scrollable Data Table -->
      <div class="overflow-x-auto border border-slate-100 dark:border-slate-800/80 rounded-2xl">
        <table class="min-w-full">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">SKU ID</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">ชื่อผลิตภัณฑ์ดิบ</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">หมวดหมู่</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">ราคาบิล</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">แถบสต็อกระดับคงเหลือ</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">คะแนนเฉลี่ย & ยอดขาย</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr 
              v-for="item in filteredProducts" 
              :key="item.id"
              class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
            >
              <td class="px-6 py-4">
                <span class="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400">{{ item.id }}</span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-xs font-black text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ item.name }}</p>
                  <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-bold">{{ item.brand }} · {{ item.unit }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-0.5 rounded-full text-[9px] font-black border"
                  :class="[
                    item.type === 'ยา' 
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30' 
                      : 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/30'
                  ]"
                >
                  {{ item.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-black text-slate-800 dark:text-white">฿{{ item.price }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1 w-28">
                  <div class="flex items-center justify-between text-[9px] font-bold">
                    <span :class="item.stock === 0 ? 'text-red-500 font-black' : 'text-slate-500 dark:text-slate-400'">
                      {{ item.stock === 0 ? 'ยาหมดสต็อกแล้ว' : `${item.stock} ชิ้น` }}
                    </span>
                  </div>
                  <!-- Progress Visual Stock Bar -->
                  <div class="w-full bg-slate-100 dark:bg-slate-850 rounded-full h-1 overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-500"
                      :class="[
                        item.stock === 0 ? 'bg-transparent' :
                        item.stock <= 5 ? 'bg-red-500' :
                        item.stock <= 20 ? 'bg-orange-500' : 'bg-emerald-500'
                      ]"
                      :style="{ width: Math.min((item.stock / 60) * 100, 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1 text-orange-500">
                  <span class="material-symbols-outlined text-[15px] icon-fill">star</span>
                  <span class="text-xs font-black">{{ item.rating }}</span>
                  <span class="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">({{ item.sold }} ขาย)</span>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                <span class="material-symbols-outlined text-4xl block mb-2 opacity-30">search_off</span>
                <p class="text-xs font-black uppercase">ไม่พบผลลัพธ์ข้อมูลที่ต้องการ</p>
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

// Fetch live products dynamically from database route
const { data: result } = useFetch<any>('/api/products')

const products = computed<any[]>(() => result.value?.products || [])
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

// Aggregated counts calculations
const totalValue = computed(() => {
  return products.value.reduce((acc, p) => acc + (p.price * p.stock), 0)
})

const outOfStockCount = computed(() => {
  return products.value.filter((p) => p.stock === 0).length
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.icon-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
