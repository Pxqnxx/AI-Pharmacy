<template>
  <NuxtLayout :name="layoutName">
    <div class="space-y-6" style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- ═══════════════════════════════════════════════════════
         PAGE HEADER
    ═══════════════════════════════════════════════════════ -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-outlined text-emerald-500 text-[28px] icon-fill">receipt_long</span>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ isAdmin ? 'จัดการคำสั่งซื้อลูกค้า' : 'ประวัติคำสั่งซื้อ' }}
          </h2>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 ml-9">
          {{ isAdmin ? 'ตรวจสอบและจัดการสถานะจัดส่งคำสั่งซื้อทั้งหมดของลูกค้าในระบบ' : 'ติดตามสถานะและประวัติการสั่งซื้อยาของคุณทั้งหมด' }}
        </p>
      </div>
      <NuxtLink
        v-if="!isAdmin"
        to="/checkout"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-teal-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        <span class="material-symbols-outlined text-[16px] icon-fill">add_shopping_cart</span>
        สั่งซื้อยาใหม่
      </NuxtLink>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         STATS SUMMARY ROW
    ═══════════════════════════════════════════════════════ -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3.5 flex items-center gap-3"
      >
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="stat.iconBg"
        >
          <span class="material-symbols-outlined text-[18px] icon-fill" :class="stat.iconColor">{{ stat.icon }}</span>
        </div>
        <div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">{{ stat.label }}</p>
          <p class="text-base font-black text-slate-800 dark:text-white leading-snug">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         FILTER TABS + SEARCH
    ═══════════════════════════════════════════════════════ -->
    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <!-- Status filter tabs -->
      <div class="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex-shrink-0">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200"
          :class="
            activeTab === tab.value
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          "
        >
          {{ tab.label }}
          <span
            v-if="getTabCount(tab.value) > 0"
            class="ml-1 text-[9px] font-black px-1.5 py-0.5 rounded-full"
            :class="activeTab === tab.value ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'"
          >{{ getTabCount(tab.value) }}</span>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         LOADING STATE
    ═══════════════════════════════════════════════════════ -->
    <div v-if="isLoading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 animate-pulse"
      >
        <div class="flex justify-between mb-4">
          <div class="space-y-2">
            <div class="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div class="h-2 w-20 bg-slate-100 dark:bg-slate-850 rounded-full"></div>
          </div>
          <div class="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
        <div class="h-2 w-48 bg-slate-100 dark:bg-slate-850 rounded-full mb-4"></div>
        <div class="h-10 w-full bg-slate-100 dark:bg-slate-850 rounded-xl"></div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         ERROR STATE
    ═══════════════════════════════════════════════════════ -->
    <div
      v-else-if="errorMessage"
      class="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-3xl p-6 flex items-center gap-4"
    >
      <span class="material-symbols-outlined text-red-500 text-3xl">error</span>
      <div>
        <p class="text-sm font-bold text-red-700 dark:text-red-400">เกิดข้อผิดพลาด</p>
        <p class="text-xs text-red-500 dark:text-red-500/80 mt-0.5">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         EMPTY STATE
    ═══════════════════════════════════════════════════════ -->
    <div
      v-else-if="!isLoading && filteredOrders.length === 0"
      class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center text-center gap-4"
    >
      <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center">
        <span class="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl">receipt_long</span>
      </div>
      <div>
        <p class="text-base font-bold text-slate-700 dark:text-slate-300">
          {{ activeTab === 'all' ? 'ยังไม่มีคำสั่งซื้อ' : 'ไม่มีคำสั่งซื้อในหมวดนี้' }}
        </p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {{ activeTab === 'all' ? 'เริ่มสั่งซื้อยาจากคลังของเราเพื่อดูประวัติการสั่งซื้อที่นี่' : 'ลองเลือกหมวดหมู่อื่น' }}
        </p>
      </div>
      <NuxtLink
        v-if="activeTab === 'all'"
        to="/checkout"
        class="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
      >
        เริ่มสั่งซื้อยา
      </NuxtLink>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         LATEST ORDER STATUS TRACKER (Only shown if last order is "pending")
    ═══════════════════════════════════════════════════════ -->
    <div
      v-if="!isLoading && !isAdmin && latestPendingOrder && (activeTab === 'all' || activeTab === 'processing')"
      class="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 lg:p-6 text-white shadow-lg shadow-emerald-500/20"
    >
      <!-- Background decoration -->
      <div class="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full"></div>
      <div class="absolute -right-2 top-8 w-20 h-20 bg-white/5 rounded-full"></div>

      <div class="relative z-10">
        <div class="flex items-start justify-between mb-5">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="material-symbols-outlined text-emerald-200 text-[20px] icon-fill">local_shipping</span>
              <span class="text-xs font-bold text-emerald-100 uppercase tracking-wider">คำสั่งซื้อล่าสุด</span>
            </div>
            <h3 class="text-lg font-black">{{ latestPendingOrder.id }}</h3>
            <p class="text-xs text-emerald-100 mt-0.5">สั่งซื้อเมื่อ {{ latestPendingOrder.date }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-emerald-200">ยอดรวม</p>
            <p class="text-2xl font-black">฿{{ latestPendingOrder.price.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Delivery Progress Timeline -->
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <p class="text-xs font-bold text-emerald-100 mb-4">สถานะการจัดส่ง</p>
          <div class="flex items-center gap-0">
            <template v-for="(step, idx) in deliverySteps" :key="step.key">
              <!-- Step node -->
              <div class="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                  :class="
                    step.done
                      ? 'bg-white border-white shadow-sm'
                      : step.current
                      ? 'bg-white/20 border-white/80 shadow-sm'
                      : 'bg-white/10 border-white/20'
                  "
                >
                  <span
                    class="material-symbols-outlined text-[14px] icon-fill"
                    :class="step.done ? 'text-emerald-600' : step.current ? 'text-white' : 'text-white/30'"
                  >{{ step.icon }}</span>
                </div>
                <span class="text-[9px] font-bold text-center leading-tight"
                  :class="step.done || step.current ? 'text-white' : 'text-white/40'"
                >{{ step.label }}</span>
              </div>
              <!-- Connector line between steps -->
              <div
                v-if="idx < deliverySteps.length - 1"
                class="flex-1 h-0.5 mb-4 transition-colors"
                :class="deliverySteps[idx + 1]?.done || deliverySteps[idx]?.done ? 'bg-white/50' : 'bg-white/15'"
              ></div>
            </template>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-4">
          <NuxtLink
            v-if="latestPendingOrder.paymentMethod === 'PromptPay'"
            :to="`/qr-promptpay?orderId=${latestPendingOrder.id}&total=${latestPendingOrder.price}`"
            class="flex-1 bg-white text-emerald-700 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-emerald-50 transition-colors active:scale-95"
          >
            <span class="material-symbols-outlined text-[15px]">qr_code_2</span>
            ดู QR ชำระเงิน
          </NuxtLink>
          <button
            class="flex-1 bg-white/15 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-white/20 transition-colors active:scale-95"
            @click="expandedOrderId = expandedOrderId === latestPendingOrder?.id ? null : latestPendingOrder?.id ?? null"
          >
            <span class="material-symbols-outlined text-[15px]">receipt</span>
            ดูรายการยา
          </button>
        </div>

        <!-- Expanded items list -->
        <div
          v-if="expandedOrderId === latestPendingOrder.id"
          class="mt-3 bg-white/10 rounded-xl p-3 space-y-2"
        >
          <div
            v-for="item in latestPendingOrder.items"
            :key="item.product_id"
            class="flex justify-between items-center text-xs"
          >
            <span class="text-white/90 font-semibold">{{ item.name }}</span>
            <span class="text-emerald-200">x{{ item.qty }} · ฿{{ (item.price * item.qty).toLocaleString() }}</span>
          </div>
          <div class="border-t border-white/20 pt-2 flex justify-between text-xs font-black">
            <span class="text-emerald-100">ค่าจัดส่ง</span>
            <span class="text-white">฿{{ latestPendingOrder.shippingFee }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         ORDER LIST CARDS
    ═══════════════════════════════════════════════════════ -->
    <div v-if="!isLoading && listOrders.length > 0" class="space-y-3">
      <div
        v-for="order in listOrders"
        :key="order.id"
        class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden transition-all hover:shadow-sm"
        :class="order.status === 'cancelled' ? 'border-slate-200/60 opacity-70' : 'border-slate-200/80'"
      >
        <!-- Card Top Strip (status color accent) -->
        <div
          class="h-1 w-full"
          :class="{
            'bg-gradient-to-r from-amber-400 to-orange-500': order.status === 'processing',
            'bg-gradient-to-r from-emerald-400 to-teal-500': order.status === 'completed',
            'bg-gradient-to-r from-slate-300 to-slate-400': order.status === 'cancelled',
          }"
        ></div>

        <div class="p-4 lg:p-5">
          <!-- Header row -->
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-black text-slate-800 dark:text-white">{{ order.id }}</span>
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                  :class="{
                    'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40': order.status === 'processing',
                    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40': order.status === 'completed',
                    'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700': order.status === 'cancelled',
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="{
                      'bg-amber-500 animate-pulse': order.status === 'processing',
                      'bg-emerald-500': order.status === 'completed',
                      'bg-slate-400': order.status === 'cancelled',
                    }"
                  ></span>
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {{ order.date }}
                <span v-if="isAdmin && order.userId" class="font-bold text-teal-600 dark:text-teal-400"> · ลูกค้า ID: #{{ order.userId }}</span>
              </p>
            </div>

            <!-- Total price -->
            <div class="text-right flex-shrink-0 ml-3">
              <p class="text-[10px] text-slate-400 dark:text-slate-500">ยอดรวม</p>
              <p
                class="text-base font-black"
                :class="{
                  'text-emerald-600 dark:text-emerald-400': order.status === 'processing',
                  'text-slate-700 dark:text-slate-300': order.status !== 'processing',
                }"
              >฿{{ order.price.toLocaleString() }}</p>
            </div>
          </div>

          <!-- Items summary -->
          <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 rounded-2xl px-3 py-2.5 mb-3">
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="{
                'bg-amber-100 dark:bg-amber-950/40': order.status === 'processing',
                'bg-emerald-100 dark:bg-emerald-950/40': order.status === 'completed',
                'bg-slate-200 dark:bg-slate-800': order.status === 'cancelled',
              }"
            >
              <span
                class="material-symbols-outlined text-[16px] icon-fill"
                :class="{
                  'text-amber-600 dark:text-amber-400': order.status === 'processing',
                  'text-emerald-600 dark:text-emerald-400': order.status === 'completed',
                  'text-slate-400': order.status === 'cancelled',
                }"
              >medication</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{{ order.productName }}</p>
              <p class="text-[10px] text-slate-400 dark:text-slate-500">{{ order.quantity }} รายการ · ชำระ{{ order.paymentMethod === 'PromptPay' ? 'ผ่าน PromptPay' : 'เงินปลายทาง (COD)' }}</p>
            </div>
            <button
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
              @click="expandedOrderId = expandedOrderId === order.id ? null : order.id"
              :title="expandedOrderId === order.id ? 'ซ่อนรายการ' : 'ดูรายการยา'"
            >
              <span class="material-symbols-outlined text-[18px]">{{ expandedOrderId === order.id ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</span>
            </button>
          </div>

          <!-- Expandable item list -->
          <div
            v-if="expandedOrderId === order.id"
            class="mb-3 space-y-1.5 bg-slate-50 dark:bg-slate-950/30 rounded-2xl p-3"
          >
            <div
              v-for="item in order.items"
              :key="item.product_id"
              class="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0"
            >
              <div>
                <p class="font-semibold text-slate-700 dark:text-slate-300">{{ item.name }}</p>
                <p class="text-[10px] text-slate-400">{{ item.category }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-slate-800 dark:text-slate-200">฿{{ (item.price * item.qty).toLocaleString() }}</p>
                <p class="text-[10px] text-slate-400">x{{ item.qty }}</p>
              </div>
            </div>
            <!-- Shipping fee row -->
            <div class="flex justify-between text-[10px] text-slate-400 pt-1">
              <span>ค่าจัดส่ง</span>
              <span>฿{{ order.shippingFee }}</span>
            </div>
            <!-- Shipping address -->
            <div v-if="order.shippingAddress" class="flex items-start gap-1.5 text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/50">
              <span class="material-symbols-outlined text-[13px] mt-0.5 flex-shrink-0">location_on</span>
              <span class="leading-relaxed">{{ order.shippingAddress }}</span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-2 w-full">
            <!-- Admin Actions -->
            <template v-if="isAdmin">
              <button
                v-if="order.status === 'processing'"
                :disabled="isUpdating[order.id]"
                @click="updateOrderStatus(order.id, 'delivered')"
                class="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span class="material-symbols-outlined text-[15px] icon-fill">check_circle</span>
                จัดส่งสำเร็จ
              </button>
              <button
                v-if="order.status === 'processing'"
                :disabled="isUpdating[order.id]"
                @click="updateOrderStatus(order.id, 'cancelled')"
                class="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span class="material-symbols-outlined text-[15px]">cancel</span>
                ยกเลิกคำสั่งซื้อ
              </button>
              <button
                v-if="order.status === 'completed' || order.status === 'cancelled'"
                :disabled="isUpdating[order.id]"
                @click="updateOrderStatus(order.id, 'pending')"
                class="flex-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span class="material-symbols-outlined text-[15px]">replay</span>
                ย้อนสถานะเป็นรอดำเนินการ
              </button>
            </template>

            <!-- Customer Actions -->
            <template v-else>
              <NuxtLink
                v-if="order.status === 'processing' && order.paymentMethod === 'PromptPay'"
                :to="`/qr-promptpay?orderId=${order.id}&total=${order.price}`"
                class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span class="material-symbols-outlined text-[15px]">qr_code_2</span>
                ชำระเงิน / ดู QR
              </NuxtLink>
              <button
                v-if="order.status === 'completed'"
                @click="reorder(order)"
                class="flex-1 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span class="material-symbols-outlined text-[15px]">replay</span>
                สั่งซื้ออีกครั้ง
              </button>
              <button
                v-if="order.status === 'processing'"
                class="px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span class="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════
         SUPPORT SECTION
    ═══════════════════════════════════════════════════════ -->
    <div
      v-if="!isAdmin"
      class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 animate-slideUp"
    >
      <div class="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 rounded-2xl flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-teal-500 text-[24px] icon-fill">support_agent</span>
      </div>
      <div class="flex-1 text-center sm:text-left">
        <h3 class="text-sm font-black text-slate-800 dark:text-white">พบปัญหาในการสั่งซื้อ?</h3>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">ทีมเภสัชกรของเราพร้อมให้ความช่วยเหลือตลอด 24 ชั่วโมง</p>
      </div>
      <NuxtLink
        to="/chat"
        class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        <span class="material-symbols-outlined text-[15px]">forum</span>
        ปรึกษา AI
      </NuxtLink>
    </div>
  </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false,
})

const { getSession } = useAuth()
const session = ref<ReturnType<typeof getSession> | null>(null)
const isAdmin = computed(() => session.value?.role === 'pharmacist')
const layoutName = computed(() => session.value?.role === 'pharmacist' ? 'admin' : 'user')

const isUpdating = ref<Record<string, boolean>>({})

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  isUpdating.value[orderId] = true
  try {
    const response = await $fetch<any>('/api/orders', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: { orderId, status: newStatus }
    })
    if (response?.success) {
      await fetchOrdersData()
    } else {
      alert(response?.error || 'ไม่สามารถอัปเดตสถานะได้')
    }
  } catch (err: any) {
    alert(err.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')
  } finally {
    isUpdating.value[orderId] = false
  }
}

