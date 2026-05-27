<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-5 antialiased" style="font-family: 'Plus Jakarta Sans', sans-serif;">
    <main class="w-full max-w-sm flex flex-col items-center animate-slideUp">

      <!-- Success Animation -->
      <div class="mb-8 relative flex items-center justify-center">
        <div class="absolute w-32 h-32 bg-teal-400/15 dark:bg-teal-500/10 rounded-full animate-ping" style="animation-duration: 2s;"></div>
        <div class="absolute w-24 h-24 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full"></div>
        <div class="relative z-10 w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-500/30 rotate-3 hover:rotate-0 transition-transform duration-500">
          <span class="material-symbols-outlined text-white icon-fill" style="font-size: 40px;">check_circle</span>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-black text-slate-900 dark:text-white text-center mb-2 tracking-tight">สั่งซื้อสำเร็จ! 🎉</h1>
      <p class="text-sm text-slate-400 dark:text-slate-500 text-center mb-8 leading-relaxed">
        {{ route.query.paymentMethod === 'COD'
          ? 'ยาของคุณกำลังเตรียมจัดส่ง รอชำระเงินปลายทาง'
          : 'ยาของคุณกำลังถูกจัดส่ง ชำระเงินสำเร็จแล้ว' }}
      </p>

      <!-- Receipt Card -->
      <div class="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/80 border border-slate-100 dark:border-slate-800 overflow-hidden mb-6">

        <!-- Receipt Header -->
        <div class="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-5">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-teal-100 text-[10px] font-bold uppercase tracking-widest">ใบสั่งซื้อ</p>
              <p class="text-white font-black text-lg">{{ order.orderNumber }}</p>
            </div>
            <div class="text-right">
              <p class="text-teal-100 text-[10px] font-bold uppercase tracking-widest">วันที่</p>
              <p class="text-white font-bold text-sm">{{ order.date }}</p>
            </div>
          </div>
        </div>

        <!-- Dashed separator -->
        <div class="relative py-3 px-6 flex items-center">
          <div class="w-5 h-5 bg-slate-50 dark:bg-slate-950 rounded-full absolute -left-2.5 border border-slate-100 dark:border-slate-800"></div>
          <div class="flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-700"></div>
          <div class="w-5 h-5 bg-slate-50 dark:bg-slate-950 rounded-full absolute -right-2.5 border border-slate-100 dark:border-slate-800"></div>
        </div>

        <!-- Receipt Content -->
        <div class="px-6 pb-6 space-y-5">
          <!-- Items -->
          <div>
            <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">รายการสินค้า</p>
            <div v-for="item in order.items" :key="item.name" class="flex justify-between items-center py-2">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 bg-teal-50 dark:bg-teal-950/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-teal-500 text-[16px] icon-fill">medication</span>
                </div>
                <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ item.name }}</p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-dashed border-slate-200 dark:border-slate-700"></div>

          <!-- Total -->
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-300">ยอดรวมทั้งหมด</span>
            <span class="text-xl font-black text-teal-600 dark:text-teal-400">{{ order.total }}</span>
          </div>

          <!-- Status -->
          <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">สถานะคำสั่งซื้อ</span>
            <div class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span class="material-symbols-outlined text-[16px] icon-fill">check_circle</span>
              <span class="text-xs font-black">{{ order.statusText }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="w-full space-y-3">
        <button
          @click="goToOrders"
          class="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white py-4 px-6 rounded-2xl font-black text-sm shadow-xl shadow-teal-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">local_shipping</span>
          ดูสถานะการจัดส่ง
        </button>
        <button
          @click="goHome"
          class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 py-4 px-6 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[16px]">home</span>
          กลับหน้าหลัก
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, navigateTo } from '#app'

const route = useRoute()

const orderId = computed(() => {
  const q = route.query.orderId as string
  if (!q) return '#PAI-9982'
  return q.startsWith('#') ? q : `#${q}`
})

const total = computed(() => {
  const t = route.query.total as string
  if (t) return `฿${parseFloat(t).toLocaleString()}`
  return '฿70'
})

const dateStr = computed(() => {
  const d = new Date()
  const monthsThai = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  return `${d.getDate()} ${monthsThai[d.getMonth()]} ${d.getFullYear() + 543}`
})

const order = computed(() => ({
  orderNumber: orderId.value,
  date: dateStr.value,
  items: [{ name: 'เวชภัณฑ์และยากลุ่มรักษาอาการตามแพทย์สั่ง' }],
  total: total.value,
  statusText: route.query.paymentMethod === 'COD' ? 'รอชำระเงินปลายทาง' : 'ชำระเงินแล้ว',
}))

const goToOrders = async () => await navigateTo('/orders')
const goHome = async () => await navigateTo('/chat')
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
