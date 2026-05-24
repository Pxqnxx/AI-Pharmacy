<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8">
      <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2">คำสั่งซื้อของฉัน</h2>
      <p class="font-body-md text-body-md text-on-surface-variant">ตรวจสอบและติดตามสถานะยาที่คุณสั่งซื้อ</p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <template v-for="tab in filterTabs" :key="tab.value">
        <button
          :class="[
            'px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors',
            tab.value === activeTab ? 'bg-primary text-on-primary font-bold shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container',
          ]"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </template>
    </div>

    <!-- Orders Grid/List -->
    <div class="space-y-4">
      <template v-for="order in filteredOrders" :key="order.id">
        <!-- Order Card -->
        <div
          class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden p-4 md:p-6 transition-transform active:scale-[0.98]"
          :class="{ 'opacity-90': order.status === 'completed', 'opacity-75': order.status === 'cancelled' }"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-label-md text-label-md text-on-surface-variant">เลขที่คำสั่งซื้อ: #{{ order.id }}</span>
                <span
                  class="px-2 py-0.5 rounded-full font-label-sm text-label-sm border"
                  :class="{
                    'bg-secondary-container/10 text-secondary border-secondary/20': order.status === 'processing',
                    'bg-green-100 text-green-700 border-green-200': order.status === 'completed',
                    'bg-error-container text-on-error-container border-error/20': order.status === 'cancelled',
                  }"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <p class="font-label-sm text-label-sm text-on-surface-variant">สั่งซื้อเมื่อ: {{ order.date }}</p>
            </div>
            <p
              class="font-headline-md text-headline-md font-bold"
              :class="{
                'text-primary': order.status === 'processing',
                'text-on-surface-variant': order.status !== 'processing',
              }"
            >
              ฿ {{ order.price.toLocaleString() }}
            </p>
          </div>

          <div class="flex items-center gap-4 mb-6">
            <div class="flex -space-x-3 overflow-hidden">
              <div class="h-12 w-12 rounded-lg bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center overflow-hidden">
                <span class="text-xs font-bold text-on-surface-variant">{{ order.productName.substring(0, 2).toUpperCase() }}</span>
              </div>
            </div>
            <div class="flex-1">
              <p class="font-label-md text-label-md text-on-surface font-bold">{{ order.productName }}</p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">{{ order.quantity }} รายการ</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              v-if="order.status === 'processing'"
              class="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md active:opacity-80 transition-opacity flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-[20px]" data-icon="local_shipping">local_shipping</span>
              ดูสถานะ
            </button>
            <button v-if="order.status === 'completed'" class="flex-1 border border-primary text-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container/10 active:opacity-80 transition-all flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[20px]" data-icon="replay">replay</span>
              สั่งซื้อซ้ำ
            </button>
            <button v-if="order.status === 'completed'" class="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors">
              ดูรายละเอียด
            </button>

            <NuxtLink 
              v-if="order.status === 'processing'" 
              to="/qr-promptpay" 
              class="flex-1 border border-primary text-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container/10 transition-all flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-[20px]">qr_code_2</span>
              ชำระเงิน / ดู QR
            </NuxtLink>

            <button v-if="order.status !== 'completed' && order.status !== 'cancelled'" class="p-3 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Help Section -->
    <div class="mt-12 p-6 bg-surface-container rounded-2xl flex flex-col items-center text-center gap-4">
      <span class="material-symbols-outlined text-primary text-4xl" data-icon="support_agent">support_agent</span>
      <div>
        <h3 class="font-headline-md text-headline-md text-on-surface">พบปัญหาในการสั่งซื้อ?</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mt-1">ทีมเภสัชกรของเราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง</p>
      </div>
      <button class="bg-on-surface text-surface py-3 px-8 rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity">ติดต่อเจ้าหน้าที่</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Order } from '~/types'

definePageMeta({
  layout: 'admin',
})

const activeTab = ref('all')

// Fetch orders dynamically from Supabase Postgres without blocking top-level await
const { data: ordersResult } = useFetch<any>('/api/orders')

const filterTabs = computed(() => ordersResult.value?.filterTabs || [])
const orders = computed<Order[]>(() => ordersResult.value?.orders || [])

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order) => order.status === activeTab.value)
})

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    processing: 'กำลังจัดส่ง',
    completed: 'สำเร็จแล้ว',
    cancelled: 'ยกเลิกแล้ว',
  }
  return labels[status] || status
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

