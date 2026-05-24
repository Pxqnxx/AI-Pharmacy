<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8">
      <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2">ตั้งค่าระบบ</h2>
      <p class="font-body-md text-body-md text-on-surface-variant">ปรับแต่งบัญชีการใช้งาน การแจ้งเตือน และการเข้าถึงระบบ</p>
    </div>

    <!-- Role Switch Premium Card -->
    <div class="mb-gutter bg-secondary-container/10 border border-secondary/20 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group">
      <div class="absolute -right-10 -bottom-10 w-36 h-36 bg-secondary/5 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-500"></div>
      <div class="flex items-start gap-4">
        <div class="p-3.5 bg-secondary/15 text-secondary rounded-xl shrink-0">
          <span class="material-symbols-outlined text-[32px] icon-fill">shield_person</span>
        </div>
        <div>
          <h3 class="font-headline-md text-headline-md text-secondary mb-1">บัญชีผู้ดูแลระบบ / เภสัชกร</h3>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-lg">คุณเป็นผู้ดูแลระบบด้วยบทบาทเภสัชกร สามารถสลับเข้าไปดูภาพรวมร้านยา แดชบอร์ดวิเคราะห์ยอดขาย และสต็อกสินค้าได้ทันที</p>
        </div>
      </div>
      <NuxtLink
        to="/dashboard"
        class="bg-secondary text-on-secondary hover:bg-secondary-container/85 px-6 py-3 rounded-full font-label-md text-label-md shadow-md transition-all active:scale-95 whitespace-nowrap z-10 shrink-0"
      >
        เข้าสู่ระบบแอดมิน
      </NuxtLink>
    </div>

    <!-- Main Settings Bento Boxes -->
    <div class="space-y-6">
      <!-- Section 1: User Profile Mock -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <h3 class="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">person</span>
          โปรไฟล์และบัญชี
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-on-surface-variant font-bold">ชื่อ - นามสกุล</label>
            <input 
              type="text" 
              value="คุณ ณิชชา วงศ์อุดม" 
              class="bg-surface-container-low border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none font-body-md text-body-md text-on-surface"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-on-surface-variant font-bold">อีเมล</label>
            <input 
              type="email" 
              value="nitcha.w@pharmaai.com" 
              class="bg-surface-container-low border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none font-body-md text-body-md text-on-surface"
            />
          </div>
        </div>
      </div>

      <!-- Section 2: Notifications and Preferences -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <h3 class="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">notifications</span>
          การตั้งค่าแอปพลิเคชัน
        </h3>

        <div class="divide-y divide-outline-variant space-y-4">
          <!-- Notification Switch -->
          <div class="flex items-center justify-between pt-4 first:pt-0">
            <div>
              <h4 class="font-label-md text-label-md font-bold text-on-surface">การแจ้งเตือนความคืบหน้าคำสั่งซื้อ</h4>
              <p class="font-label-sm text-label-sm text-on-surface-variant mt-0.5">รับข้อความแจ้งเตือนทางมือถือเมื่อยาของคุณอยู่ในระหว่างจัดส่ง</p>
            </div>
            <button 
              class="w-12 h-6 rounded-full transition-all relative outline-none"
              :class="isNotifyEnabled ? 'bg-primary' : 'bg-outline-variant'"
              @click="isNotifyEnabled = !isNotifyEnabled"
            >
              <div 
                class="w-4.5 h-4.5 bg-white rounded-full absolute top-0.75 left-0.75 transition-all shadow-sm"
                :style="{ transform: isNotifyEnabled ? 'translateX(24px)' : 'none' }"
              ></div>
            </button>
          </div>

          <!-- Share health data switch -->
          <div class="flex items-center justify-between pt-4">
            <div>
              <h4 class="font-label-md text-label-md font-bold text-on-surface">การแชร์ข้อมูลสุขภาพกับ AI เภสัชกร</h4>
              <p class="font-label-sm text-label-sm text-on-surface-variant mt-0.5">อนุญาตให้ AI อ่านข้อมูลสุขภาพ (ดัชนีมวลกาย, โรคประจำตัว) เพื่อการคัดกรองยาที่ถูกต้องแม่นยำ</p>
            </div>
            <button 
              class="w-12 h-6 rounded-full transition-all relative outline-none"
              :class="isShareDataEnabled ? 'bg-primary' : 'bg-outline-variant'"
              @click="isShareDataEnabled = !isShareDataEnabled"
            >
              <div 
                class="w-4.5 h-4.5 bg-white rounded-full absolute top-0.75 left-0.75 transition-all shadow-sm"
                :style="{ transform: isShareDataEnabled ? 'translateX(24px)' : 'none' }"
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
})

// Switches reactive states
const isNotifyEnabled = ref(true)
const isShareDataEnabled = ref(true)
</script>
