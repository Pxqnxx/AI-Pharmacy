<template>
  <div class="bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-body-md antialiased min-h-screen flex">
    
    <!-- Desktop Navigation Drawer Sidebar (MD3 Spec) -->
    <nav class="hidden lg:flex flex-col bg-white dark:bg-slate-900 w-80 h-screen fixed inset-y-0 left-0 border-r border-slate-200 dark:border-slate-800 shadow-sm z-40 py-6 transition-all duration-300">
      <!-- Profile Header -->
      <div class="px-6 mb-8 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full overflow-hidden bg-teal-100 flex-shrink-0 border-2 border-teal-500 shadow-sm">
          <img alt="User Avatar" class="w-full h-full object-cover" :src="userProfile.avatar">
        </div>
        <div>
          <h2 class="font-headline-md text-slate-900 dark:text-white font-bold leading-tight">{{ userProfile.name }}</h2>
          <p class="font-label-sm text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">{{ userProfile.role }}</p>
          <p class="font-label-sm text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{{ userProfile.version }}</p>
        </div>
      </div>

      <!-- Navigation Menu Links -->
      <div class="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <div class="font-label-sm text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2 font-bold">ระบบบริหารคลังและจัดการแอดมิน</div>
        <a 
          v-for="item in navigationMenu" 
          :key="item.href"
          :href="item.href"
          class="flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group active:scale-98"
          :class="[
            item.isActive 
              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-bold border-l-4 border-teal-600' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <div class="flex items-center gap-3.5">
            <span 
              class="material-symbols-outlined text-[22px] transition-colors"
              :class="[
                item.isActive 
                  ? 'text-teal-600 dark:text-teal-400 icon-fill' 
                  : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              ]"
            >
              {{ item.icon }}
            </span>
            <span class="font-label-md text-label-md">{{ item.label }}</span>
          </div>
          <!-- Tiny dot on active item -->
          <span v-if="item.isActive" class="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
        </a>
      </div>

      <!-- Footer Brand Info -->
      <div class="px-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <span>© 2026 PharmaAI Inc.</span>
        <span class="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">v4.0.0</span>
      </div>
    </nav>

    <!-- Main Content Canvas Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-80">
      
      <!-- TopAppBar Navigation Header -->
      <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 w-full z-30 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 lg:px-8 h-16 shadow-xs">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Drawer trigger -->
          <button class="lg:hidden text-slate-600 dark:text-slate-300 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <h1 class="font-headline-md text-slate-900 dark:text-white font-extrabold flex items-center gap-2">
            แผงควบคุมระบบคลังยาอัจฉริยะ 
            <span class="hidden md:inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-200/50">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              เชื่อมต่อ Postgres เรียบร้อย
            </span>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <!-- Quick Search Button -->
          <button class="text-slate-500 hover:text-slate-800 dark:hover:text-white p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span class="material-symbols-outlined">search</span>
          </button>
          <!-- Live Time Tracker -->
          <span class="hidden sm:inline-flex bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-full font-label-sm text-xs font-semibold text-slate-600 dark:text-slate-300">
            24 พ.ค. 2026
          </span>
        </div>
      </header>

      <!-- Main Canvas Canvas Page Area -->
      <main class="flex-1 py-8 px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-8">
        
        <!-- Welcome Hero Banner -->
        <div class="bg-gradient-to-r from-teal-800 to-indigo-900 text-white rounded-3xl p-6 lg:p-8 shadow-md relative overflow-hidden flex flex-col justify-between h-48 group">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-120 transition-transform duration-500"></div>
          <div class="absolute right-10 bottom-0 w-80 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div>
            <h2 class="font-display-lg text-2xl lg:text-3xl font-extrabold tracking-tight">สวัสดีตอนบ่าย, เภสัชกรแอดมิน 👋</h2>
            <p class="font-body-md text-sm lg:text-base text-teal-100 max-w-xl mt-2 leading-relaxed">
              ภาพรวมการดำเนินงานของร้านยาอัจฉริยะ PharmaAI ระบบวิเคราะห์สุขภาพด้วย Gemini AI แชท และจัดการคลังข้อมูลจริงบน Supabase Postgres
            </p>
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <a href="/expiry-alerts" class="bg-white text-teal-900 hover:bg-teal-50 px-4 py-2 rounded-full font-label-md text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] icon-fill">notifications_active</span> Check Expiry Warnings
            </a>
            <a href="/chat" class="bg-teal-600/30 hover:bg-teal-600/50 text-white px-4 py-2 rounded-full font-label-md text-xs font-bold transition-all border border-teal-400/30 active:scale-95 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">forum</span> Open AI Assistant Chat
            </a>
          </div>
        </div>

        <!-- Bento Grid Summary KPI Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="kpi in dashboardData.kpis" 
            :key="kpi.id"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <!-- KPI top row -->
            <div class="flex items-center justify-between mb-4">
              <span class="font-label-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">{{ kpi.label }}</span>
              <div 
                class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
                :class="[
                  kpi.id === 'revenue' ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400' :
                  kpi.id === 'orders' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400' : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                ]"
              >
                <span class="material-symbols-outlined text-[22px] icon-fill">{{ kpi.icon }}</span>
              </div>
            </div>
            
            <!-- KPI Value row -->
            <div>
              <div class="font-display-lg text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                {{ kpi.value }}
                <span v-if="kpi.unit" class="text-sm font-normal text-slate-400 ml-1">{{ kpi.unit }}</span>
              </div>
              
              <!-- Substatus / Trend -->
              <div class="mt-4 flex items-center gap-1.5 text-xs">
                <span v-if="kpi.trend" class="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[14px]">trending_up</span>
                  +{{ kpi.trend.percentage }}%
                </span>
                <span v-if="kpi.trend" class="text-slate-400 dark:text-slate-500">เปรียบเทียบกับสัปดาห์ก่อน</span>
                
                <span v-if="kpi.status" class="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <span v-if="kpi.id === 'active-consultations'" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {{ kpi.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Alerts Row (Dual grid) -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          <!-- Column A: Top 5 Best Sellers Chart (Span 7) -->
          <div class="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-headline-md text-lg font-bold text-slate-900 dark:text-white">เวชภัณฑ์ยารักษาโรค 5 อันดับขายดีที่สุด</h3>
                <p class="font-body-md text-xs text-slate-400 dark:text-slate-500">คำนวณแบบพลวัตจากยอดขายทั้งหมดสะสมในฐานข้อมูลจริง</p>
              </div>
              <a href="/inventory" class="text-teal-600 dark:text-teal-400 font-label-md text-xs font-bold hover:underline flex items-center gap-0.5">
                ดูคลังสินค้าทั้งหมด <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>

            <!-- Charts Container -->
            <div class="flex-grow flex items-end gap-6 h-64 mt-4 border-b border-slate-200 dark:border-slate-800 pb-2 relative">
              
              <!-- Y-Axis Labels -->
              <div class="h-full flex flex-col justify-between text-[10px] text-slate-400 pr-4 pb-2 border-r border-slate-100 dark:border-slate-800 shrink-0 select-none">
                <span>4k units</span>
                <span>3k units</span>
                <span>2k units</span>
                <span>1k units</span>
                <span>0</span>
              </div>

              <!-- Bar Items -->
              <div class="flex-1 flex items-end justify-around h-full">
                <div 
                  v-for="(med, idx) in dashboardData.topMedicines" 
                  :key="med.name"
                  class="flex flex-col items-center group cursor-pointer w-12"
                >
                  <!-- Bar Graphic -->
                  <div
                    class="w-full rounded-t-xl relative transition-all duration-300 ease-out hover:brightness-110 shadow-xs"
                    :style="{
                      height: `${Math.min((med.value / 4000) * 100, 100)}%`,
                      backgroundColor: med.color,
                    }"
                  >
                    <!-- Hover Tooltip -->
                    <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg px-2.5 py-1 font-label-sm text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-10 whitespace-nowrap">
                      {{ med.value }} ชิ้น
                    </div>
                  </div>
                  <!-- Label text -->
                  <span class="font-label-sm text-[10px] text-slate-500 dark:text-slate-400 mt-3.5 text-center truncate w-full" :title="med.name">
                    {{ med.name }}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <!-- Column B: Low-Stock Alerts warnings (Span 5) -->
          <div class="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="font-headline-md text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-error icon-fill text-[20px]">warning</span>
                  แจ้งเตือนของใกล้หมดสต็อก
                </h3>
                <p class="font-body-md text-xs text-slate-400 dark:text-slate-500">รายการยาคงคลังที่มีปริมาณเหลือวิกฤต (น้อยกว่าหรือเท่ากับ 10 ชิ้น)</p>
              </div>
            </div>

            <!-- Alerts list feed -->
            <div class="flex-grow space-y-3.5">
              <div 
                v-for="item in lowStockProducts" 
                :key="item.id"
                class="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/10 hover:border-teal-200 dark:hover:border-teal-800/40 hover:bg-white dark:hover:bg-slate-800/20 transition-all"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-error/10 dark:bg-error/20 text-error rounded-xl flex items-center justify-center shrink-0 shadow-xs border border-error/5">
                    <span class="material-symbols-outlined text-[20px] icon-fill">inventory</span>
                  </div>
                  <div>
                    <h4 class="font-label-md text-xs font-bold text-slate-800 dark:text-white">{{ item.name }}</h4>
                    <p class="font-label-sm text-[10px] text-slate-400 dark:text-slate-500">{{ item.brand }} • {{ item.unit }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="text-right">
                    <span 
                      class="font-label-md text-xs font-bold"
                      :class="item.stock === 0 ? 'text-error' : 'text-orange-500'"
                    >
                      {{ item.stock === 0 ? 'ของหมดแล้ว' : `เหลือ ${item.stock} ชิ้น` }}
                    </span>
                  </div>
                  <button 
                    @click="orderReplenishment(item)"
                    class="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-full font-label-sm text-[10px] font-bold shadow-xs transition-colors active:scale-95"
                  >
                    สั่งเพิ่ม
                  </button>
                </div>
              </div>

              <!-- Empty stock alerts state -->
              <div v-if="lowStockProducts.length === 0" class="text-center py-12 text-slate-400">
                <span class="material-symbols-outlined text-4xl block mb-2 opacity-30 text-emerald-500">check_circle</span>
                ไม่มียาที่มีระดับคลังวิกฤต คลังยามีเสถียรภาพ!
              </div>
            </div>
          </div>

        </div>

        <!-- Latest Transactions / Real-Time Order Feed Section -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="font-headline-md text-lg font-bold text-slate-900 dark:text-white">รายการธุรกรรมคำสั่งซื้อล่าสุด</h3>
              <p class="font-body-md text-xs text-slate-400 dark:text-slate-500">ข้อมูลคำสั่งสั่งซื้อสดที่มีการชำระเงินเข้ามาล่าสุดจากโมดูลผู้ไข้</p>
            </div>
            <a href="/orders" class="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800 rounded-full font-label-md text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-xs">
              <span class="material-symbols-outlined text-[16px]">receipt_long</span> จัดการคำสั่งซื้อทั้งหมด
            </a>
          </div>

          <!-- Transaction Table -->
          <div class="overflow-x-auto border border-slate-200/60 dark:border-slate-800 rounded-2xl">
            <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead class="bg-slate-50 dark:bg-slate-800/40">
                <tr>
                  <th class="px-6 py-4 text-left font-label-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Transaction ID</th>
                  <th class="px-6 py-4 text-left font-label-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">วันที่สั่งซื้อ</th>
                  <th class="px-6 py-4 text-left font-label-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">ช่องทางชำระ</th>
                  <th class="px-6 py-4 text-left font-label-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">ยอดสุทธิ</th>
                  <th class="px-6 py-4 text-left font-label-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">สถานะจัดส่ง</th>
                  <th class="px-6 py-4 text-center font-label-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">รายละเอียด</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                <tr 
                  v-for="order in recentOrders" 
                  :key="order.id"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <!-- ID -->
                  <td class="px-6 py-4 font-label-md text-xs text-slate-800 dark:text-slate-200 font-bold">#{{ order.id }}</td>
                  
                  <!-- Date -->
                  <td class="px-6 py-4 font-body-md text-xs text-slate-500 dark:text-slate-400">{{ order.date }}</td>
                  
                  <!-- Payment -->
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-label-sm text-[10px] font-semibold border border-slate-200/20">
                      {{ order.paymentMethod }}
                    </span>
                  </td>

                  <!-- Total -->
                  <td class="px-6 py-4 font-label-md text-xs text-slate-800 dark:text-white font-extrabold">
                    ฿{{ order.total.toLocaleString() }}
                  </td>

                  <!-- Delivery Status Badge -->
                  <td class="px-6 py-4">
                    <span 
                      class="px-3 py-1 rounded-full font-label-sm text-[10px] font-bold border inline-flex items-center gap-1.5"
                      :class="[
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/40 dark:bg-emerald-950/20 dark:text-emerald-400' :
                        order.status === 'processing' ? 'bg-sky-50 text-sky-700 border-sky-200/40 dark:bg-sky-950/20 dark:text-sky-400' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200/40 dark:bg-red-950/20 dark:text-red-400' : 'bg-amber-50 text-amber-700 border-amber-200/40 dark:bg-amber-950/20 dark:text-amber-400'
                      ]"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" 
                            :class="[
                              order.status === 'completed' ? 'bg-emerald-500' :
                              order.status === 'processing' ? 'bg-sky-500' :
                              order.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                            ]"></span>
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>

                  <!-- Detail Action -->
                  <td class="px-6 py-4 text-center">
                    <button 
                      @click="viewTransactionDetails(order)"
                      class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full transition-colors active:scale-95"
                    >
                      <span class="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Page metadata
