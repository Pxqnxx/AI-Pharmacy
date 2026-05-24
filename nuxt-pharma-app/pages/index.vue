<template>
  <div class="bg-gradient-to-tr from-slate-900 via-indigo-950 to-teal-900 text-slate-100 min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
    
    <!-- Decorative background glowing blobs -->
    <div class="absolute -left-32 -top-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -right-32 -bottom-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <main class="w-full max-w-md z-10 space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <!-- Brand Logo / Header -->
      <div class="text-center">
        <div class="inline-flex w-16 h-16 bg-teal-500/10 text-teal-400 rounded-3xl items-center justify-center mb-4 border border-teal-500/20 shadow-lg shadow-teal-500/5">
          <span class="material-symbols-outlined text-[36px] icon-fill">medical_services</span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-white">
          PharmaAI <span class="text-teal-400">Portal</span>
        </h1>
        <p class="text-slate-400 text-sm mt-2 leading-relaxed">
          ระบบจัดการร้านยาอัจฉริยะและแพลตฟอร์มคัดกรองอาการโดย AI
        </p>
      </div>

      <!-- Segmented Role Selector Tabs -->
      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5 flex gap-1 shadow-inner relative">
        <button 
          @click="handleRoleChange('pharmacist')"
          class="flex-1 py-3 rounded-xl font-label-md text-xs font-bold transition-all flex items-center justify-center gap-2"
          :class="[
            role === 'pharmacist' 
              ? 'bg-teal-500 text-slate-900 shadow-md scale-102' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          ]"
        >
          <span class="material-symbols-outlined text-[18px]">local_pharmacy</span>
          เภสัชกร / แอดมิน
        </button>
        <button 
          @click="handleRoleChange('patient')"
          class="flex-1 py-3 rounded-xl font-label-md text-xs font-bold transition-all flex items-center justify-center gap-2"
          :class="[
            role === 'patient' 
              ? 'bg-teal-500 text-slate-900 shadow-md scale-102' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          ]"
        >
          <span class="material-symbols-outlined text-[18px]">person</span>
          ผู้ป่วย / ลูกค้า
        </button>
      </div>

      <!-- Login Glassmorphism Container Card -->
      <div class="bg-white/5 dark:bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Email / Username field -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">อีเมลผู้ใช้งาน</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">mail</span>
              <input
                v-model="email"
                type="email"
                required
                class="w-full bg-slate-900/50 border border-slate-700/60 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 outline-none text-sm text-white transition-all shadow-xs placeholder-slate-500"
                placeholder="example@pharmaai.com"
              />
            </div>
          </div>

          <!-- Password field -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">รหัสผ่าน</label>
              <a href="#" class="text-xs text-teal-400 hover:underline">ลืมรหัสผ่าน?</a>
            </div>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">lock</span>
              <input
                v-model="password"
                type="password"
                required
                class="w-full bg-slate-900/50 border border-slate-700/60 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 outline-none text-sm text-white transition-all shadow-xs placeholder-slate-500"
                placeholder="ป้อนรหัสผ่านของคุณ"
              />
            </div>
          </div>

          <!-- Remember me checkbox -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                class="w-4 h-4 rounded-sm bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 transition-colors"
                checked
              />
              <span class="text-xs text-slate-300">จดจำการเข้าระบบ</span>
            </label>
            <span class="text-[11px] text-emerald-400 font-bold flex items-center gap-0.5">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              ระบบ DB เชื่อมต่ออยู่
            </span>
          </div>

          <!-- Submit / Sign In Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-teal-400 hover:bg-teal-300 disabled:bg-teal-500/70 text-slate-950 font-bold py-4 px-6 rounded-xl shadow-lg shadow-teal-400/10 hover:shadow-teal-400/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group text-sm"
          >
            <!-- Animated Spinner or Lock Icon -->
            <template v-if="isLoading">
              <svg class="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังประเมินสิทธิ์...
            </template>
            <template v-else>
              <span class="material-symbols-outlined text-[20px] font-bold group-hover:translate-x-0.5 transition-transform">login</span>
              เข้าสู่ระบบทันที
            </template>
          </button>

        </form>
      </div>

      <!-- Quick Fast-Bypass Demo Note -->
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-center">
        <p class="text-xs text-slate-400 leading-relaxed">
          💡 **ระบบสาธิตด่วน**: กดสลับสิทธิ์ด้านบนและกดปุ่ม **"เข้าสู่ระบบทันที"** ได้เลย ระบบจะช่วยกรอกข้อมูลทดสอบจำลองให้แบบอัตโนมัติเพื่อความรวดเร็วในการทดลองใช้งาน
        </p>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#app'

// Standalone full screen - no headers or sidebars
definePageMeta({
  layout: 'default',
})

const router = useRouter()
const role = ref<'pharmacist' | 'patient'>('pharmacist')
const email = ref('admin@pharmaai.com')
const password = ref('••••••••')
const isLoading = ref(false)

// Handle switching between roles dynamically with mock credentials pre-filled
const handleRoleChange = (newRole: 'pharmacist' | 'patient') => {
  role.value = newRole
  if (newRole === 'pharmacist') {
    email.value = 'admin@pharmaai.com'
  } else {
    email.value = 'nichcha@pharmaai.com'
  }
}

// Simulated authentication check for premium delay feedback
const handleLogin = async () => {
  isLoading.value = true
  
  // 1-second simulated secure network check
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  isLoading.value = false
  if (role.value === 'pharmacist') {
    router.push('/dashboard')
  } else {
    router.push('/chat')
  }
}
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
