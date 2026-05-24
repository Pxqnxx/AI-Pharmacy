<template>
  <div class="bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-body-md antialiased min-h-screen flex">
    
    <!-- Desktop Navigation Drawer Sidebar (MD3 Spec) -->
    <nav class="hidden lg:flex flex-col bg-white dark:bg-slate-900 w-80 h-screen fixed inset-y-0 left-0 border-r border-slate-200 dark:border-slate-800 shadow-sm z-40 py-6 transition-all duration-300">
      <!-- Profile Header -->
      <div class="px-6 mb-8 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full overflow-hidden bg-teal-100 flex-shrink-0 border-2 border-teal-500 shadow-sm">
          <img alt="User Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxBLu7zT0jTqNe9TQngx_J3GsfySpVE1lxQOQcyZ26mDVejD0RSPb0PbLj_CmweAklHmXVk6Rq8PySysYwweBHZTpa1gM5nY3MLsyhR2piDo8G5_2CcRKIQvH9mil3m5cuncmBpdlYkKDqXy5uXKzvAMpDT4Q_HYOg3jMsf0h5eaWlNHSbefzMJsW28xyegn8TLNclHVeZWHnfuGh4X6Ut68qMU2Np6osxSQGQoSqqCpz9gcpGwCRwtioxqe5UbNOfItS333ifggY">
        </div>
        <div>
          <h2 class="font-headline-md text-slate-900 dark:text-white font-bold leading-tight">ระบบจัดการแอดมิน</h2>
          <p class="font-label-sm text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">มุมมองเภสัชกร</p>
          <p class="font-label-sm text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">v1.0.4</p>
        </div>
      </div>

      <!-- Navigation Menu Links -->
      <div class="flex-grow px-4 space-y-1.5 overflow-y-auto">
        <div class="font-label-sm text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2 font-bold">ระบบบริหารคลังและจัดการแอดมิน</div>
        <a 
          v-for="item in navigationMenu" 
          :key="item.href"
          :href="item.href"
          class="flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group active:scale-98"
          :class="[
            item.isActive 
              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-bold border-l-4 border-teal-600' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <div class="flex items-center gap-3.5">
            <span 
              class="material-symbols-outlined text-[22px] transition-colors"
              :class="[
                item.isActive 
                  ? 'text-teal-600 dark:text-teal-400 icon-fill' 
                  : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              ]"
            >
              {{ item.icon }}
            </span>
            <span class="font-label-md text-label-md">{{ item.label }}</span>
          </div>
          <span v-if="item.isActive" class="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
        </a>
      </div>

      <!-- Footer Brand Info -->
      <div class="px-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <span>© 2026 PharmaAI Inc.</span>
        <span class="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">v4.0.0</span>
      </div>
    </nav>

    <!-- Main Content Canvas Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-80">
      
      <!-- TopAppBar Navigation Header -->
      <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 w-full z-30 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 lg:px-8 h-16 shadow-xs">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Drawer trigger -->
          <button class="lg:hidden text-slate-600 dark:text-slate-300 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <h1 class="font-headline-md text-slate-900 dark:text-white font-extrabold flex items-center gap-2">
            PharmaAI 
            <span class="hidden md:inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-200/50">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              Supabase Live
            </span>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <button class="text-slate-500 hover:text-slate-800 dark:hover:text-white p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span class="material-symbols-outlined">search</span>
          </button>
          <span class="hidden sm:inline-flex bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-full font-label-sm text-xs font-semibold text-slate-600 dark:text-slate-300">
            24 พ.ค. 2026
          </span>
        </div>
      </header>

      <!-- Main Canvas Canvas Page Area -->
      <main class="flex-1 py-8 px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-8">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

// Computed navigation menu linking to routes dynamically
const navigationMenu = computed(() => [
  { label: 'ภาพรวมระบบ (Overview)', icon: 'dashboard', href: '/dashboard', isActive: route.path === '/dashboard' },
  { label: 'จัดการคลังสินค้า (Inventory)', icon: 'inventory_2', href: '/inventory', isActive: route.path === '/inventory' },
  { label: 'ตรวจสอบยาหมดอายุ', icon: 'running_with_errors', href: '/expiry-alerts', isActive: route.path === '/expiry-alerts' },
  { label: 'ประวัติธุรกรรมซื้อขาย', icon: 'receipt_long', href: '/orders', isActive: route.path === '/orders' },
  { label: 'โปรไฟล์สุขภาพผู้ป่วย', icon: 'medical_information', href: '/health', isActive: route.path === '/health' },
  { label: 'ทดสอบเชื่อมฐานข้อมูลสด', icon: 'database', href: '/test-products', isActive: route.path === '/test-products' },
  { label: 'แชทพูดคุยปรึกษา AI', icon: 'forum', href: '/chat', isActive: route.path === '/chat' },
  { label: 'ออกจากระบบ', icon: 'logout', href: '/', isActive: false },
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
