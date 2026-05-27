<template>
  <!-- ─── Hero Banner ───────────────────────────────────────────── -->
  <div class="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 rounded-3xl p-7 lg:p-9 text-white shadow-2xl shadow-teal-500/30">
    <!-- Decorative orbs -->
    <div class="absolute -right-10 -top-10 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    <div class="absolute right-20 bottom-0 w-32 h-32 bg-emerald-300/20 rounded-full blur-xl pointer-events-none"></div>
    <div class="absolute left-1/2 top-0 w-24 h-24 bg-teal-300/10 rounded-full blur-lg pointer-events-none"></div>

    <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold mb-4">
          <span class="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>
          ระบบออนไลน์ · Real-time
        </div>
        <h2 class="text-2xl lg:text-3xl font-black tracking-tight leading-tight">
          {{ greeting }}, {{ displayName }} 👋
        </h2>
        <p class="text-teal-100 text-sm mt-2 max-w-lg leading-relaxed">
          ภาพรวมร้านยาอัจฉริยะ PharmaAI — ข้อมูลสดจาก Supabase Postgres อัปเดตแบบเรียลไทม์
        </p>
      </div>
      <div class="flex flex-wrap gap-2.5 flex-shrink-0">
        <a href="/expiry-alerts" class="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-teal-900/10 active:scale-95">
          <span class="material-symbols-outlined text-[16px] icon-fill">notifications_active</span>
          ตรวจยาหมดอายุ
        </a>
        <a href="/chat" class="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95">
          <span class="material-symbols-outlined text-[16px]">forum</span>
          เปิดแชท AI
        </a>
      </div>
    </div>
  </div>

  <!-- ─── KPI Cards ─────────────────────────────────────────────── -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    <div
      v-for="kpi in dashboardData.kpis"
      :key="kpi.id"
      class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
    >
      <div class="flex items-start justify-between mb-5">
        <div>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">{{ kpi.label }}</p>
        </div>
        <div
          class="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300"
          :class="[
            kpi.id === 'revenue'              ? 'bg-teal-50 dark:bg-teal-950/40'   :
            kpi.id === 'orders'               ? 'bg-sky-50 dark:bg-sky-950/40'    :
                                                'bg-indigo-50 dark:bg-indigo-950/40'
          ]"
        >
          <span
            class="material-symbols-outlined text-[22px] icon-fill"
            :class="[
              kpi.id === 'revenue'   ? 'text-teal-600 dark:text-teal-400'   :
              kpi.id === 'orders'    ? 'text-sky-600 dark:text-sky-400'    :
                                       'text-indigo-600 dark:text-indigo-400'
            ]"
          >{{ kpi.icon }}</span>
        </div>
      </div>

      <div class="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
        {{ kpi.value }}
        <span v-if="kpi.unit" class="text-base font-medium text-slate-400 ml-1">{{ kpi.unit }}</span>
      </div>

      <div class="mt-3 flex items-center gap-1.5 text-xs">
        <span v-if="kpi.trend" class="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
          <span class="material-symbols-outlined text-[12px]">trending_up</span>
          +{{ kpi.trend.percentage }}%
        </span>
        <span v-if="kpi.trend" class="text-slate-400">เทียบสัปดาห์ก่อน</span>
        <span v-if="kpi.status" class="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
          <span v-if="kpi.id === 'active-consultations'" class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          {{ kpi.status }}
        </span>
      </div>
    </div>
  </div>

  <!-- ─── Chart + Low Stock Row ─────────────────────────────────── -->
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-5">

    <!-- Best Sellers Chart -->
    <div class="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-base font-black text-slate-900 dark:text-white">เวชภัณฑ์ขายดี 5 อันดับ</h3>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">คำนวณจากยอดขายสะสมจริงในฐานข้อมูล</p>
        </div>
        <a href="/inventory" class="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 text-xs font-bold hover:underline">
          ดูทั้งหมด <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
      </div>

      <div class="flex-grow flex items-end gap-4 h-56 mt-2 relative">
        <!-- Y-axis labels -->
        <div class="h-full flex flex-col justify-between text-[10px] text-slate-300 dark:text-slate-600 pr-3 pb-5 shrink-0 select-none text-right">
          <span>4k</span><span>3k</span><span>2k</span><span>1k</span><span>0</span>
        </div>
        <!-- Bars -->
        <div class="flex-1 flex items-end justify-around h-full gap-2 pb-5">
          <div
            v-for="med in dashboardData.topMedicines"
            :key="med.name"
            class="flex flex-col items-center group cursor-pointer flex-1 h-full justify-end"
          >
            <!-- Bar Container (resolves height via flex-1) -->
            <div class="w-full flex-1 flex items-end mb-2 relative">
              <div
                class="w-full rounded-t-2xl relative transition-all duration-500 ease-out hover:brightness-110 hover:-translate-y-1 shadow-sm"
                :style="{ height: `${Math.min((med.value / 4000) * 100, 100)}%`, backgroundColor: med.color }"
              >
                <!-- Tooltip -->
                <div class="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg px-2.5 py-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10 whitespace-nowrap">
                  {{ med.value.toLocaleString() }} ชิ้น
                </div>
              </div>
            </div>
            <span class="text-[9px] text-slate-400 dark:text-slate-500 text-center w-full truncate font-semibold" :title="med.name">{{ med.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Low Stock Alerts -->
    <div class="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block"></span>
            แจ้งเตือนสต็อกวิกฤต
          </h3>
          <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">ยาที่มีปริมาณเหลือ ≤ 10 ชิ้น</p>
        </div>
      </div>

      <div class="flex-grow space-y-3">
        <div
          v-for="item in lowStockProducts"
          :key="item.id"
          class="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/10 hover:border-red-200 dark:hover:border-red-800/40 hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all group"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-[18px] icon-fill">medication</span>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-800 dark:text-white">{{ item.name }}</p>
              <p class="text-[10px] text-slate-400">{{ item.brand }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-black" :class="item.stock === 0 ? 'text-red-600' : 'text-orange-500'">
              {{ item.stock === 0 ? 'หมดแล้ว' : `${item.stock} ชิ้น` }}
            </span>
            <button
              @click="orderReplenishment(item)"
              class="px-3 py-1.5 bg-slate-900 dark:bg-white hover:bg-teal-600 dark:hover:bg-teal-600 text-white dark:text-slate-900 dark:hover:text-white rounded-xl text-[10px] font-black transition-all active:scale-95"
            >สั่งเพิ่ม</button>
          </div>
        </div>

        <div v-if="lowStockProducts.length === 0" class="flex flex-col items-center py-10 text-slate-400">
          <span class="material-symbols-outlined text-4xl text-emerald-400 mb-2">check_circle</span>
          <p class="text-xs font-semibold">คลังยามีเสถียรภาพ</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── Transactions Table ────────────────────────────────────── -->
  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
    <div class="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
      <div>
        <h3 class="text-base font-black text-slate-900 dark:text-white">ธุรกรรมล่าสุด</h3>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">คำสั่งซื้อที่เข้ามาล่าสุดจากลูกค้า</p>
      </div>
      <a href="/orders" class="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 px-4 py-2 rounded-xl text-xs font-bold transition-all">
        <span class="material-symbols-outlined text-[16px]">receipt_long</span>
        จัดการทั้งหมด
      </a>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/50">
            <th class="px-6 py-4 text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold">Transaction ID</th>
            <th class="px-6 py-4 text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold">วันที่</th>
            <th class="px-6 py-4 text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold">ช่องทาง</th>
            <th class="px-6 py-4 text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold">ยอด</th>
            <th class="px-6 py-4 text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold">สถานะ</th>
            <th class="px-6 py-4 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">รายละเอียด</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
          <tr
            v-for="order in recentOrders"
            :key="order.id"
            class="hover:bg-slate-50/70 dark:hover:bg-slate-800/20 transition-colors"
          >
            <td class="px-6 py-4 text-xs font-black text-slate-800 dark:text-slate-200">#{{ order.id }}</td>
            <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{{ order.date }}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-semibold">
                <span class="material-symbols-outlined text-[12px]">{{ order.paymentMethod === 'PromptPay' ? 'qr_code_2' : 'local_shipping' }}</span>
                {{ order.paymentMethod }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">฿{{ order.total.toLocaleString() }}</td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                :class="[
                  order.status === 'completed'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30' :
                  order.status === 'processing' ? 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30' :
                  order.status === 'cancelled'  ? 'bg-red-50 text-red-700 border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30' :
                                                  'bg-slate-100 text-slate-600 border-slate-200/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full"
                  :class="[
                    order.status === 'completed'  ? 'bg-emerald-500' :
                    order.status === 'processing' ? 'bg-amber-500 animate-pulse' :
                    order.status === 'cancelled'  ? 'bg-red-500' : 'bg-slate-400'
                  ]"
                ></span>
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <button
                @click="viewTransactionDetails(order)"
                class="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 rounded-xl transition-all active:scale-95"
              >
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ─── Beautiful Custom Replenishment Modal Overlay ─── -->
  <div
    v-if="selectedProductForReplenish"
    class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity duration-300"
    @click.self="selectedProductForReplenish = null"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-250 flex flex-col animate-slideUp"
    >
      <!-- Modal Header with gradient banner -->
      <div class="p-6 pb-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/20 text-teal-700 dark:text-teal-400 relative flex items-center gap-3 shrink-0">
        <div class="w-10 h-10 bg-white dark:bg-slate-850 rounded-2xl flex items-center justify-center shadow-xs">
          <span class="material-symbols-outlined text-[22px] icon-fill text-teal-600 dark:text-teal-400">local_shipping</span>
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">สั่งซื้อเวชภัณฑ์เติมสต็อก</h3>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">เพิ่มจำนวนสินค้าในระบบคลังโดยตรง</p>
        </div>
        
        <!-- Close Button -->
        <button
          @click="selectedProductForReplenish = null"
          class="absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-90"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <!-- Modal Body Content -->
      <div class="p-6 space-y-5">
        <!-- Product card summary -->
        <div class="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
            <span class="material-symbols-outlined text-slate-400 text-[26px]">medication</span>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-black text-slate-850 dark:text-slate-200 truncate">{{ selectedProductForReplenish.name }}</h4>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">คงเหลือปัจจุบัน: 
              <span class="text-slate-750 dark:text-slate-300 font-black">{{ selectedProductForReplenish.stock }} ชิ้น</span>
            </p>
          </div>
        </div>

        <!-- Quantity selection and stepper -->
        <div class="space-y-2">
          <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ระบุจำนวนที่ต้องการสั่งเติม</label>
          <div class="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-850 rounded-2xl p-2">
            <button
              @click="replenishQty > 10 ? replenishQty -= 10 : null"
              :disabled="replenishQty <= 10"
              class="w-10 h-10 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 text-slate-800 dark:text-slate-205 rounded-xl flex items-center justify-center text-sm font-black transition-all border border-slate-100 dark:border-slate-800 shadow-3xs"
            >
              -10
            </button>
            
            <!-- Input field to enter custom number -->
            <input
              v-model.number="replenishQty"
              type="number"
              min="1"
              class="w-24 text-center bg-transparent border-0 outline-none text-base font-black text-slate-850 dark:text-white"
            />
            
            <button
              @click="replenishQty += 10"
              class="w-10 h-10 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-205 rounded-xl flex items-center justify-center text-sm font-black transition-all border border-slate-100 dark:border-slate-800 shadow-3xs"
            >
              +10
            </button>
          </div>
        </div>

        <!-- Quick presets selectors -->
        <div class="space-y-1.5">
          <span class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">เลือกจำนวนแบบด่วน</span>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="preset in [50, 100, 200, 500]"
              :key="preset"
              @click="replenishQty = preset"
              class="py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 border"
              :class="replenishQty === preset 
                ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-500/25' 
                : 'bg-white dark:bg-slate-855 text-slate-655 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'"
            >
              +{{ preset }}
            </button>
          </div>
        </div>

        <!-- Total display -->
        <div class="border-t border-slate-150 dark:border-slate-800 pt-4 flex justify-between items-center text-xs">
          <span class="text-slate-455 dark:text-slate-500 font-bold">สต็อกหลังการสั่งเติม:</span>
          <span class="text-slate-800 dark:text-white font-black text-sm">
            {{ (selectedProductForReplenish.stock + replenishQty).toLocaleString() }} ชิ้น
          </span>
        </div>
      </div>

      <!-- Modal Footer Actions -->
      <div class="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 shrink-0">
        <button
          @click="selectedProductForReplenish = null"
          class="flex-1 bg-white dark:bg-slate-855 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-355 py-3 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-800 transition-all active:scale-95 shadow-3xs"
        >
          ยกเลิก
        </button>
        
        <button
          @click="submitReplenishment"
          class="flex-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white py-3 px-6 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/20 active:scale-95 hover:-translate-y-0.5"
        >
          <span class="material-symbols-outlined text-[16px] icon-fill">done</span>
          <span>ยืนยันเติมสต็อก</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ─── Beautiful Custom Transaction Detail Modal Overlay ─── -->
  <div
    v-if="selectedTransactionForDetail"
    class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity duration-300"
    @click.self="selectedTransactionForDetail = null"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh] animate-slideUp"
    >
      <!-- Modal Header with gradient banner -->
      <div class="p-6 pb-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/20 text-indigo-750 dark:text-indigo-400 relative flex items-center gap-3 shrink-0">
        <div class="w-10 h-10 bg-white dark:bg-slate-855 rounded-2xl flex items-center justify-center shadow-xs">
          <span class="material-symbols-outlined text-[22px] icon-fill text-indigo-600 dark:text-indigo-400">receipt_long</span>
        </div>
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">รายละเอียดธุรกรรมคำสั่งซื้อ</h3>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">ข้อมูลใบเสร็จและประวัติเวชภัณฑ์คำสั่งซื้อ</p>
        </div>
        
        <!-- Close Button -->
        <button
          @click="selectedTransactionForDetail = null"
          class="absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-90"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <!-- Modal Body Content (Scrollable) -->
      <div class="p-6 space-y-5 overflow-y-auto flex-grow">
        <!-- Transaction Info Row -->
        <div class="grid grid-cols-2 gap-4 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl">
          <div>
            <span class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">รหัสธุรกรรม</span>
            <span class="text-xs font-black text-slate-800 dark:text-white mt-1 block">#{{ selectedTransactionForDetail.id }}</span>
          </div>
          <div>
            <span class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">วันที่ทำรายการ</span>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 block">{{ selectedTransactionForDetail.date }}</span>
          </div>
          <div class="mt-2">
            <span class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ช่องทางการชำระเงิน</span>
            <span class="inline-flex items-center gap-1 mt-1 text-xs font-bold text-slate-750 dark:text-slate-350">
              <span class="material-symbols-outlined text-[14px]">{{ selectedTransactionForDetail.paymentMethod === 'PromptPay' ? 'qr_code_2' : 'local_shipping' }}</span>
              {{ selectedTransactionForDetail.paymentMethod }}
            </span>
          </div>
          <div class="mt-2">
            <span class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">สถานะคำสั่งซื้อ</span>
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border mt-1"
              :class="[
                selectedTransactionForDetail.status === 'completed'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30' :
                selectedTransactionForDetail.status === 'processing' ? 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30' :
                selectedTransactionForDetail.status === 'cancelled'  ? 'bg-red-50 text-red-700 border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30' :
                                                                        'bg-slate-100 text-slate-600 border-slate-200/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50'
              ]"
            >
              {{ getStatusLabel(selectedTransactionForDetail.status) }}
            </span>
          </div>
        </div>

        <!-- Ordered Items Section -->
        <div class="space-y-2.5">
          <h4 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">medication</span>
            รายการเวชภัณฑ์ยาที่สั่งซื้อ
          </h4>
          <div class="border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <div
              v-for="item in selectedTransactionForDetail.items"
              :key="item.product_id"
              class="p-3.5 flex justify-between items-center text-xs hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors"
            >
              <div>
                <p class="font-bold text-slate-800 dark:text-slate-200">
                  {{ productLookup[item.product_id]?.name || item.product_id }}
                </p>
                <p class="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                  {{ productLookup[item.product_id]?.brand || 'เวชภัณฑ์ยา' }} · ฿{{ item.price }} / {{ productLookup[item.product_id]?.unit || 'ชิ้น' }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-black text-slate-800 dark:text-white">฿{{ (item.price * item.qty).toLocaleString() }}</p>
                <p class="text-[9px] text-slate-400 font-bold mt-0.5">จำนวน x{{ item.qty }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="bg-slate-50/40 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl space-y-2.5 text-xs">
          <div class="flex justify-between text-slate-500">
            <span>ค่ายารวม</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">฿{{ (selectedTransactionForDetail.total - (selectedTransactionForDetail.shippingFee || 50)).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>ค่าจัดส่งด่วน</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">฿{{ selectedTransactionForDetail.shippingFee || 50 }}</span>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-800/80 pt-2.5 flex justify-between items-center text-slate-900 dark:text-white font-black">
            <span>ยอดชำระสุทธิ</span>
            <span class="text-sm text-indigo-600 dark:text-emerald-400">฿{{ selectedTransactionForDetail.total.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Shipping Address details -->
        <div v-if="selectedTransactionForDetail.shippingAddress" class="space-y-1.5">
          <h4 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">location_on</span>
            ที่อยู่ในการจัดส่ง
          </h4>
          <p class="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-3.5 rounded-2xl">
            {{ selectedTransactionForDetail.shippingAddress }}
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 shrink-0">
        <button
          @click="selectedTransactionForDetail = null"
          class="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 text-center shadow-sm"
        >
          ปิดหน้าต่างใบเสร็จ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'admin' })

const { getSession } = useAuth()
const session = ref<ReturnType<typeof getSession> | null>(null)
const dashboardData = ref<any>({
  user: { name: 'ระบบจัดการแอดมิน', role: 'มุมมองเภสัชกร', version: 'v1.0.4' },
  kpis: [], topMedicines: [], recentOrders: [], lowStockProducts: [],
})
const isLoading = ref(true)
const errorMessage = ref('')

const displayName = computed(() => session.value?.fullName?.trim() || 'ผู้ดูแลระบบ')
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'สวัสดีตอนเช้า'
  if (h < 17) return 'สวัสดีตอนบ่าย'
  return 'สวัสดีตอนเย็น'
})

const getAuthHeaders = () => ({
  'x-user-role': session.value?.role || '',
  'x-user-id': session.value?.id?.toString() || '',
})

const fetchDashboardData = async () => {
  if (!process.client) return
  session.value = getSession()
  if (!session.value) { isLoading.value = false; return }
  try {
    const response = await $fetch<any>('/api/dashboard', { method: 'GET', headers: getAuthHeaders() })
    if (response?.success) dashboardData.value = response
    else errorMessage.value = response?.error || 'ไม่สามารถโหลดข้อมูลได้'
  } catch (error: any) {
    errorMessage.value = error.message || 'เกิดข้อผิดพลาด'
  } finally {
    isLoading.value = false
  }
}

const selectedTransactionForDetail = ref<any | null>(null)
const products = ref<any[]>([])

const fetchProducts = async () => {
  try {
    const response = await $fetch<any>('/api/products')
    if (response?.success) {
      products.value = response.products || []
    }
  } catch (err) {
    console.error('Failed to load products:', err)
  }
}

const productLookup = computed(() => {
  const map: Record<string, any> = {}
  products.value.forEach(p => {
    map[p.id] = p
  })
  return map
})

onMounted(async () => {
  await fetchDashboardData()
  await fetchProducts()
})

const recentOrders = computed(() => dashboardData.value.recentOrders || [])
const lowStockProducts = computed(() => dashboardData.value.lowStockProducts || [])

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'รอดำเนินการ', processing: 'กำลังจัดส่ง',
    completed: 'จัดส่งสำเร็จ', cancelled: 'ยกเลิกแล้ว',
  }
  return labels[status] || status
}