const reorder = async (order: any) => {
  if (!process.client) return
  try {
    const productsResponse = await $fetch<any>('/api/products')
    const dbProducts = productsResponse?.products || []
    
    const newCart: any[] = []
    for (const item of order.items) {
      const dbProd = dbProducts.find((p: any) => p.id === item.product_id)
      if (dbProd) {
        newCart.push({
          id: dbProd.id,
          name: dbProd.name,
          brand: dbProd.brand,
          price: dbProd.price,
          unit: dbProd.unit,
          stock: dbProd.stock,
          qty: Math.min(item.qty, dbProd.stock) || 1
        })
      } else {
        newCart.push({
          id: item.product_id,
          name: item.name || 'เวชภัณฑ์',
          brand: 'Pharma',
          price: item.price,
          unit: 'ชิ้น',
          stock: 99,
          qty: item.qty
        })
      }
    }
    
    localStorage.setItem('cart', JSON.stringify(newCart))
    await navigateTo('/checkout')
  } catch (err) {
    console.error('Reorder error:', err)
    const newCart = order.items.map((item: any) => ({
      id: item.product_id,
      name: item.name,
      brand: 'Pharma',
      price: item.price,
      unit: 'ชิ้น',
      stock: 99,
      qty: item.qty
    }))
    localStorage.setItem('cart', JSON.stringify(newCart))
    await navigateTo('/checkout')
  }
}
const activeTab = ref('all')
const ordersResult = ref<any>({ filterTabs: [], orders: [] })
const isLoading = ref(true)
const errorMessage = ref('')
const expandedOrderId = ref<string | null>(null)

