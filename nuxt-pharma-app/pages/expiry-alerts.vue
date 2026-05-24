<template>
  <div class="bg-gradient-to-tr from-slate-50 via-white to-teal-50/10 min-h-screen py-8 px-margin-mobile md:px-margin-desktop antialiased text-on-surface">
    <!-- Header with Back Button and Live DB Connection Status -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <a href="/" class="p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center shadow-xs">
            <span class="material-symbols-outlined text-[20px]">arrow_back</span>
          </a>
          <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-slate-900">
            ระบบแจ้งเตือนสินค้าใกล้หมดอายุ
          </h2>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant">
          ตรวจสอบ ประเมินอายุคงเหลือของผลิตภัณฑ์ยาเวชภัณฑ์ และเตรียมการจัดการเชิงรุก
        </p>
      </div>
      
      <!-- Current System Date Indicator -->
      <div class="flex items-center gap-3 bg-surface-container border border-outline-variant p-3.5 rounded-2xl shadow-xs">
        <span class="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
        <div>
          <p class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">วันที่ระบบปัจจุบัน</p>
          <p class="font-label-md text-label-md font-bold text-slate-800">{{ formattedToday }}</p>
        </div>
      </div>
    </div>

    <!-- Bento Grid Summary Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
      <!-- Metric 1: Total Expired -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-error/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">หมดอายุแล้ว</span>
          <span class="material-symbols-outlined text-error text-[22px] icon-fill">dangerous</span>
        </div>
        <div>
          <span class="font-display-lg text-display-lg font-bold text-on-surface" :class="expiredCount > 0 ? 'text-error animate-pulse' : 'text-on-surface'">
            {{ expiredCount }}
          </span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">รายการ</span>
        </div>
      </div>

      <!-- Metric 2: Expiring in 30 Days (Critical) -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-orange-500/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">หมดอายุใน 30 วัน</span>
          <span class="material-symbols-outlined text-orange-500 text-[22px] icon-fill">warning</span>
        </div>
        <div>
          <span class="font-display-lg text-display-lg font-bold text-on-surface" :class="criticalCount > 0 ? 'text-orange-500 font-extrabold' : 'text-on-surface'">
            {{ criticalCount }}
          </span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">รายการ</span>
        </div>
      </div>

      <!-- Metric 3: Expiring in 90 Days -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">หมดอายุใน 90 วัน</span>
          <span class="material-symbols-outlined text-amber-500 text-[22px]">pending_actions</span>
        </div>
        <div>
          <span class="font-display-lg text-display-lg font-bold text-on-surface">
            {{ within90DaysCount }}
          </span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">รายการ</span>
        </div>
      </div>

      <!-- Metric 4: Average Shelf Life Left -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">อายุเฉลี่ยคงเหลือ</span>
          <span class="material-symbols-outlined text-primary text-[22px]">hourglass_empty</span>
        </div>
        <div>
          <span class="font-display-lg text-display-lg font-bold text-on-surface">
            {{ avgDaysLeft }}
          </span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">วัน</span>
        </div>
      </div>
    </div>

    <!-- Main Filter Controls Dashboard -->
    <div class="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm mb-gutter">
      <div class="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
        <!-- Search and Quick Threshold Selectors -->
        <div class="flex-grow w-full lg:max-w-2xl flex flex-col sm:flex-row items-center gap-4">
          <!-- Real-time Text Search input -->
          <div class="relative w-full sm:w-80">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหาชื่อ หรือแบรนด์สินค้า..."
              class="w-full bg-surface-container-low border border-outline-variant rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-body-md text-body-md text-on-surface transition-all"
            />
          </div>

          <!-- Quick Threshold Filter Buttons -->
          <div class="flex flex-wrap gap-2 w-full">
            <button
              v-for="btn in thresholdButtons"
              :key="btn.days"
              @click="setThreshold(btn.days)"
              class="px-4 py-2.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all border shadow-xs"
              :class="[
                expiryThreshold === btn.days 
                  ? 'bg-primary text-on-primary border-primary font-bold' 
                  : 'bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container-high'
              ]"
            >
              {{ btn.label }}
            </button>
          </div>
        </div>

        <!-- Custom Threshold Slider (Pharmacist controls) -->
        <div class="bg-slate-50 border border-outline-variant/60 rounded-2xl p-4 w-full lg:w-96 shadow-inner flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="font-label-md text-label-md text-slate-700 font-bold">กำหนดช่วงเวลาแจ้งเตือน</span>
            <span class="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-md text-label-md font-bold border border-primary/20">
              ภายใน {{ expiryThreshold }} วัน
            </span>
          </div>
          <input
            type="range"
            v-model.number="expiryThreshold"
            min="5"
            max="730"
            step="5"
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
          />
          <div class="flex justify-between font-label-sm text-[10px] text-on-surface-variant">
            <span>5 วัน</span>
            <span>3 เดือน (90 วัน)</span>
            <span>1 ปี (365 วัน)</span>
            <span>2 ปี (730 วัน)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert List Grid -->
    <div class="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-headline-md text-headline-md text-slate-800 font-bold flex items-center gap-2">
          รายการยาเวชภัณฑ์ที่ใกล้หมดอายุ
          <span class="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-semibold">
            พบ {{ filteredExpiredProducts.length }} รายการ
          </span>
        </h3>
      </div>

      <!-- Warning Table -->
      <div v-if="filteredExpiredProducts.length > 0" class="overflow-x-auto border border-outline-variant/60 rounded-2xl">
        <table class="min-w-full divide-y divide-outline-variant">
          <thead class="bg-slate-50/80 backdrop-blur-xs">
            <tr>
              <th class="px-6 py-4 text-left font-label-md text-label-md text-on-surface-variant font-bold">ข้อมูลเวชภัณฑ์</th>
              <th class="px-6 py-4 class-left font-label-md text-label-md text-on-surface-variant font-bold">วันที่หมดอายุ</th>
              <th class="px-6 py-4 class-left font-label-md text-label-md text-on-surface-variant font-bold">วันคงเหลือ</th>
              <th class="px-6 py-4 class-left font-label-md text-label-md text-on-surface-variant font-bold">สต็อก / มูลค่าคลัง</th>
              <th class="px-6 py-4 class-left font-label-md text-label-md text-on-surface-variant font-bold">ระดับความเสี่ยง</th>
              <th class="px-6 py-4 text-center font-label-md text-label-md text-on-surface-variant font-bold">การจัดการเชิงรุก</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant bg-white">
            <tr 
              v-for="item in filteredExpiredProducts" 
              :key="item.id"
              class="hover:bg-slate-50/50 transition-colors group"
            >
              <!-- Name and Brand details -->
              <td class="px-6 py-4">
                <div>
                  <p class="font-label-md text-label-md text-slate-800 font-bold group-hover:text-primary transition-colors">{{ item.name }}</p>
                  <p class="font-label-sm text-label-sm text-on-surface-variant/80 mt-0.5">{{ item.brand }} • {{ item.category }}</p>
                </div>
              </td>

              <!-- Date Expiry -->
              <td class="px-6 py-4 font-body-md text-body-md text-slate-700">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-on-surface-variant">hourglass_bottom</span>
                  <span>{{ formatExpiryDate(item.expiryDate) }}</span>
                </div>
              </td>

              <!-- Days Remaining status -->
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span 
                    class="font-label-md text-label-md font-bold"
                    :class="[
                      item.daysLeft < 0 ? 'text-error' :
                      item.daysLeft <= 30 ? 'text-error font-extrabold' :
                      item.daysLeft <= 90 ? 'text-orange-500' : 'text-amber-600'
                    ]"
                  >
                    {{ getRemainingDaysText(item.daysLeft) }}
                  </span>
                  <span class="font-label-sm text-[10px] text-on-surface-variant mt-0.5">
                    {{ item.daysLeft < 0 ? 'หมดอายุไปแล้ว' : 'วันคงเหลือใช้งาน' }}
                  </span>
                </div>
              </td>

              <!-- Stock and Financial value -->
              <td class="px-6 py-4">
                <div>
                  <p class="font-label-md text-label-md text-slate-700 font-semibold">{{ item.stock }} {{ item.unit }}</p>
                  <p class="font-label-sm text-label-sm text-slate-500 mt-0.5">มูลค่า: ฿{{ (item.stock * item.price).toLocaleString() }}</p>
                </div>
              </td>

              <!-- Severity Warning Badge -->
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1.5 rounded-full font-label-sm text-label-sm border inline-flex items-center gap-1.5"
                  :class="[
                    item.daysLeft < 0 ? 'bg-red-50 text-red-700 border-red-200' :
                    item.daysLeft <= 30 ? 'bg-error-container text-on-error-container border-error/20 animate-pulse' :
                    item.daysLeft <= 90 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" 
                        :class="[
                          item.daysLeft < 0 ? 'bg-red-600' :
                          item.daysLeft <= 30 ? 'bg-error' :
                          item.daysLeft <= 90 ? 'bg-orange-500' : 'bg-amber-500'
                        ]"></span>
                  {{ getSeverityLabel(item.daysLeft) }}
                </span>
              </td>

              <!-- Proactive Actions buttons -->
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <!-- Action 1: Promotion Discount -->
                  <button 
                    v-if="item.daysLeft >= 0 && item.stock > 0" 
                    @click="applyPromotion(item)"
                    class="p-2 hover:bg-primary/10 text-primary hover:text-primary rounded-full transition-colors active:scale-95"
                    title="จัดโปรโมชั่นลดราคาสินค้าเพื่อกระตุ้นยอดขาย"
                  >
                    <span class="material-symbols-outlined text-[20px]">sell</span>
                  </button>

                  <!-- Action 2: Return to Manufacturer -->
                  <button 
                    v-if="item.daysLeft >= 0"
                    @click="initiateReturn(item)"
                    class="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-full transition-colors active:scale-95"
                    title="ส่งเคลมคืนบริษัทผู้ผลิตตามโควตา"
                  >
                    <span class="material-symbols-outlined text-[20px]">assignment_return</span>
                  </button>

                  <!-- Action 3: Dispose / Write Off -->
                  <button 
                    @click="disposeProduct(item)"
                    class="p-2 hover:bg-error/10 text-error rounded-full transition-colors active:scale-95"
                    title="บันทึกจำหน่ายทิ้งออกจากสต็อกเวชภัณฑ์"
                  >
                    <span class="material-symbols-outlined text-[20px]">delete_sweep</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 text-on-surface-variant">
        <span class="material-symbols-outlined text-5xl block mb-3 opacity-40 text-primary">verified</span>
        <h4 class="font-headline-md text-headline-md font-bold mb-1 text-slate-800">ระบบคลังสินค้าปลอดภัยดีเยี่ยม!</h4>
        <p class="font-body-md text-body-md max-w-md mx-auto">
          ไม่พบผลิตภัณฑ์ยาเวชภัณฑ์ที่มีวันหมดอายุต่ำกว่า <span class="font-bold text-primary">{{ expiryThreshold }} วัน</span> ตามเกณฑ์และคำค้นหาที่คุณเลือก
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

