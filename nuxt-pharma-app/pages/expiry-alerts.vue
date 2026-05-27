<template>
  <div class="space-y-6" style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- ─── Page Header ───────────────────────────────────────────── -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5 mb-1">
          <span class="material-symbols-outlined text-red-500 text-[28px] icon-fill">running_with_errors</span>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">ระบบแจ้งเตือนยาหมดอายุ</h2>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 ml-9">
          ตรวจสอบและป้องกันเวชภัณฑ์หมดอายุคาชั้นวาง ปรับราคาขายระบายคลังอย่างชาญฉลาด
        </p>
      </div>

      <!-- Live Date Indicator -->
      <div class="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-3 rounded-2xl shadow-sm shrink-0">
        <div class="w-9 h-9 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px] icon-fill">calendar_month</span>
        </div>
        <div>
          <p class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">วันที่ระบบปัจจุบัน</p>
          <p class="text-xs font-black text-slate-800 dark:text-white mt-0.5">{{ formattedToday }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Bento Summary KPI Metrics ──────────────────────────────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- KPI 1: Expired -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-14 h-14 bg-red-50 dark:bg-red-950/20 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">หมดอายุคาคลัง</span>
          <span class="material-symbols-outlined text-red-500 text-[20px] icon-fill">dangerous</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black" :class="expiredCount > 0 ? 'text-red-500' : 'text-slate-800 dark:text-white'">{{ expiredCount }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">รายการ</span>
        </div>
      </div>

      <!-- KPI 2: Expiring 30 Days -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-14 h-14 bg-orange-50 dark:bg-orange-950/20 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">วิกฤต (ใน 30 วัน)</span>
          <span class="material-symbols-outlined text-orange-500 text-[20px] icon-fill">warning</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-orange-500">{{ criticalCount }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">รายการ</span>
        </div>
      </div>

      <!-- KPI 3: Expiring 90 Days -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-14 h-14 bg-amber-50 dark:bg-amber-950/20 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">เฝ้าระวัง (ใน 90 วัน)</span>
          <span class="material-symbols-outlined text-amber-500 text-[20px]">pending_actions</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-amber-600 dark:text-amber-400">{{ within90DaysCount }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">รายการ</span>
        </div>
      </div>

      <!-- KPI 4: Avg Shelf Life -->
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-14 h-14 bg-teal-50 dark:bg-teal-950/20 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">อายุเฉลี่ยคงเหลือ</span>
          <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[20px]">hourglass_empty</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-teal-600 dark:text-teal-400">{{ avgDaysLeft }}</span>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">วัน</span>
        </div>
      </div>
    </div>

    <!-- ─── Interactive Controls Panel ───────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div class="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
        
        <!-- Search and Quick Threshold Filter Buttons -->
        <div class="flex-grow flex flex-col sm:flex-row items-center gap-4">
          <!-- Text Search input -->
          <div class="relative w-full sm:w-80">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหายา หรือแบรนด์เวชภัณฑ์..."
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs font-semibold text-slate-800 dark:text-slate-100 transition-all shadow-inner"
            />
          </div>

          <!-- Quick Threshold Preset Buttons -->
          <div class="flex flex-wrap gap-2 w-full">
            <button
              v-for="btn in thresholdButtons"
              :key="btn.days"
              @click="setThreshold(btn.days)"
              class="px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all border active:scale-95"
              :class="[
                expiryThreshold === btn.days 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              ]"
            >
              {{ btn.label }}
            </button>
          </div>
        </div>

        <!-- Custom Threshold Slider Container -->
        <div class="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 w-full lg:w-96 flex flex-col gap-2">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-700 dark:text-slate-300 font-black">เกณฑ์แจ้งเตือนยาหมดอายุ</span>
            <span class="bg-teal-500 text-white px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase">
              ภายใน {{ expiryThreshold }} วัน
            </span>
          </div>
          <input
            type="range"
            v-model.number="expiryThreshold"
            min="5"
            max="730"
            step="5"
            class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none"
          />
          <div class="flex justify-between text-[9px] text-slate-400 font-bold">
            <span>5 วัน</span>
            <span>90 วัน</span>
            <span>1 ปี</span>
            <span>2 ปี</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Warning Data Table ────────────────────────────────────── -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          เวชภัณฑ์ที่ตรงตามเงื่อนไขความเสี่ยง
          <span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
            พบ {{ filteredExpiredProducts.length }} รายการ
          </span>
        </h3>
      </div>

      <!-- Warning Table View -->
      <div v-if="filteredExpiredProducts.length > 0" class="overflow-x-auto border border-slate-100 dark:border-slate-800/80 rounded-2xl">
        <table class="min-w-full">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">ข้อมูลเวชภัณฑ์</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">วันที่หมดอายุ</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">อายุการใช้คงเหลือ</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">สต็อก / มูลค่า</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">ความเสี่ยง</th>
              <th class="px-6 py-3.5 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">การจัดการเชิงรุก</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr 
              v-for="item in filteredExpiredProducts" 
              :key="item.id"
              class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
            >
              <!-- Info column -->
              <td class="px-6 py-4">
                <div>
                  <p class="text-xs font-black text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{{ item.name }}</p>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-bold">{{ item.brand }} · {{ item.category }}</p>
                </div>
              </td>

              <!-- Date column -->
              <td class="px-6 py-4">
                <span class="text-xs text-slate-600 dark:text-slate-300 font-semibold">{{ formatExpiryDate(item.expiryDate) }}</span>
              </td>

              <!-- Days remaining column -->
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span 
                    class="text-xs font-black"
                    :class="[
                      item.daysLeft < 0 ? 'text-red-600 dark:text-red-400' :
                      item.daysLeft <= 30 ? 'text-red-500 font-extrabold animate-pulse' :
                      item.daysLeft <= 90 ? 'text-orange-500' : 'text-amber-500'
                    ]"
                  >
                    {{ getRemainingDaysText(item.daysLeft) }}
                  </span>
                  <span class="text-[9px] text-slate-400 mt-0.5">{{ item.daysLeft < 0 ? 'หมดอายุแล้ว' : 'ก่อนหมดอายุจริง' }}</span>
                </div>
              </td>

              <!-- Stock & value column -->
              <td class="px-6 py-4">
                <div>
                  <p class="text-xs font-black text-slate-700 dark:text-slate-200">{{ item.stock }} {{ item.unit }}</p>
                  <p class="text-[9px] text-slate-400 font-bold mt-0.5">มูลค่า: ฿{{ (item.stock * item.price).toLocaleString() }}</p>
                </div>
              </td>

              <!-- Severity Warning Badge -->
              <td class="px-6 py-4">
                <span 
                  class="px-2.5 py-1 rounded-full text-[9px] font-black border inline-flex items-center gap-1.5"
                  :class="[
                    item.daysLeft < 0 ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30' :
                    item.daysLeft <= 30 ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-900/40 animate-pulse' :
                    item.daysLeft <= 90 ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30' :
                                          'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" 
                        :class="[
                          item.daysLeft < 0 ? 'bg-red-600' :
                          item.daysLeft <= 30 ? 'bg-red-500' :
                          item.daysLeft <= 90 ? 'bg-orange-500' : 'bg-amber-500'
                        ]"></span>
                  {{ getSeverityLabel(item.daysLeft) }}
                </span>
              </td>

              <!-- Actions column -->
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <!-- Discount Promo -->
                  <button 
                    v-if="item.daysLeft >= 0 && item.stock > 0" 
                    @click="applyPromotion(item)"
                    class="p-2 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-xl transition-all active:scale-90"
                    title="จัดโปรโมชั่นลดราคาสินค้าเพื่อกระตุ้นยอดขาย"
                  >
                    <span class="material-symbols-outlined text-[18px]">sell</span>
                  </button>

                  <!-- Claim refund -->
                  <button 
                    v-if="item.daysLeft >= 0"
                    @click="initiateReturn(item)"
                    class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all active:scale-90"
                    title="ส่งเคลมคืนบริษัทผู้ผลิตตามโควตา"
                  >
                    <span class="material-symbols-outlined text-[18px]">assignment_return</span>
                  </button>

                  <!-- Disposal / Write off -->
                  <button 
                    @click="disposeProduct(item)"
                    class="p-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 rounded-xl transition-all active:scale-90"
                    title="บันทึกจำหน่ายทิ้งออกจากสต็อกเวชภัณฑ์"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State View -->
      <div v-else class="text-center py-16 text-slate-400 dark:text-slate-500">
        <span class="material-symbols-outlined text-5xl block mb-3 opacity-30 text-teal-500 icon-fill">verified</span>
        <h4 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">คลังยาปลอดภัยดีเยี่ยม!</h4>
        <p class="text-[11px] max-w-md mx-auto text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
          ไม่พบผลิตภัณฑ์เวชภัณฑ์ที่หมดอายุหรือใกล้หมดอายุต่ำกว่า <span class="text-teal-600 dark:text-teal-400 font-black">{{ expiryThreshold }} วัน</span> ตามเงื่อนไขการค้นหาของคุณในขณะนี้
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
})

