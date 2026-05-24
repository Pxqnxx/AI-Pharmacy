<template>
  <div class="bg-gradient-to-b from-surface to-surface-container-low min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop antialiased">
    <main class="w-full max-w-md flex flex-col items-center">
      <!-- Success Graphic -->
      <div class="mb-6 relative flex items-center justify-center">
        <div class="absolute w-24 h-24 bg-primary-container rounded-full animate-ping opacity-30"></div>
        <div class="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center relative z-10 shadow-sm">
          <span class="material-symbols-outlined text-primary" style="font-size: 48px; font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>
      </div>
      <!-- Header Text -->
      <h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface text-center mb-2">สั่งซื้อสำเร็จ!</h1>
      <p class="font-body-md text-body-md text-on-surface-variant text-center mb-8">ยาของคุณกำลังจัดส่ง</p>
      <!-- Digital Receipt Card -->
      <div class="w-full bg-surface-container-lowest rounded-xl shadow-md border border-surface-variant overflow-hidden mb-8 relative">
        <!-- Receipt Content -->
        <div class="p-6 md:p-8 flex flex-col gap-6">
          <!-- Header Info -->
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center">
              <span class="font-body-md text-body-md text-on-surface-variant">เลขที่ใบสั่งซื้อ</span>
              <span class="font-label-md text-label-md text-on-surface font-semibold">{{ order.orderNumber }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-body-md text-body-md text-on-surface-variant">วันที่</span>
              <span class="font-label-md text-label-md text-on-surface font-semibold">{{ order.date }}</span>
            </div>
          </div>
          <div class="border-t border-dashed border-outline-variant w-full"></div>
          <!-- Items -->
          <div class="flex flex-col gap-3">
            <h2 class="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">รายการสินค้า</h2>
            <div v-for="item in order.items" :key="item.name" class="flex justify-between items-start">
              <span class="font-body-md text-body-md text-on-surface-variant flex-1 pr-4">{{ item.name }}</span>
              <span class="font-label-md text-label-md text-on-surface shrink-0">--</span>
            </div>
          </div>
          <div class="border-t border-dashed border-outline-variant w-full"></div>
          <!-- Total & Status -->
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <span class="font-headline-md text-headline-md text-on-surface">ยอดรวม</span>
              <span class="font-headline-md text-headline-md text-primary">{{ order.total }}</span>
            </div>
            <div class="flex justify-between items-center bg-surface-container-low p-3 rounded-lg border border-surface-variant">
              <span class="font-body-md text-body-md text-on-surface-variant">สถานะ</span>
              <div class="flex items-center gap-1.5 text-primary">
                <span class="material-symbols-outlined" style="font-size: 18px; font-variation-settings: 'FILL' 1;">check_circle</span>
                <span class="font-label-md text-label-md font-semibold">{{ order.statusText }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Decorative zig-zag bottom (using css clip-path for a modern receipt look) -->
        <div class="h-3 w-full bg-surface-container-low absolute bottom-0 left-0" style="clip-path: polygon(0% 100%, 2.5% 0%, 5% 100%, 7.5% 0%, 10% 100%, 12.5% 0%, 15% 100%, 17.5% 0%, 20% 100%, 22.5% 0%, 25% 100%, 27.5% 0%, 30% 100%, 32.5% 0%, 35% 100%, 37.5% 0%, 40% 100%, 42.5% 0%, 45% 100%, 47.5% 0%, 50% 100%, 52.5% 0%, 55% 100%, 57.5% 0%, 60% 100%, 62.5% 0%, 65% 100%, 67.5% 0%, 70% 100%, 72.5% 0%, 75% 100%, 77.5% 0%, 80% 100%, 82.5% 0%, 85% 100%, 87.5% 0%, 90% 100%, 92.5% 0%, 95% 100%, 97.5% 0%, 100% 100%);"></div>
      </div>
      <!-- Actions Container -->
      <div class="w-full flex flex-col gap-3">
        <button class="w-full bg-primary text-on-primary rounded-full py-4 px-6 font-label-md text-label-md shadow-sm transition-transform active:scale-[0.98] hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center gap-2">
          <span class="material-symbols-outlined" style="font-size: 20px;">local_shipping</span>
          ดูสถานะการส่ง
        </button>
        <button class="w-full bg-transparent border-2 border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface rounded-full py-4 px-6 font-label-md text-label-md transition-colors flex items-center justify-center gap-2">
          กลับสู่หน้าหลัก (Home)
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const order = {
  orderNumber: '#PAI-9982',
  date: '12 Oct 2023',
  items: [
    {
      name: 'Paracetamol',
    },
    {
      name: 'Throat Lozenges',
    },
  ],
  total: '70 บาท',
  status: 'paid',
  statusText: 'ชำระเงินแล้ว',
}

definePageMeta({
  layout: 'default',
})
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
