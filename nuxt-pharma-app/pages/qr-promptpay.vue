<template>
  <NuxtLayout :name="layoutName">
    <div class="space-y-6 animate-slideUp" style="font-family: 'Plus Jakarta Sans', sans-serif;">

      <!-- Header -->
      <div>
        <NuxtLink to="/checkout" class="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold mb-3 transition-colors group">
          <span class="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          กลับไปแก้ไขรายการสั่งซื้อ
        </NuxtLink>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">ชำระเงินค่ายา</h2>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">สแกน QR Code ด้วยแอปพลิเคชันธนาคารเพื่อชำระเงินผ่าน PromptPay</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">

        <!-- QR Card -->
        <div class="md:col-span-7">
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center shadow-xl shadow-slate-200/40 dark:shadow-slate-900/60">

            <!-- PromptPay Header -->
            <div class="w-full flex items-center justify-center gap-2.5 mb-5 py-3 bg-gradient-to-r from-[#00274c] to-[#003d75] text-white rounded-2xl shadow-md shadow-[#00274c]/30">
              <span class="font-black text-sm tracking-widest uppercase">Prompt Pay</span>
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <!-- Timer -->
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">รหัส QR จะหมดอายุภายใน</p>
            <div class="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/40 px-5 py-2 rounded-full mb-6 font-black text-sm">
              <span class="material-symbols-outlined text-[18px]" style="animation: spin 2s linear infinite;">hourglass_empty</span>
              09:59 นาที
            </div>

            <!-- QR Code -->
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-3xl blur-xl scale-110"></div>
              <div class="relative w-56 h-56 bg-white border-4 border-white rounded-3xl p-3 shadow-2xl shadow-teal-500/15">
                <img
                  :src="`https://promptpay.io/0888888888/${totalQuery}.png`"
                  alt="PromptPay QR Code"
                  class="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            <!-- Amount -->
            <div class="text-center mb-5">
              <p class="text-3xl font-black text-slate-900 dark:text-white">฿{{ totalQuery.toLocaleString('th-TH', { minimumFractionDigits: 2 }) }}</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">อ้างอิงคำสั่งซื้อ: <span class="font-bold text-slate-600 dark:text-slate-300">{{ orderIdQuery }}</span></p>
            </div>

            <!-- Info Notice -->
            <div class="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-4 rounded-2xl w-full text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <span class="material-symbols-outlined text-teal-500 text-[18px] flex-shrink-0 mt-0.5">info</span>
              <span>ระบบจัดทำ QR Code สำหรับการชำระเงินเสร็จสมบูรณ์ เมื่อทำรายการสำเร็จระบบจะอัปเดตสถานะคำสั่งซื้อโดยอัตโนมัติ</span>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="md:col-span-5 space-y-5">

          <!-- Order Summary -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
            <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">สรุปรายการจ่ายบิล</h3>
            <div class="space-y-3 text-xs">
              <div class="flex justify-between items-start gap-4">
                <div>
                  <p class="font-bold text-slate-700 dark:text-slate-200">ชุดเวชภัณฑ์และยารักษาอาการ</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">แนะนำโดยเภสัชกรอัจฉริยะ PAI</p>
                </div>
                <span class="font-black text-slate-800 dark:text-slate-100 flex-shrink-0">฿{{ subtotalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="border-t border-dashed border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                <div class="flex justify-between text-slate-400">
                  <span>ค่ายารวม</span><span>฿{{ subtotalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 }) }}</span>
                </div>
                <div class="flex justify-between text-slate-400">
                  <span>ค่าจัดส่งและแพ็กยา</span><span>฿{{ shippingFeeQuery.toLocaleString('th-TH', { minimumFractionDigits: 2 }) }}</span>
                </div>
                <div class="flex justify-between font-black text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span class="text-teal-600 dark:text-teal-400">ยอดชำระสุทธิ</span>
                  <span class="text-teal-600 dark:text-teal-400">฿{{ totalQuery.toLocaleString('th-TH', { minimumFractionDigits: 2 }) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Steps -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
            <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">สถานะการชำระเงิน</h3>
            <div class="space-y-4">

              <!-- Step 1 -->
              <div class="flex gap-3">
                <div class="flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
                    <span class="material-symbols-outlined text-white text-[14px] icon-fill">done</span>
                  </div>
                  <div class="w-0.5 h-full bg-slate-100 dark:bg-slate-800 mt-2 min-h-[20px]"></div>
                </div>
                <div class="pb-4">
                  <p class="text-xs font-bold text-teal-600 dark:text-teal-400">สร้างคำสั่งซื้อสำเร็จ</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">ระบบบันทึกออร์เดอร์เข้าสู่คลังเรียบร้อย</p>
                </div>
              </div>

              <!-- Step 2 -->
              <div class="flex gap-3">
                <div class="flex flex-col items-center">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    :class="paymentSuccess ? 'bg-gradient-to-br from-teal-500 to-emerald-500 shadow-teal-500/20' : 'bg-teal-500/20 border-2 border-teal-500'"
                  >
                    <span v-if="paymentSuccess" class="material-symbols-outlined text-white text-[14px] icon-fill">done</span>
                    <span v-else class="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse inline-block"></span>
                  </div>
                  <div class="w-0.5 h-full bg-slate-100 dark:bg-slate-800 mt-2 min-h-[20px]"></div>
                </div>
                <div class="pb-4">
                  <p class="text-xs font-bold" :class="paymentSuccess ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-200'">
                    {{ paymentSuccess ? 'สแกนสำเร็จ ตรวจพบยอดเงิน' : 'รอยืนยันการสแกน QR' }}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-0.5">
                    {{ paymentSuccess ? 'ระบบธนาคารได้รับการชำระเงินแล้ว' : 'กำลังสื่อสารกับ PromptPay...' }}
                  </p>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="flex gap-3">
                <div class="flex flex-col items-center">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="paymentSuccess ? 'bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800'"
                  >
                    <span v-if="paymentSuccess" class="material-symbols-outlined text-white text-[14px] icon-fill">done</span>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-bold" :class="paymentSuccess ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'">ชำระเงินเสร็จสิ้น & เตรียมจัดส่ง</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">ทีมเภสัชกรเตรียมแพ็กยาและนำส่ง</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: false })

const route = useRoute()
const { getSession } = useAuth()
const session = getSession()

if (!session && process.client) await navigateTo('/')

const layoutName = computed(() => session?.role === 'pharmacist' ? 'admin' : 'user')

const orderIdQuery = computed(() => (route.query.orderId as string) || 'PAI-88291')
const totalQuery = computed(() => {
  const q = route.query.total as string
  if (q) return parseFloat(q)
  return 1250
})
const shippingFeeQuery = computed(() => 50)
const subtotalPrice = computed(() => totalQuery.value - shippingFeeQuery.value)

const paymentSuccess = ref(false)

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      paymentSuccess.value = true
      setTimeout(async () => {
        await navigateTo(`/order-success?orderId=${orderIdQuery.value}&total=${totalQuery.value}`)
      }, 1800)
    }, 3800)
  }
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.icon-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
