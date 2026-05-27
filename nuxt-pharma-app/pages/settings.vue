<template>
  <div class="space-y-6 max-w-2xl" style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- Header -->
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="material-symbols-outlined text-teal-500 text-[26px] icon-fill">settings</span>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">ตั้งค่าระบบ</h2>
      </div>
      <p class="text-xs text-slate-400 dark:text-slate-500 ml-9">ปรับแต่งบัญชีการใช้งาน การแจ้งเตือน และการเข้าถึงระบบ</p>
    </div>

    <!-- Admin Access Card -->
    <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
      <div class="absolute -right-10 -top-10 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute right-10 bottom-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
      <div class="relative z-10 flex items-start gap-4">
        <div class="p-3 bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-2xl flex-shrink-0">
          <span class="material-symbols-outlined text-[28px] icon-fill">shield_person</span>
        </div>
        <div>
          <h3 class="text-base font-black text-white mb-1">บัญชีผู้ดูแลระบบ / เภสัชกร</h3>
          <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
            คุณเป็นผู้ดูแลระบบด้วยบทบาทเภสัชกร สามารถเข้าดูแดชบอร์ดและจัดการคลังยาได้
          </p>
        </div>
      </div>
      <NuxtLink
        to="/dashboard"
        class="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-teal-500/25 transition-all active:scale-95 whitespace-nowrap"
      >
        <span class="material-symbols-outlined text-[15px]">dashboard</span>
        เข้าสู่แดชบอร์ดแอดมิน
      </NuxtLink>
    </div>

    <!-- Profile Section -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
        <span class="material-symbols-outlined text-teal-500 text-[20px]">person</span>
        <h3 class="text-sm font-black text-slate-900 dark:text-white">โปรไฟล์และบัญชี</h3>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">ชื่อ - นามสกุล</label>
          <input
            type="text"
            value="คุณ ณิชชา วงศ์อุดม"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all font-medium"
          />
        </div>
        <div class="space-y-1.5">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">อีเมล</label>
          <input
            type="email"
            value="nitcha.w@pharmaai.com"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all font-medium"
          />
        </div>
      </div>
      <div class="px-6 pb-6">
        <button class="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all active:scale-95">
          <span class="material-symbols-outlined text-[16px]">save</span>
          บันทึกการเปลี่ยนแปลง
        </button>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
        <span class="material-symbols-outlined text-teal-500 text-[20px]">notifications</span>
        <h3 class="text-sm font-black text-slate-900 dark:text-white">การตั้งค่าแอปพลิเคชัน</h3>
      </div>
      <div class="divide-y divide-slate-50 dark:divide-slate-800/50">

        <!-- Toggle: Notifications -->
        <div class="flex items-center justify-between px-6 py-5">
          <div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">การแจ้งเตือนคำสั่งซื้อ</h4>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">รับการแจ้งเตือนเมื่อยาของคุณอยู่ในระหว่างจัดส่ง</p>
          </div>
          <button
            class="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
            :class="isNotifyEnabled ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-slate-200 dark:bg-slate-700'"
            @click="isNotifyEnabled = !isNotifyEnabled"
          >
            <div
              class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
              :style="{ transform: isNotifyEnabled ? 'translateX(24px)' : 'translateX(2px)' }"
            ></div>
          </button>
        </div>

        <!-- Toggle: Data Sharing -->
        <div class="flex items-center justify-between px-6 py-5">
          <div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">แชร์ข้อมูลสุขภาพกับ AI</h4>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">อนุญาตให้ AI อ่านข้อมูลสุขภาพเพื่อการแนะนำยาที่แม่นยำ</p>
          </div>
          <button
            class="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
            :class="isShareDataEnabled ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-slate-200 dark:bg-slate-700'"
            @click="isShareDataEnabled = !isShareDataEnabled"
          >
            <div
              class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
              :style="{ transform: isShareDataEnabled ? 'translateX(24px)' : 'translateX(2px)' }"
            ></div>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'default' })

const isNotifyEnabled = ref(true)
const isShareDataEnabled = ref(true)
</script>