const getAuthHeaders = () => ({
  'x-user-role': session.value?.role || '',
  'x-user-id': session.value?.id?.toString() || '',
})

const fetchOrdersData = async () => {
  if (!process.client) return
  session.value = getSession()
  if (!session.value) {
    errorMessage.value = 'ไม่พบ session ผู้ใช้'
    isLoading.value = false
    return
  }

  try {
    const response = await $fetch<any>('/api/orders', {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (response?.success) {
      ordersResult.value = response
    } else {
      errorMessage.value = response?.error || 'ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลคำสั่งซื้อ'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchOrdersData)

const filterTabs = computed(() => ordersResult.value?.filterTabs || [])
const orders = computed<any[]>(() => ordersResult.value?.orders || [])

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter((o) => o.status === activeTab.value)
})

// Orders shown in the list — exclude the latestPendingOrder since it's
// already displayed in the green status tracker banner above the list
const listOrders = computed(() => {
  if (isAdmin.value) return filteredOrders.value
  const latestId = latestPendingOrder.value?.id
  if (!latestId) return filteredOrders.value
  return filteredOrders.value.filter((o) => o.id !== latestId)
})

const getTabCount = (tabValue: string) => {
  if (tabValue === 'all') return orders.value.length
  return orders.value.filter((o) => o.status === tabValue).length
}

// Latest pending (processing) order for the status tracker
const latestPendingOrder = computed(() =>
  orders.value.find((o) => o.status === 'processing') || null
)

// 4-step delivery progress tracker
const deliverySteps = computed(() => {
  const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered']
  const currentRaw = latestPendingOrder.value?.rawStatus || 'pending'
  const currentIdx = statusOrder.indexOf(currentRaw === 'pending' ? 'pending' : currentRaw)

  return [
    { key: 'pending', icon: 'check_circle', label: 'ยืนยันคำสั่ง', done: currentIdx >= 0, current: currentIdx === 0 },
    { key: 'confirmed', icon: 'inventory_2', label: 'จัดเตรียมยา', done: currentIdx >= 1, current: currentIdx === 1 },
    { key: 'shipped', icon: 'local_shipping', label: 'กำลังจัดส่ง', done: currentIdx >= 2, current: currentIdx === 2 },
    { key: 'delivered', icon: 'home_pin', label: 'ถึงมือคุณ', done: currentIdx >= 3, current: currentIdx === 3 },
  ]
})

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    processing: 'กำลังดำเนินการ',
    completed: 'สำเร็จแล้ว',
    cancelled: 'ยกเลิกแล้ว',
  }
  return labels[status] || status
}

// Summary statistics
const stats = computed(() => [
  {
    label: 'คำสั่งซื้อทั้งหมด',
    value: orders.value.length.toString(),
    icon: 'receipt_long',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-500 dark:text-slate-400',
  },
  {
    label: 'กำลังดำเนินการ',
    value: orders.value.filter((o) => o.status === 'processing').length.toString(),
    icon: 'local_shipping',
    iconBg: 'bg-amber-100 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: 'สำเร็จแล้ว',
    value: orders.value.filter((o) => o.status === 'completed').length.toString(),
    icon: 'check_circle',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'ยอดรวมทั้งหมด',
    value: '฿' + orders.value.reduce((sum, o) => sum + (o.price || 0), 0).toLocaleString(),
    icon: 'payments',
    iconBg: 'bg-teal-100 dark:bg-teal-950/40',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
])
</script>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.icon-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