const selectedProductForReplenish = ref<any | null>(null)
const replenishQty = ref(100)

const orderReplenishment = (product: any) => {
  selectedProductForReplenish.value = product
  replenishQty.value = 50
}

const submitReplenishment = async () => {
  if (!selectedProductForReplenish.value) return
  const product = selectedProductForReplenish.value
  const qty = replenishQty.value
  if (isNaN(qty) || qty <= 0) {
    alert("กรุณากรอกจำนวนที่ถูกต้อง (มากกว่า 0)")
    return
  }

  try {
    const response = await $fetch<any>('/api/products', {
      method: 'PATCH',
      body: {
        productId: product.id,
        stockToAdd: qty
      }
    })
    if (response?.success) {
      alert(`เติมสต็อกยา "${product.name}" จำนวน +${qty} ชิ้น เข้าสู่คลังสินค้าและฐานข้อมูลเรียบร้อย!`)
      selectedProductForReplenish.value = null
      await fetchDashboardData()
    } else {
      alert(response?.error || 'ไม่สามารถเติมสินค้าได้')
    }
  } catch (err: any) {
    alert(err.message || 'เกิดข้อผิดพลาด')
  }
}

const viewTransactionDetails = (order: any) => {
  selectedTransactionForDetail.value = order
}
</script>