definePageMeta({
  layout: 'default',
})

// Fetch live dynamic aggregated dashboard statistics
const { data: dashboardResult } = useFetch<any>('/api/dashboard')

// Destructure reactive results
const dashboardData = computed(() => {
  if (dashboardResult.value?.success) {
    return dashboardResult.value
  }
  return {
    user: {
      name: 'ระบบจัดการแอดมิน',
      role: 'มุมมองเภสัชกร',
      version: 'v1.0.4',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxBLu7zT0jTqNe9TQngx_J3GsfySpVE1lxQOQcyZ26mDVejD0RSPb0PbLj_CmweAklHmXVk6Rq8PySysYwweBHZTpa1gM5nY3MLsyhR2piDo8G5_2CcRKIQvH9mil3m5cuncmBpdlYkKDqXy5uXKzvAMpDT4Q_HYOg3jMsf0h5eaWlNHSbefzMJsW28xyegn8TLNclHVeZWHnfuGh4X6Ut68qMU2Np6osxSQGQoSqqCpz9gcpGwCRwtioxqe5UbNOfItS333ifggY',
    },
    kpis: [],
    topMedicines: [],
    recentOrders: [],
    lowStockProducts: [],
  }
})

// Mappings & helpers
const userProfile = computed(() => dashboardData.value.user)
const recentOrders = computed(() => dashboardData.value.recentOrders || [])
const lowStockProducts = computed(() => dashboardData.value.lowStockProducts || [])

