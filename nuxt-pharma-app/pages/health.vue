<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2">โปรไฟล์สุขภาพของฉัน</h2>
        <p class="font-body-md text-body-md text-on-surface-variant">ข้อมูลทางการแพทย์ที่เชื่อมต่อกับการประเมินโดย AI เภสัชกร</p>
      </div>
      <div class="flex items-center gap-3 bg-surface-container rounded-xl p-3 border border-outline-variant/30 max-w-xs">
        <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-300 flex-shrink-0">
          <span class="material-symbols-outlined icon-fill text-[20px]">verified_user</span>
        </div>
        <div>
          <h3 class="font-label-md text-label-md font-bold text-on-surface">ยืนยันตัวตนแล้ว</h3>
          <p class="font-label-sm text-[11px] text-on-surface-variant">ข้อมูลอัปเดตเมื่อ: วันนี้ 08:30</p>
        </div>
      </div>
    </div>

    <!-- Drug Allergy Warning Center -->
    <div class="mb-gutter bg-error-container/10 border border-error/20 rounded-2xl p-5 flex items-start gap-4">
      <div class="p-3 bg-error/15 text-error rounded-xl shrink-0">
        <span class="material-symbols-outlined text-[28px] icon-fill">warning_amber</span>
      </div>
      <div class="flex-grow">
        <h3 class="font-headline-md text-headline-md text-error mb-1">การแพ้ยา & ข้อควรระวังพิเศษ</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-3">ระบบจ่ายยาร้านยาและ AI เภสัชกรได้บล็อกการสั่งซื้อยาในกลุ่มเหล่านี้เพื่อความปลอดภัยสูงสุดของคุณ</p>
        <div class="flex flex-wrap gap-2">
          <span class="px-3.5 py-1.5 bg-error/10 text-error border border-error/20 rounded-full font-label-md text-label-md flex items-center gap-1.5">
            <span class="w-2 h-2 bg-error rounded-full animate-pulse"></span>
            กลุ่มยาเพนิซิลลิน (Penicillin)
          </span>
          <span class="px-3.5 py-1.5 bg-orange-100 text-orange-800 border border-orange-200 rounded-full font-label-md text-label-md flex items-center gap-1.5">
            <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
            ยาแอสไพริน (ระวังเรื่องการระคายเคืองกระเพาะอาหาร)
          </span>
        </div>
      </div>
    </div>

    <!-- Bento Grid Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-gutter">
      <!-- Metric: Blood Pressure -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-red-500/5 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ความดันโลหิต</span>
          <span class="material-symbols-outlined text-red-500 text-[22px] icon-fill">favorite</span>
        </div>
        <div class="mb-3">
          <span class="font-display-lg text-display-lg font-bold text-on-surface">120/80</span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">mmHg</span>
        </div>
        <div class="mt-auto">
          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-label-sm text-[11px]">ปกติ</span>
        </div>
      </div>

      <!-- Metric: Heart Rate -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">อัตราการเต้นของหัวใจ</span>
          <span class="material-symbols-outlined text-primary text-[22px]">pulse_meter</span>
        </div>
        <div class="mb-3">
          <span class="font-display-lg text-display-lg font-bold text-on-surface">72</span>
          <span class="text-sm text-on-surface-variant font-normal ml-1">ครั้ง/นาที</span>
        </div>
        <div class="mt-auto">
          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-label-sm text-[11px]">ปกติ</span>
        </div>
      </div>

      <!-- Metric: BMI calculation -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/5 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-300"></div>
        <div class="flex items-center justify-between mb-4">
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ดัชนีมวลกาย (BMI)</span>
          <span class="material-symbols-outlined text-blue-500 text-[22px]">monitoring</span>
        </div>
        <div class="mb-3">
          <span class="font-display-lg text-display-lg font-bold text-on-surface">21.3</span>
          <span class="text-xs text-on-surface-variant font-normal block mt-0.5">ส่วนสูง: 165 ซม. | น้ำหนัก: 58 กก.</span>
        </div>
        <div class="mt-auto">
          <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-label-sm text-[11px]">สมส่วน</span>
        </div>
      </div>
    </div>

    <!-- Active Prescriptions and Medicines History -->
    <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6 border-b border-outline-variant pb-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[24px]">pill</span>
          <h3 class="font-headline-md text-headline-md text-on-surface font-bold">ยาประจำตัว & แผนการทานยา</h3>
        </div>
        <button class="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">ดูประวัติยาเก่า <span class="material-symbols-outlined text-[16px]">arrow_forward</span></button>
      </div>

      <div class="divide-y divide-outline-variant space-y-4">
        <div v-for="pill in activeMedicines" :key="pill.name" class="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/30">
              <span class="material-symbols-outlined text-primary text-[24px]">prescriptions</span>
            </div>
            <div>
              <h4 class="font-label-md text-label-md font-bold text-on-surface">{{ pill.name }}</h4>
              <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">{{ pill.dosage }} • ทานต่อเนื่อง {{ pill.duration }}</p>
              <span class="inline-flex items-center gap-1 text-[11px] font-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                <span class="material-symbols-outlined text-[12px]">schedule</span>
                {{ pill.timing }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span class="font-label-md text-label-md text-on-surface-variant">ทานปกติ</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

// Mock details for ongoing medical plans
const activeMedicines = [
  {
    name: 'Atorvastatin 20mg (ยาลดไขมันในเลือด)',
    dosage: 'ทานวันละ 1 เม็ด',
    duration: '6 เดือน',
    timing: 'ทานก่อนนอน',
  },
  {
    name: 'Metformin 500mg (ยาควบคุมระดับน้ำตาล)',
    dosage: 'ทานวันละ 2 เม็ด ครั้งละ 1 เม็ด',
    duration: '3 เดือน',
    timing: 'ทานหลังอาหารเช้าและเย็นทันที',
  },
  {
    name: 'Vitamin C 1000mg (อาหารเสริมสร้างภูมิคุ้มกัน)',
    dosage: 'ทานวันละ 1 เม็ด',
    duration: '1 เดือน',
    timing: 'ทานหลังอาหารเช้า',
  }
]
</script>
