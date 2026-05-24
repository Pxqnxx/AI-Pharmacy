<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8">
      <NuxtLink to="/orders" class="inline-flex items-center gap-1 text-primary hover:underline font-label-md text-label-md mb-3">
        <span class="material-symbols-outlined text-[16px]">arrow_back</span>
        กลับไปที่รายการคำสั่งซื้อ
      </NuxtLink>
      <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2">ชำระเงินคำสั่งซื้อ</h2>
      <p class="font-body-md text-body-md text-on-surface-variant">สแกนรหัสคิวอาร์เพื่อชำระเงินผ่านระบบ PromptPay ได้อย่างปลอดภัย</p>
    </div>

    <!-- Flex Main Canvas (Layout checkout details) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
      <!-- Left Column: QR promptpay visual card (7 columns) -->
      <div class="md:col-span-7 space-y-6">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <!-- Promptpay logo mockup -->
          <div class="w-full flex items-center justify-center gap-2 mb-4 py-2 bg-sky-950 text-white rounded-xl">
            <span class="font-bold text-lg tracking-wider">Prompt Pay</span>
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          </div>

          <!-- Timer Countdown warning -->
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-2">รหัสคิวอาร์จะหมดอายุใน</p>
          <div class="font-display-lg text-headline-lg font-bold text-primary mb-6 flex items-center gap-1 bg-primary/10 px-4 py-1.5 rounded-full">
            <span class="material-symbols-outlined text-[20px] animate-spin">hourglass_empty</span>
            09:42 นาที
          </div>

          <!-- QR code image mockup (generated beautiful mock using CSS/SVG structures) -->
          <div class="w-56 h-56 bg-white border border-outline-variant/60 rounded-xl p-4 flex flex-col items-center justify-center relative shadow-sm group">
            <!-- Simulated QR code pixels pattern -->
            <div class="w-full h-full flex flex-col justify-between items-center opacity-85">
              <div v-for="n in 6" :key="n" class="w-full flex justify-between">
                <div v-for="m in 6" :key="m" class="w-6 h-6 border-2 border-slate-900 rounded-sm" :class="(n + m) % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'"></div>
              </div>
            </div>
            <!-- Center branding logo -->
            <div class="absolute inset-0 m-auto w-10 h-10 bg-white border border-outline-variant/50 rounded-lg flex items-center justify-center text-primary shadow-md">
              <span class="material-symbols-outlined text-[24px] icon-fill">medical_services</span>
            </div>
          </div>

          <!-- Promptpay text and scan prompt -->
          <div class="mt-6 space-y-1">
            <h4 class="font-headline-md text-headline-md text-on-surface font-bold">฿ 1,250.00</h4>
            <p class="font-label-sm text-label-sm text-on-surface-variant">รหัสคำสั่งซื้อ: #PAI-88291</p>
          </div>

          <!-- Helper information -->
          <div class="mt-6 flex items-center gap-2 text-[11px] font-label-sm bg-surface-container-high/30 p-3 rounded-lg w-full text-left">
            <span class="material-symbols-outlined text-primary text-[18px]">info</span>
            <span>หลังจากชำระเงินเรียบร้อยแล้ว ระบบจะตรวจสอบยอดสแกนและยืนยันการทำสั่งซื้อโดยอัตโนมัติภายใน 10 วินาที</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Order brief details (5 columns) -->
      <div class="md:col-span-5 space-y-6">
        <!-- Order Brief -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h3 class="font-label-md text-label-md font-bold text-on-surface mb-4 uppercase tracking-wider border-b border-outline-variant pb-2">สรุปคำสั่งซื้อ</h3>
          
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="font-label-md text-label-md font-bold text-on-surface">พาราเซตามอล 500มก.</h4>
                <p class="font-label-sm text-label-sm text-on-surface-variant">2 กล่อง</p>
              </div>
              <span class="font-label-md text-label-md text-on-surface">฿ 300.00</span>
            </div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="font-label-md text-label-md font-bold text-on-surface">ยาแก้ไอ ตราเภสัชกร</h4>
                <p class="font-label-sm text-label-sm text-on-surface-variant">3 ขวด</p>
              </div>
              <span class="font-label-md text-label-md text-on-surface">฿ 450.00</span>
            </div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="font-label-md text-label-md font-bold text-on-surface">แผ่นประคบร้อนลดปวด</h4>
                <p class="font-label-sm text-label-sm text-on-surface-variant">5 แผ่น</p>
              </div>
              <span class="font-label-md text-label-md text-on-surface">฿ 500.00</span>
            </div>

            <!-- Totals billing divider -->
            <div class="border-t border-outline-variant/60 pt-4 space-y-2">
              <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>ยอดเงินสินค้า</span>
                <span>฿ 1,250.00</span>
              </div>
              <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>ค่าบริการและจัดส่ง</span>
                <span class="text-primary font-bold">ฟรี</span>
              </div>
              <div class="flex justify-between font-headline-md text-headline-md text-on-surface pt-2 border-t border-dashed border-outline-variant/40">
                <span class="font-bold text-primary">ยอดชำระสุทธิ</span>
                <span class="font-bold text-primary">฿ 1,250.00</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step flow visual -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h3 class="font-label-md text-label-md font-bold text-on-surface mb-4 uppercase tracking-wider">สถานะการชำระเงิน</h3>
          
          <div class="relative pl-6 border-l-2 border-primary/20 space-y-6">
            <!-- Step 1: Done -->
            <div class="relative">
              <div class="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white shadow-sm">
                <span class="material-symbols-outlined text-[10px] icon-fill">done</span>
              </div>
              <h4 class="font-label-md text-label-md font-bold text-primary">สร้างคำสั่งซื้อสำเร็จ</h4>
              <p class="font-label-sm text-label-sm text-on-surface-variant">ระบบเชื่อมโยงตะกร้ายารวมเสร็จสิ้น</p>
            </div>
            <!-- Step 2: Active -->
            <div class="relative">
              <div class="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white shadow-sm animate-pulse"></div>
              <h4 class="font-label-md text-label-md font-bold text-primary">รอยืนยันยอดสแกนคิวอาร์</h4>
              <p class="font-label-sm text-label-sm text-on-surface-variant">ระบบธนาคารกำลังรอเชื่อมต่อการจ่าย</p>
            </div>
            <!-- Step 3: Pending -->
            <div class="relative">
              <div class="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
              <h4 class="font-label-md text-label-md text-on-surface-variant">ชำระเงินเสร็จสิ้น & จัดส่งยา</h4>
              <p class="font-label-sm text-label-sm text-on-surface-variant/60">เตรียมดำเนินการแพ็กและจัดส่งทันที</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