// 1. Fetch live products list from dynamic database route
const { data: result } = useFetch<any>('/api/products')
const productsList = computed<any[]>(() => result.value?.products || [])

// Constant current system date as anchor (24 May 2026) for stable calculation matching seeded dates
const todayDate = new Date('2026-05-24')
const formattedToday = '24 พ.ค. 2026'

// Warning Threshold state in days
const expiryThreshold = ref(180)

// Quick Filter Button presets
const thresholdButtons = [
  { label: 'หมดอายุแล้ว', days: 5 }, // set low to catch expired
  { label: 'ภายใน 30 วัน', days: 30 },
  { label: 'ภายใน 90 วัน', days: 90 },
  { label: 'ภายใน 180 วัน', days: 180 },
  { label: 'ภายใน 1 ปี', days: 365 },
]

const searchQuery = ref('')

const setThreshold = (days: number) => {
  expiryThreshold.value = days
}

// 2. Map and parse days remaining for each product
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

// 3. Filter expiring products by warning threshold and search term, sorted by daysLeft ascending
const filteredExpiredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const threshold = expiryThreshold.value
  
  return productsWithDaysLeft.value
    .filter(p => {
      // Expiry filter (days remaining <= threshold)
      const isExpiring = p.daysLeft <= threshold
      
      // Text search filter
      const matchesSearch = !q || 
        (p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
        
      return isExpiring && matchesSearch
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
})

// 4. Summaries and KPI aggregates
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

// Formatting and utility functions
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
  if (days < 0) return 'หมดอายุทิ้งคลัง'
  if (days <= 30) return 'วิกฤตด่วน (Critical)'
  if (days <= 90) return 'เฝ้าระวังสูง (Warning)'
  return 'เฝ้าระวังทั่วไป'
}