// Sidebar menuspec
const navigationMenu = [
  { label: 'ภาพรวมระบบ (Overview)', icon: 'dashboard', href: '/dashboard', isActive: true },
  { label: 'จัดการคลังสินค้า (Inventory)', icon: 'inventory_2', href: '/inventory', isActive: false },
  { label: 'ตรวจสอบยาหมดอายุ', icon: 'running_with_errors', href: '/expiry-alerts', isActive: false },
  { label: 'ประวัติธุรกรรมซื้อขาย', icon: 'receipt_long', href: '/orders', isActive: false },
  { label: 'ทดสอบเชื่อมฐานข้อมูลสด', icon: 'database', href: '/test-products', isActive: false },
  { label: 'แชทพูดคุยปรึกษา AI', icon: 'forum', href: '/chat', isActive: false },
  { label: 'กลับหน้าแรก (Portal Hub)', icon: 'home', href: '/', isActive: false },
]

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'รอดำเนินการ',
    processing: 'กำลังจัดส่ง',
    completed: 'จัดส่งสำเร็จ',
    cancelled: 'ยกเลิกแล้ว',
  }
  return labels[status] || status
}

// Proactive Mock action helpers
const orderReplenishment = (product: any) => {
  alert(`ส่งรายการจัดทำสั่งซื้อด่วนเติมสินค้าคงคลังสำหรับ "${product.name}" ไปยังระบบซื้อขายและซัพพลายเออร์สำเร็จ!`)
}

const viewTransactionDetails = (order: any) => {
  alert(`[ธุรกรรม #${order.id}]\nยอดชำระ: ฿${order.total.toLocaleString()}\nวันที่: ${order.date}\nช่องทาง: ${order.paymentMethod}\nสถานะ: ${getStatusLabel(order.status)}`)
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
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
