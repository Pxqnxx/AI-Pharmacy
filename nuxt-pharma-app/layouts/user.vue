<template>
  <div class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased min-h-screen flex" style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- ── Desktop Sidebar ──────────────────────────────────────── -->
    <nav class="hidden lg:flex flex-col bg-white dark:bg-slate-900 w-72 h-screen fixed inset-y-0 left-0 border-r border-slate-100 dark:border-slate-800 z-40 transition-all duration-300">

      <!-- Brand Header -->
      <div class="px-6 pt-7 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25 flex-shrink-0">
            <span class="material-symbols-outlined text-white text-[20px] icon-fill">medical_services</span>
          </div>
          <div>
            <p class="text-[15px] font-black text-slate-900 dark:text-white tracking-tight leading-none">PharmaAI</p>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              เภสัชกร AI ออนไลน์ตลอด 24 ชม.
            </p>
          </div>
        </div>
      </div>

      <!-- User Profile Card -->
      <div class="px-4 py-4 mx-3 mt-4 mb-2 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/20 border border-teal-100 dark:border-teal-900/40">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/30 border-2 border-teal-200 dark:border-teal-700 flex-shrink-0 flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[20px]">person</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs font-black text-slate-800 dark:text-white truncate">{{ displayName }}</p>
            <span class="inline-block bg-teal-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mt-0.5">{{ roleBadge }}</span>
          </div>
        </div>
      </div>

      <!-- Nav Label -->
      <div class="px-6 mb-2 mt-2">
        <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">เมนูหลัก</p>
      </div>

      <!-- Navigation Links -->
      <div class="flex-grow px-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.href"
          :to="item.href"
          custom
          v-slot="{ isActive, href, navigate }"
        >
          <a
            :href="href"
            @click="navigate"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
            :class="[
              isActive
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            <span
              class="material-symbols-outlined text-[20px] flex-shrink-0 transition-all"
              :class="isActive ? 'icon-fill text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-teal-500'"
            >{{ item.icon }}</span>
            <span class="text-[13px] font-semibold">{{ item.label }}</span>
            <span v-if="item.badge" class="ml-auto bg-white/20 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{{ item.badge }}</span>
          </a>
        </NuxtLink>
      </div>

      <!-- Logout -->
      <div class="px-3 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          :disabled="isLoggingOut"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.08)] transition-all duration-300 active:scale-95 disabled:opacity-50 group"
          @click="handleLogout"
        >
          <span class="material-symbols-outlined text-[20px] flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">{{ isLoggingOut ? 'hourglass_empty' : 'logout' }}</span>
          <span class="text-[13px] font-bold">{{ isLoggingOut ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ' }}</span>
        </button>
        <div class="mt-3 px-1 flex justify-between items-center text-[10px] text-slate-400">
          <span>© 2026 PharmaAI Inc.</span>
          <span class="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">V4.0.0</span>
        </div>
      </div>
    </nav>

    <!-- ── Main Content ─────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-72 pb-20 lg:pb-0">

      <!-- Top Header -->
      <header class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl sticky top-0 w-full z-30 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center px-5 lg:px-8 h-16 shadow-sm shadow-slate-200/50 dark:shadow-slate-900/50">
        <div class="flex items-center gap-3">
          <!-- Mobile brand -->
          <div class="lg:hidden flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-[16px] icon-fill">medical_services</span>
            </div>
            <span class="text-sm font-black text-slate-900 dark:text-white">PharmaAI</span>
          </div>

          <!-- Live badge (desktop) -->
          <span class="hidden lg:inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[11px] font-bold border border-emerald-200/50 dark:border-emerald-800/40">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Supabase Live
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Role badge (mobile) -->
          <span class="lg:hidden bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-bold px-2.5 py-1 rounded-full text-[10px] border border-teal-200/50 dark:border-teal-800/50">
            {{ roleBadge }}
          </span>
          <!-- User chip -->
          <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full">
            <div class="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
              {{ displayName.charAt(0) }}
            </div>
            <span class="hidden sm:block text-xs font-semibold text-slate-600 dark:text-slate-300 max-w-[100px] truncate">{{ displayName }}</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 py-8 px-5 lg:px-8 max-w-5xl w-full mx-auto space-y-8">
        <slot />
      </main>
    </div>

    <!-- ── Mobile Bottom Nav ────────────────────────────────────── -->
    <nav class="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/70 dark:border-slate-800 z-40 shadow-2xl shadow-slate-900/10">
      <div class="flex items-stretch h-16">
        <a
          v-for="item in navigationItems"
          :key="item.href"
          :href="item.href"
          class="flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative"
          :class="[
            item.isActive
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          ]"
        >
          <!-- Active indicator line -->
          <div v-if="item.isActive" class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
          <span class="material-symbols-outlined text-[22px]" :class="{ 'icon-fill': item.isActive }">{{ item.icon }}</span>
          <span class="text-[9px] font-bold leading-none">{{ item.shortLabel }}</span>
        </a>

        <!-- Logout -->
        <button
          :disabled="isLoggingOut"
          class="flex-1 flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:text-red-550 dark:hover:text-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.05)] transition-all active:scale-90 disabled:opacity-50 group"
          @click="handleLogout"
        >
          <span class="material-symbols-outlined text-[22px] group-hover:rotate-12 transition-transform duration-300">{{ isLoggingOut ? 'hourglass_empty' : 'logout' }}</span>
          <span class="text-[9px] font-extrabold leading-none">ออกจากระบบ</span>
        </button>
      </div>
    </nav>

    <!-- ─── Beautiful Custom Logout Confirmation Modal Overlay ─── -->
    <div
      v-if="showLogoutModal"
      class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      @click.self="showLogoutModal = false"
    >
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col animate-slideUp"
      >
        <!-- Modal Header Backdrop Gradient -->
        <div class="p-6 pb-4 bg-gradient-to-br from-red-500/10 to-rose-500/20 text-red-750 dark:text-red-400 relative flex flex-col items-center gap-3 text-center shrink-0">
          <div class="w-12 h-12 bg-white dark:bg-slate-850 rounded-2xl flex items-center justify-center shadow-md">
            <span class="material-symbols-outlined text-[26px] text-red-500 icon-fill">logout</span>
          </div>
          <div class="mt-2">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">ยืนยันออกจากระบบ</h3>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">คุณต้องการลงชื่อออกจากระบบ PharmaAI ใช่หรือไม่?</p>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 shrink-0">
          <button
            @click="showLogoutModal = false"
            class="flex-1 bg-white dark:bg-slate-855 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-355 py-3 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-800 transition-all active:scale-95 shadow-3xs"
          >
            ยกเลิก
          </button>
          
          <button
            @click="confirmLogout"
            :disabled="isLoggingOut"
            class="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white py-3 px-6 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-500/20 active:scale-95 disabled:opacity-50"
          >
            <span v-if="isLoggingOut" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            <span class="material-symbols-outlined text-[16px]" v-else>logout</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const { getSession, clearSession } = useAuth()

const session = getSession()
const displayName = computed(() => session?.fullName?.trim() || 'ผู้ใช้งาน')
const roleBadge = computed(() => (session?.role === 'pharmacist' ? 'เภสัชกร' : 'ผู้ป่วย'))

const navigationItems = computed(() => [
  { label: 'โปรไฟล์สุขภาพ', shortLabel: 'สุขภาพ', icon: 'medical_information', href: '/health', isActive: route.path === '/health' },
  { label: 'แชทปรึกษา AI', shortLabel: 'แชท', icon: 'forum', href: '/chat', isActive: route.path === '/chat' },
  { label: 'ตะกร้า & สั่งซื้อยา', shortLabel: 'ตะกร้า', icon: 'shopping_cart', href: '/checkout', isActive: route.path === '/checkout' },
  { label: 'ประวัติคำสั่งซื้อ', shortLabel: 'ประวัติ', icon: 'receipt_long', href: '/orders', isActive: route.path === '/orders' },
])

const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

function handleLogout() {
  showLogoutModal.value = true
}

async function confirmLogout() {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    clearSession()
    await navigateTo('/')
  } finally {
    isLoggingOut.value = false
    showLogoutModal.value = false
  }
}

onMounted(() => {
  const session = getSession()
  if (!session) {
    clearSession()
    window.location.href = '/'
  }
})
</script>
