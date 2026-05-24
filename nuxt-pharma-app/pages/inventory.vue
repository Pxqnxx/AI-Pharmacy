<template>
  <div>
    <!-- Page Title -->
    <div class="mb-gutter">
      <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">จัดการคลังสินค้า</h2>
      <p class="font-body-md text-body-md text-on-surface-variant">ตรวจสอบระดับสต็อกและจัดการการสั่งซื้อซ้ำอย่างมีประสิทธิภาพ</p>
    </div>

    <!-- Low Stock Alerts Section (Bento Grid) -->
    <section class="mb-xl">
      <div class="flex items-center gap-2 mb-md">
        <span class="material-symbols-outlined text-error icon-fill">warning</span>
        <h3 class="font-headline-md text-headline-md text-on-surface">แจ้งเตือนสินค้าใกล้หมด</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <!-- Alert Card: Amoxicillin & others -->
        <div v-for="alert in lowStockAlerts" :key="alert.id" 
             class="bg-surface-container-lowest rounded-xl shadow-md border border-error-container p-lg flex flex-col justify-between relative overflow-hidden group"
             :class="alert.status === 'warning' ? 'border-orange-200' : ''">
          <div class="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"
               :class="alert.status === 'warning' ? 'bg-orange-50' : ''"></div>
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-surface-container-high rounded-lg flex items-center justify-center border border-outline-variant shrink-0">
                <span class="material-symbols-outlined text-outline text-[32px]">{{ alert.icon }}</span>
              </div>
              <div>
                <h4 class="font-headline-md text-headline-md text-on-surface mb-1">{{ alert.name }}</h4>
                <p class="font-label-md text-label-md text-on-surface-variant">{{ alert.description }}</p>
              </div>
            </div>
            <!-- Status Badge -->
            <div v-if="alert.status === 'critical'" 
                 class="bg-error/10 text-error px-3 py-1.5 rounded-full flex items-center gap-1.5 font-label-sm text-label-sm">
              <div class="w-2 h-2 rounded-full bg-error animate-pulse"></div>
              สินค้าใกล้หมด
            </div>
            <div v-else 
                 class="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-label-sm text-label-sm border border-orange-200">
              <div class="w-2 h-2 rounded-full bg-orange-500"></div>
              ควรสั่งเพิ่มเร็วๆ นี้
            </div>
          </div>
          <div class="flex items-end justify-between mt-auto">
            <div>
              <p class="font-label-sm text-label-sm text-tertiary mb-1">คงเหลือในคลัง</p>
              <p class="font-display-lg text-display-lg leading-none"
                 :class="alert.status === 'critical' ? 'text-error' : 'text-orange-600'">
                {{ alert.stockLevel }}<span class="font-label-md text-label-md text-on-surface-variant ml-1">{{ alert.unit }}</span>
              </p>
            </div>
            <button class="bg-primary text-on-primary hover:bg-primary-container px-6 py-2.5 rounded-full font-label-md text-label-md shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              สั่งสินค้าเพิ่ม
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- All Inventory List Section -->
    <section>
      <div class="flex justify-between items-end mb-md border-b border-outline-variant pb-2">
        <h3 class="font-headline-md text-headline-md text-on-surface">สินค้าทั้งหมด</h3>
        <button class="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">ดูรายการทั้งหมด <span class="material-symbols-outlined text-[16px]">arrow_forward</span></button>
      </div>
      <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <!-- Table Header (Hidden on Mobile, Grid on Desktop) -->
        <div class="hidden md:grid grid-cols-12 gap-4 p-4 bg-surface-container text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant">
          <div class="col-span-5">Product Details</div>
          <div class="col-span-2">SKU</div>
          <div class="col-span-2">Stock Level</div>
          <div class="col-span-3 text-right">Action</div>
        </div>
        <!-- List Items -->
        <div class="flex flex-col divide-y divide-outline-variant">
          <div v-for="item in inventoryItems" :key="item.id" 
               class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-surface-container-low transition-colors">
            <div class="col-span-1 md:col-span-5 flex items-center gap-4">
              <div v-if="item.imageUrl" 
                   class="w-12 h-12 bg-surface-container-high rounded bg-cover bg-center border border-outline-variant shrink-0"
                   :style="{ backgroundImage: `url('${item.imageUrl}')` }">
              </div>
              <div>
                <p class="font-label-md text-label-md text-on-surface font-bold">{{ item.name }}</p>
                <p class="font-label-sm text-label-sm text-on-surface-variant">{{ item.description }}</p>
              </div>
            </div>
            <div class="hidden md:block col-span-2 font-body-md text-body-md text-tertiary">
              {{ item.sku }}
            </div>
            <div class="col-span-1 md:col-span-2 flex items-center gap-2">
              <span class="font-label-md text-label-md text-on-surface">{{ item.stockLevel }}</span>
              <div class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-label-sm text-label-sm text-[10px] uppercase border border-emerald-200">
                มีสินค้า
              </div>
            </div>
            <div class="col-span-1 md:col-span-3 flex justify-end">
              <button class="text-primary hover:bg-primary/10 px-4 py-2 rounded-full font-label-md text-label-md transition-colors w-full md:w-auto text-center border border-transparent hover:border-primary/20">
                Manage Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  layout: 'admin',
})

// Fetch inventory dynamically from Supabase Postgres without blocking
const { data: inventoryResult } = useFetch<any>('/api/inventory')

const lowStockAlerts = computed(() => inventoryResult.value?.lowStockAlerts || [])
const inventoryItems = computed(() => inventoryResult.value?.inventoryItems || [])
</script>