// Inter-system Mock Action triggers
const applyPromotion = (product: any) => {
  alert(`ดำเนินการสร้างโปรโมชั่นลดราคาพิเศษ 40% สำหรับสินค้า "${product.name}" เพื่อระบายคลังก่อนการหมดอายุจริง!`)
}

const initiateReturn = (product: any) => {
  alert(`ดำเนินการยื่นเรื่องทำรายการจัดทำเอกสารส่งเคลมคืนล็อตสินค้า "${product.name}" ไปยังผู้ผลิตล็อตสินค้าต้นทางเรียบร้อยแล้ว`)
}

const disposeProduct = (product: any) => {
  const confirmDispose = confirm(`คุณต้องการยืนยันการบันทึกจำหน่ายทิ้ง (Write Off) ผลิตภัณฑ์ยา "${product.name}" ออกจากคลังสต็อกใช่หรือไม่? ข้อมูลจะถูกทำลายเชิงเวชภัณฑ์ความปลอดภัยและตัดยอดคงเหลือเป็นศูนย์`)
  if (confirmDispose) {
    alert(`จำหน่ายทิ้งและหักยอดคลังสินค้าสำเร็จ`)
  }
}
</script>

<style scoped>
/* Range Slider modern standard styling */
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transition: transform 0.1s;
}
input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.icon-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