// 1. Fetch products list from dynamic database API
const { data: result } = useFetch<any>('/api/products')
const productsList = computed<any[]>(() => result.value?.products || [])

// Stable system date anchor for database match (24 May 2026)
const todayDate = new Date('2026-05-24')
const formattedToday = '24 พ.ค. 2026'

// Warning Threshold state in days
const expiryThreshold = ref(180)
const searchQuery = ref('')

// Presets
const thresholdButtons = [
  { label: 'หมดอายุแล้ว', days: 5 },
  { label: 'ภายใน 30 วัน', days: 30 },
  { label: 'ภายใน 90 วัน', days: 90 },
  { label: 'ภายใน 180 วัน', days: 180 },
  { label: 'ภายใน 1 ปี', days: 365 },
]

const setThreshold = (days: number) => {
  expiryThreshold.value = days
}

// Map days remaining for products
const productsWithDaysLeft = computed(() => {
  return productsList.value.map(p => {
    const expiry = new Date(p.expiryDate)
    const diffTime = expiry.getTime() - todayDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return {
      ...p,
      daysLeft: diffDays,
    }
  })
})

// Filter products based on search and threshold criteria, ordered by daysLeft ascending
const filteredExpiredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const threshold = expiryThreshold.value
  
  return productsWithDaysLeft.value
    .filter(p => {
      const isExpiring = p.daysLeft <= threshold
      
      const matchesSearch = !q || 
        (p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
        
      return isExpiring && matchesSearch
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
})

// Aggregate KPI calculation metrics
const expiredCount = computed(() => {
  return productsWithDaysLeft.value.filter(p => p.daysLeft < 0).length
})

const criticalCount = computed(() => {
  return productsWithDaysLeft.value.filter(p => p.daysLeft >= 0 && p.daysLeft <= 30).length
})

const within90DaysCount = computed(() => {
  return productsWithDaysLeft.value.filter(p => p.daysLeft >= 0 && p.daysLeft <= 90).length
})

const avgDaysLeft = computed(() => {
  const list = productsWithDaysLeft.value
  if (list.length === 0) return 0
  const sum = list.reduce((acc, p) => acc + p.daysLeft, 0)
  return Math.round(sum / list.length)
})

// Display/formatting utils
const formatExpiryDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const getRemainingDaysText = (days: number) => {
  if (days < 0) return `หมดอายุแล้ว ${Math.abs(days)} วัน`
  if (days === 0) return 'หมดอายุวันนี้!'
  return `อีก ${days} วัน`
}

const getSeverityLabel = (days: number) => {
  if (days < 0) return 'หมดอายุแล้ว'
  if (days <= 30) return 'วิกฤตด่วน (30 วัน)'
  if (days <= 90) return 'เฝ้าระวังสูง (90 วัน)'
  return 'เฝ้าระวังทั่วไป'
}

// Proactive Mock Action handlers
const applyPromotion = (product: any) => {
  alert(`ดำเนินการสร้างโปรโมชั่นลดราคาพิเศษ 40% สำหรับสินค้า "${product.name}" เพื่อกระตุ้นและระบายออกสู่ตลาดก่อนหมดอายุสำเร็จ!`)
}

const initiateReturn = (product: any) => {
  alert(`ดำเนินการจัดทำเอกสารและยื่นเรื่องเคลมส่งคืนล็อตสินค้า "${product.name}" ไปยังผู้ผลิตเรียบร้อยแล้ว`)
}

const disposeProduct = (product: any) => {
  const confirmDispose = confirm(`คุณต้องการยืนยันการบันทึกจำหน่ายทิ้ง (Write Off) เวชภัณฑ์ยา "${product.name}" หรือไม่? การทำเช่นนี้เป็นการทำลายเชิงเวชภัณฑ์ความปลอดภัยและปรับยอดสต็อกให้หมดลงเป็นศูนย์`)
  if (confirmDispose) {
    alert(`ทำรายการจำหน่ายทิ้งและปรับสต็อกเรียบร้อยแล้ว`)
  }
}
</script>

<style scoped>
/* Modern Range Slider thumb visual styles */
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transition: transform 0.1s;
}
input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.icon-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
