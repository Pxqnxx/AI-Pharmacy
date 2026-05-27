<template>
  <div class="bg-gradient-to-br from-slate-50 via-teal-50/30 to-indigo-50/25 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-900 text-slate-800 dark:text-slate-100 min-h-screen relative overflow-x-hidden selection:bg-teal-500/20 selection:text-teal-700 transition-colors duration-300" style="font-family: 'Plus Jakarta Sans', sans-serif;">
    
    <!-- Decorative background glowing blobs for visual WOW factor -->
    <div class="absolute top-20 left-10 w-96 h-96 bg-teal-400/10 dark:bg-teal-500/15 rounded-full blur-[130px] pointer-events-none"></div>
    <div class="absolute top-1/3 right-10 w-[450px] h-[450px] bg-indigo-400/8 dark:bg-indigo-500/12 rounded-full blur-[150px] pointer-events-none"></div>
    <div class="absolute bottom-20 left-1/4 w-[550px] h-[550px] bg-emerald-400/6 dark:bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none"></div>

    <!-- 1. Premium Responsive Floating Glass Navigation Header -->
    <header class="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/80 px-6 lg:px-12 py-3.5 flex items-center justify-between shadow-[0_8px_32px_rgba(20,184,166,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
      <!-- Brand Logo & pulsing micro-animations -->
      <div 
        @click="navigateTo('/')" 
        class="flex items-center gap-3 group cursor-pointer select-none"
      >
        <div class="w-10 h-10 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/20 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center border border-teal-200/50 dark:border-teal-500/25 shadow-sm shadow-teal-500/5 group-hover:scale-105 group-hover:border-teal-400 group-hover:shadow-teal-500/10 transition-all duration-300">
          <span class="material-symbols-outlined text-[24px] icon-fill">medical_services</span>
        </div>
        <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
          PharmaAI <span class="text-teal-600 dark:text-teal-400 font-medium transition-colors duration-300">Portal</span>
        </span>
      </div>

      <!-- Desktop Nav Menu Links with capsule HSL hover effects -->
      <nav class="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <a href="#hero" class="px-4 py-2.5 rounded-xl hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 active:scale-95 transition-all duration-200">หน้าแรก</a>
        <a href="#ai-chat" class="px-4 py-2.5 rounded-xl hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 active:scale-95 transition-all duration-200 flex items-center gap-1.5">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          ปรึกษา AI
        </a>
        <a href="#features" class="px-4 py-2.5 rounded-xl hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 active:scale-95 transition-all duration-200">ทำไมต้องใช้เรา</a>
        <a href="#compliance" class="px-4 py-2.5 rounded-xl hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 active:scale-95 transition-all duration-200">ความปลอดภัย</a>
      </nav>

      <!-- Navbar Auth Actions -->
      <div class="flex items-center gap-3">
        <!-- Logged in Session options -->
        <template v-if="activeSession">
          <div class="hidden lg:flex items-center gap-2.5 bg-slate-100/80 dark:bg-white/5 border border-slate-200/40 dark:border-white/10 px-3.5 py-1.5 rounded-xl text-right">
            <div class="flex flex-col items-end">
              <span class="text-xs font-black text-slate-800 dark:text-slate-200 leading-none">คุณ {{ activeSession.fullName }}</span>
              <span class="text-[9px] text-teal-600 dark:text-teal-400 uppercase tracking-wider font-semibold mt-1">{{ activeSession.role === 'pharmacist' ? 'เภสัชกร / แอดมิน' : 'ผู้ป่วย / ลูกค้า' }}</span>
            </div>
            <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <button 
            @click="goToDashboard"
            class="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-300"
          >
            เข้าห้องแชทหลัก
          </button>
          <button 
            @click="handleLogout"
            class="group relative overflow-hidden border border-red-200 dark:border-red-500/30 hover:border-red-500 bg-red-50 dark:bg-red-500/5 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white px-4 py-2.5 rounded-xl text-xs font-extrabold active:scale-95 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all duration-300 flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[15px] group-hover:rotate-12 transition-transform duration-300">logout</span>
            <span>ออกจากระบบ</span>
          </button>
        </template>

        <!-- Anonymous Options -->
        <template v-else>
          <button 
            @click="openAuthModal('login')"
            class="text-xs font-black text-teal-600 dark:text-teal-300 border-2 border-teal-500/60 dark:border-teal-500/40 hover:border-teal-500 hover:bg-teal-50/80 dark:hover:bg-teal-500/10 px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95"
          >
            <span class="material-symbols-outlined text-[16px]">login</span>
            เข้าสู่ระบบ
          </button>
          <button 
            @click="openAuthModal('register')"
            class="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 hover:from-teal-400 hover:via-teal-500 hover:to-emerald-400 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
          >
            <span class="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">how_to_reg</span>
            สมัครสมาชิกฟรี
          </button>
        </template>

        <!-- Responsive Mobile Burger Menu Icon -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="flex lg:hidden p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all active:scale-90"
        >
          <span class="material-symbols-outlined text-[24px]">
            {{ isMobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </header>

    <!-- Mobile Responsive Slide-down Navigation Panel -->
    <transition 
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div 
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed top-[73px] inset-x-0 z-35 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 px-6 py-6 flex flex-col gap-4 shadow-2xl animate-scaleUp animate-[fadeIn_0.2s_ease-out]"
      >
        <a href="#hero" @click="isMobileMenuOpen = false" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm py-2.5 px-4 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">หน้าแรก</a>
        <a href="#ai-chat" @click="isMobileMenuOpen = false" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm py-2.5 px-4 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          ปรึกษา AI
        </a>
        <a href="#features" @click="isMobileMenuOpen = false" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm py-2.5 px-4 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">ทำไมต้องใช้เรา</a>
        <a href="#compliance" @click="isMobileMenuOpen = false" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm py-2.5 px-4 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">ความปลอดภัย</a>
        
        <div class="h-px bg-slate-200 dark:bg-white/10 my-1"></div>
        
        <!-- Logged in state on Mobile -->
        <div v-if="activeSession" class="flex flex-col gap-3">
          <div class="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-xl flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-black text-slate-800 dark:text-slate-200">คุณ {{ activeSession.fullName }}</span>
              <span class="text-[9px] text-teal-650 dark:text-teal-400 uppercase tracking-wider font-semibold mt-0.5">{{ activeSession.role === 'pharmacist' ? 'เภสัชกร / แอดมิน' : 'ผู้ป่วย / ลูกค้า' }}</span>
            </div>
            <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <button 
            @click="goToDashboard(); isMobileMenuOpen = false"
            class="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black py-3 rounded-xl text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[16px] icon-fill">forum</span>
            เข้าห้องแชทหลัก
          </button>
          <button 
            @click="handleLogout(); isMobileMenuOpen = false"
            class="w-full bg-red-50 dark:bg-red-500/5 hover:bg-red-500 border border-red-200 dark:border-red-500/30 text-red-650 dark:text-red-400 hover:text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] active:scale-[0.98] transition-all duration-300"
          >
            <span class="material-symbols-outlined text-[16px]">logout</span>
            ออกจากระบบ
          </button>
        </div>
        
        <!-- Logged out state on Mobile -->
        <div v-else class="flex flex-col gap-2">
          <button 
            @click="openAuthModal('login'); isMobileMenuOpen = false"
            class="w-full border-2 border-teal-500/60 dark:border-teal-500/40 text-teal-600 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-500 font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition-all duration-300"
          >
            <span class="material-symbols-outlined text-[18px]">login</span>
            เข้าสู่ระบบ
          </button>
          <button 
            @click="openAuthModal('register'); isMobileMenuOpen = false"
            class="w-full bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 hover:from-teal-400 hover:via-teal-500 hover:to-emerald-400 text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
          >
            <span class="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">how_to_reg</span>
            สมัครสมาชิกฟรี
          </button>
        </div>
      </div>
    </transition>

    <!-- 2. Hero Presentation Section -->
    <section id="hero" class="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
      <div class="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-cyan-500/15 dark:from-teal-500/20 dark:via-emerald-500/15 dark:to-cyan-500/20 border border-teal-300/40 dark:border-teal-500/30 text-teal-700 dark:text-teal-250 px-4 py-2 rounded-full text-xs font-bold mb-8 shadow-lg shadow-teal-500/10">
        <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
        <span>ระบบวิเคราะห์โรคโดย AI และเชื่อมโยงคลังยาสดแบบเรียลไทม์</span>
      </div>

      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
        เพื่อนคู่คิดสุขภาพอัจฉริยะ <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500 dark:from-teal-400 dark:via-emerald-400 dark:to-indigo-400 animate-gradient">
          ดูแลคุณทุกที่ ทุกเวลา ตลอด 24 ชม.
        </span>
      </h1>

      <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mb-10 leading-relaxed">
        PharmaAI ปฏิวัติการดูแลตัวเองเบื้องต้นด้วยระบบตรวจคัดกรองอาการโดยปัญญาประดิษฐ์ชั้นนำ (Gemini Engine) 
        พร้อมสืบค้นรายการยาและตรวจสอบระดับสต็อกคงเหลือจากระบบคลังสินค้าหลังร้านได้ทันที สะดวก รวดเร็ว ปลอดภัย
      </p>

      <div class="flex flex-wrap justify-center gap-4">
        <a 
          href="#ai-chat"
          class="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 hover:from-teal-400 hover:via-teal-500 hover:to-emerald-400 text-white font-bold px-6 py-3.5 rounded-xl text-xs shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 active:scale-[0.98] hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
        >
          <span class="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">forum</span>
          เริ่มปรึกษา AI ฟรีตอนนี้
        </a>
        <button 
          v-if="!activeSession"
          @click="openAuthModal('register')"
          class="bg-white dark:bg-slate-900 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 dark:hover:bg-gradient-to-br dark:hover:from-emerald-950/30 dark:hover:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-400 text-slate-700 dark:text-slate-200 font-bold px-6 py-3.5 rounded-xl text-xs active:scale-[0.98] transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-500/10"
        >
          สมัครบัญชีผู้ป่วยใหม่
        </button>
      </div>
    </section>

    <!-- 3. Interactive Live AI Chat Preview Widget -->
    <section id="ai-chat" class="max-w-6xl mx-auto px-6 py-16 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Left Side Column: Stepper medical workflow instructions -->
        <div class="lg:col-span-5 text-left space-y-6">
          <div class="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border border-teal-500/25 shadow-xs shadow-teal-500/5">
            <span class="material-symbols-outlined text-[13px] icon-fill">smart_toy</span>
            <span>AI Doctor Assistant</span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            ปรึกษาเภสัชกร AI <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
              ประเมินอาการได้ใน 3 วินาที
            </span>
          </h2>

          <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            ทดลองพิมพ์บอกอาการป่วยของคุณในกล่องด้านข้าง ระบบ AI ประมวลผลทางการแพทย์จะทำการประเมินโรคเบื้องต้น พร้อมสืบค้นจำนวนยาสต็อกคงคลังสินค้าจริงให้ทันที สะดวก ปลอดภัย ตลอด 24 ชั่วโมง
          </p>

          <!-- Stepper items container -->
          <div class="space-y-4 pt-2">
            <!-- Step 1 -->
            <div class="flex gap-4 group">
              <div class="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-200/50 dark:border-teal-500/25 text-teal-650 dark:text-teal-400 flex items-center justify-center font-black text-xs flex-shrink-0 group-hover:scale-105 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-sm shadow-teal-500/5">
                01
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-teal-500 transition-colors">ระบุอาการป่วยเบื้องต้น</h4>
                <p class="text-[10px] text-slate-450 dark:text-slate-450 mt-0.5 leading-normal">ป้อนข้อมูลหรือพิมพ์อาการป่วยของคุณ เช่น ปวดหัว, คลื่นไส้ หรือ คัดจมูก</p>
              </div>
            </div>
            <!-- Step 2 -->
            <div class="flex gap-4 group">
              <div class="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-200/50 dark:border-teal-500/25 text-teal-650 dark:text-teal-400 flex items-center justify-center font-black text-xs flex-shrink-0 group-hover:scale-105 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-sm shadow-teal-500/5">
                02
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-teal-500 transition-colors">วิเคราะห์ความเสี่ยงและโรค</h4>
                <p class="text-[10px] text-slate-450 dark:text-slate-450 mt-0.5 leading-normal">ปัญญาประดิษฐ์ Gemini Engine จะทำการกรองกลุ่มโรคเบื้องต้นตามแนวทางการแพทย์</p>
              </div>
            </div>
            <!-- Step 3 -->
            <div class="flex gap-4 group">
              <div class="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-200/50 dark:border-teal-500/25 text-teal-650 dark:text-teal-400 flex items-center justify-center font-black text-xs flex-shrink-0 group-hover:scale-105 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-sm shadow-teal-500/5">
                03
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-teal-500 transition-colors">สืบค้นคลังสินค้าและสต็อกยา</h4>
                <p class="text-[10px] text-slate-450 dark:text-slate-450 mt-0.5 leading-normal">เชื่อมโยงระบบคลังยา Drizzle แนะนำยาตัวจริงและปริมาณคงคลังให้ทันที</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Column: Interactive Chat widget -->
        <div class="lg:col-span-7">
          <!-- Chat Container Module -->
          <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden relative shadow-[0_15px_50px_-15px_rgba(20,184,166,0.04)] dark:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.5)] flex flex-col h-[500px]">
            
            <!-- Chat Header -->
            <div class="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md z-10">
              <div class="flex items-center gap-3">
                <div class="relative flex items-center justify-center">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-500/10">
                    <span class="material-symbols-outlined text-[20px] icon-fill">smart_toy</span>
                  </div>
                  <span class="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
                  </span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-800 dark:text-white leading-tight">PharmaAI เภสัชกรอัจฉริยะ (Preview)</span>
                  <span class="text-[10px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    วิเคราะห์อาการและแนะนำยาในคลังจริง
                  </span>
                </div>
              </div>

              <!-- Reset chat preview button -->
              <button 
                @click="resetChat"
                class="p-2 text-slate-450 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all active:scale-95"
                title="ล้างข้อมูลแชทจำลอง"
              >
                <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
              </button>
            </div>

            <!-- Chat messages area -->
            <div 
              ref="chatContainer"
              class="flex-grow overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30 px-5 py-5 flex flex-col gap-5 pb-40 scroll-container relative"
            >
              <!-- Time indicator -->
              <div class="flex justify-center w-full my-0.5">
                <span class="bg-slate-100 dark:bg-white/5 border border-slate-200/40 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[10px] px-3 py-1 rounded-full">
                  สนทนาเบื้องต้นเมื่อ {{ currentSessionTime }}
                </span>
              </div>

              <!-- Message bubbles -->
              <div 
                v-for="msg in consultationMessages"
                :key="msg.id"
                class="flex items-start gap-3.5 max-w-[85%] sm:max-w-[75%]"
                :class="msg.role === 'user' ? 'self-end flex-row-reverse' : ''"
              >
                <!-- Avatar -->
                <div 
                  class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border transition-all"
                  :class="msg.role === 'bot' 
                    ? 'bg-gradient-to-tr from-teal-500 to-emerald-500 text-white border-teal-400/20' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 shadow-sm'"
                >
                  <span v-if="msg.role === 'bot'" class="material-symbols-outlined text-[16px] icon-fill">smart_toy</span>
                  <span v-else class="material-symbols-outlined text-[18px]">person</span>
                </div>

                <!-- Content bubble wrapper -->
                <div class="flex flex-col gap-1" :class="msg.role === 'user' ? 'items-end' : ''">
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1">
                    {{ msg.role === 'bot' ? 'ระบบตรวจอาการ AI' : 'คุณ (ผู้ป่วยทั่วไป)' }}
                  </span>
                  <div 
                    class="px-4 py-3 shadow-sm text-xs leading-relaxed transition-all"
                    :class="msg.role === 'bot'
                      ? 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl rounded-tl-none text-slate-800 dark:text-slate-100 shadow-sm'
                      : 'bg-gradient-to-tr from-teal-500 to-emerald-650 text-white font-semibold rounded-2xl rounded-tr-none shadow-sm shadow-teal-500/10'"
                  >
                    <!-- If bot renders Markdown formatted HTML -->
                    <div v-if="msg.role === 'bot'">
                      <div v-html="formatBotMessage(msg.content)"></div>
                      
                      <!-- Special call-to-action button when a medicine recommendation is shown inside bot responses -->
                      <div class="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col gap-2">
                        <p class="text-[10px] text-slate-500 dark:text-slate-400">💡 ต้องการรับคำแนะนำอย่างละเอียด บันทึกข้อมูลสุขภาพ หรือสั่งซื้อยาตัวนี้?</p>
                        <button 
                          @click="handleBuyAction"
                          class="w-full bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-500 text-teal-600 dark:text-teal-300 hover:text-white border border-teal-200/50 dark:border-teal-500/25 hover:border-transparent font-bold py-2 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1"
                        >
                          <span class="material-symbols-outlined text-[14px]">shopping_cart</span>
                          เข้าสู่ระบบเพื่อดำเนินการสั่งซื้อยาผ่านคลังสินค้า
                        </button>
                      </div>
                    </div>
                    <!-- If user message -->
                    <div v-else class="whitespace-pre-wrap">{{ msg.content }}</div>
                  </div>
                </div>
              </div>

              <!-- Typing loading simulator -->
              <div v-if="isTyping" class="flex items-start gap-3.5 max-w-[85%] sm:max-w-[75%] animate-pulse">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-50 to-emerald-500 text-white flex items-center justify-center">
                  <span class="material-symbols-outlined text-[16px] icon-fill">smart_toy</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">PharmaAI กำลังวิเคราะห์ข้อมูลการแพทย์...</span>
                  <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 h-9 shadow-sm">
                    <span class="w-1.5 h-1.5 bg-teal-405 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                    <span class="w-1.5 h-1.5 bg-teal-405 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                    <span class="w-1.5 h-1.5 bg-teal-405 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat input area dock -->
            <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/95 to-white/0 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950/0 px-4 pb-4 pt-2 z-20">
              <!-- Quick symptom selector chips (Only visible when no user message yet) -->
              <div v-if="isDefaultWelcome" class="flex flex-wrap gap-1.5 mb-2.5 max-w-full overflow-x-auto py-1">
                <button 
                  @click="sendQuickSymptom(chip.query)"
                  v-for="chip in quickChips"
                  :key="chip.label"
                  class="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 hover:border-teal-500/40 text-[11px] rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-all flex items-center gap-1 shrink-0"
                >
                  <span>{{ chip.icon }}</span>
                  <span>{{ chip.label }}</span>
                  <span class="material-symbols-outlined text-[12px] opacity-40">chevron_right</span>
                </button>
              </div>

              <!-- Input bar capsule -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-1.5 flex items-center gap-2 shadow-sm focus-within:border-teal-500/40 focus-within:shadow-[0_0_15px_rgba(20,184,166,0.06)] transition-all">
                <!-- File upload clip button -->
                <button 
                  @click="handleRestrictedFeature('อัปโหลดไฟล์รูปภาพหรือภาพถ่ายอาการป่วย')"
                  class="p-2 text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"
                  title="แนบรูปถ่ายอาการ"
                >
                  <span class="material-symbols-outlined text-[20px]">attach_file</span>
                </button>

                <!-- Text Field Input -->
                <input 
                  v-model="chatInputText"
                  type="text"
                  placeholder="ถามหัวข้ออาการป่วย หรือตรวจสอบสต็อกยา เช่น 'ปวดฟัน มีแก้อักเสบตัวไหนบ้าง?'"
                  class="flex-grow bg-transparent border-0 outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 py-2.5 px-1 min-w-0"
                  @keydown.enter.prevent="sendMessage"
                  :disabled="isTyping"
                />

                <!-- Submit button -->
                <button 
                  @click="sendMessage"
                  :disabled="!chatInputText.trim() || isTyping"
                  class="p-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-400 disabled:opacity-30 disabled:hover:bg-teal-500 transition-all flex items-center justify-center shadow-sm"
                >
                  <span class="material-symbols-outlined text-[16px] icon-fill">send</span>
                </button>
              </div>

              <!-- Small notice bar -->
              <p class="text-center text-[9px] text-slate-400 dark:text-slate-500 mt-2 flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-[11px]">info</span>
                คำแนะนำ AI เป็นการประเมินเบื้องต้นเท่านั้น ห้ามใช้แทนความเห็นแพทย์กรณีอาการป่วยวิกฤตเฉียบพลัน
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Platform Benefits Section (Bento grid style promotion) -->
    <section id="features" class="max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-transparent bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent dark:from-transparent dark:via-emerald-600/5 dark:to-transparent">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-300/40 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-250 px-4 py-2 rounded-full text-xs font-bold mb-4 shadow-lg shadow-emerald-500/10">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          ทำไมจึงเลือก PharmaAI
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">ทำไมสถานพยาบาลและผู้ป่วยเลือกใช้ PharmaAI?</h2>
        <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-3 max-w-xl mx-auto">
          เราผสานนวัตกรรมซอฟต์แวร์การแพทย์เข้ากับระบบฐานข้อมูลที่เสถียร ยืดหยุ่น และใช้งานง่ายที่สุด
        </p>
      </div>

      <!-- Bento Grid Cards Container -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
        <!-- Feature 1 -->
        <div class="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 hover:border-teal-500/30 dark:hover:border-teal-500/20 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 dark:hover:shadow-teal-950/20 relative overflow-hidden group hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-teal-50/15 dark:hover:from-slate-900 dark:hover:to-teal-950/10 transition-all duration-300 flex flex-col items-center text-center min-h-[260px] justify-start">
          <!-- Ambient glowing background blob on hover -->
          <div class="absolute -right-10 -top-10 w-24 h-24 bg-teal-400/5 dark:bg-teal-500/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500 pointer-events-none"></div>
          
          <div class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 text-teal-650 dark:text-teal-400 flex items-center justify-center mb-7 border border-teal-200/50 dark:border-teal-500/15 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span class="material-symbols-outlined text-[24px] icon-fill">health_and_safety</span>
          </div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white mb-2.5 tracking-tight">วิเคราะห์อาการตรงจุด</h3>
          <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[92%]">
            คัดกรองและประเมินอาการป่วยเบื้องต้นด้วย AI ทางการแพทย์ได้อย่างรวดเร็ว แม่นยำ และปลอดภัย
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 hover:border-sky-500/30 dark:hover:border-sky-500/20 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 dark:hover:shadow-sky-950/20 relative overflow-hidden group hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-sky-50/15 dark:hover:from-slate-900 dark:hover:to-sky-950/10 transition-all duration-300 flex flex-col items-center text-center min-h-[260px] justify-start">
          <!-- Ambient glowing background blob on hover -->
          <div class="absolute -right-10 -top-10 w-24 h-24 bg-sky-400/5 dark:bg-sky-500/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500 pointer-events-none"></div>
          
          <div class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-7 border border-sky-200/50 dark:border-sky-500/15 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span class="material-symbols-outlined text-[24px] icon-fill">inventory_2</span>
          </div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white mb-2.5 tracking-tight">ตรวจสอบสต็อกยาสด</h3>
          <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[92%]">
            ค้นหารายการยาและเช็กจำนวนสต็อกคงเหลือในคลังยาหลังร้านได้ทันทีแบบเรียลไทม์
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 hover:border-violet-500/30 dark:hover:border-violet-500/20 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 dark:hover:shadow-violet-950/20 relative overflow-hidden group hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-violet-50/15 dark:hover:from-slate-900 dark:hover:to-violet-950/10 transition-all duration-300 flex flex-col items-center text-center min-h-[260px] justify-start">
          <!-- Ambient glowing background blob on hover -->
          <div class="absolute -right-10 -top-10 w-24 h-24 bg-violet-400/5 dark:bg-violet-500/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500 pointer-events-none"></div>
          
          <div class="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-7 border border-violet-200/50 dark:border-violet-500/15 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span class="material-symbols-outlined text-[24px]">qr_code_2</span>
          </div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white mb-2.5 tracking-tight">ชำระสะดวกปลอดภัย</h3>
          <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[92%]">
            สแกนชำระเงินสะดวกผ่านระบบ Dynamic QR PromptPay พร้อมออกบิลหลักฐานอย่างรวดเร็ว
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:shadow-emerald-950/20 relative overflow-hidden group hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/15 dark:hover:from-slate-900 dark:hover:to-emerald-950/10 transition-all duration-300 flex flex-col items-center text-center min-h-[260px] justify-start">
          <!-- Ambient glowing background blob on hover -->
          <div class="absolute -right-10 -top-10 w-24 h-24 bg-emerald-400/5 dark:bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500 pointer-events-none"></div>
          
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-7 border border-emerald-200/50 dark:border-emerald-500/15 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span class="material-symbols-outlined text-[24px] icon-fill">verified_user</span>
          </div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white mb-2.5 tracking-tight">ความปลอดภัยสูงสุด</h3>
          <p class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[92%]">
            ปกป้องข้อมูลประวัติคนไข้ตามมาตรฐานสากล พร้อมระบบควบคุมสิทธิ์การเข้าถึงอย่างรัดกุม
          </p>
        </div>
      </div>
    </section>

    <!-- 5. Security & RBAC Compliance Section -->
    <section id="compliance" class="max-w-5xl mx-auto px-6 py-12 relative z-10 border-t border-transparent">
      <div class="bg-gradient-to-br from-emerald-500/8 via-white to-teal-500/8 dark:from-emerald-950/40 dark:via-indigo-950/20 dark:to-slate-900/30 border-2 border-emerald-200/50 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/15 dark:to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span class="material-symbols-outlined text-[36px] icon-fill">security</span>
        </div>
        <div class="flex-grow space-y-1 text-center">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">ปกป้องข้อมูลคนไข้ด้วยมาตรฐานการแพทย์ขั้นสูง</h3>
          <p class="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            ประวัติการประเมินสุขภาพของคุณทั้งหมดจะถูกบันทึกอย่างปลอดภัยผ่านระบบ Supabase Auth 
            เรามีการกั้นบทบาทหน้าที่อย่างโปร่งใส บัญชีผู้ป่วยจะไม่สามารถเข้าหน้าจัดการคลังสินค้าของแพทย์หรือเภสัชกรได้เพื่อป้องกันข้อมูลรั่วไหล
          </p>
        </div>
        <div class="flex-shrink-0">
          <span class="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-500/15 dark:to-teal-500/10 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
            RBAC HIPAA Compliant
          </span>
        </div>
      </div>
    </section>

    <!-- 6. Simple Footer branding -->
    <footer class="border-t border-slate-200/50 dark:border-white/5 py-8 text-center text-[11px] text-slate-400 dark:text-slate-500 relative z-10">
      <p>© 2026 PharmaAI Inc. ระบบคัดกรองสุขภาพและบริหารจัดการยาออนไลน์อัจฉริยะ สงวนลิขสิทธิ์</p>
      <div class="flex justify-center gap-3 mt-2 text-slate-400 dark:text-slate-650">
        <span>Supabase Postgres Live</span>
        <span>•</span>
        <span>Gemini AI Engine</span>
        <span>•</span>
        <span>Version 4.0.0</span>
      </div>
    </footer>

    <!-- 7. Premium Glassmorphic Login & Register Modal Overlay -->
    <div 
      v-if="showAuthModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.25s_ease-out]"
      @click.self="showAuthModal = false"
    >
      <!-- Modal Card Box -->
      <div class="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-2xl text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto z-10 animate-scaleUp">
        
        <!-- Close Button -->
        <button 
          @click="showAuthModal = false"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>

        <!-- Brand / Logo inside Modal -->
        <div class="text-center mb-5">
          <div class="inline-flex w-11 h-11 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl items-center justify-center mb-2 border border-teal-200/55 dark:border-teal-500/20 shadow-sm">
            <span class="material-symbols-outlined text-[24px] icon-fill">medical_services</span>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white">PharmaAI Platform</h3>
          <p class="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5">ระบบเข้าสู่ประวัติคนไข้และระบบจัดการยา</p>
        </div>

        <!-- Optional contextual banner message from chat triggers -->
        <div v-if="authModalContext" class="mb-4 bg-teal-50 dark:bg-teal-500/10 border border-teal-200/50 dark:border-teal-500/20 text-teal-700 dark:text-teal-250 p-3 rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed">
          <span class="material-symbols-outlined shrink-0 text-[16px] text-teal-600 dark:text-teal-450 icon-fill">info</span>
          <span>{{ authModalContext }}</span>
        </div>

        <!-- Segmented Role Selector Tabs (Only in Login Mode for quick selection - exactly matches test specifications) -->
        <div v-if="!isRegisterMode" class="bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-1 flex gap-1 mb-5 shadow-inner">
          <button 
            @click="handleRoleChange('pharmacist')"
            class="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
            :class="[
              role === 'pharmacist' 
                ? 'bg-teal-500 text-white shadow-sm font-extrabold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
            ]"
          >
            <span class="material-symbols-outlined text-[14px]">local_pharmacy</span>
            เภสัชกร / แอดมิน
          </button>
          <button 
            @click="handleRoleChange('patient')"
            class="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
            :class="[
              role === 'patient' 
                ? 'bg-teal-500 text-white shadow-sm font-extrabold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
            ]"
          >
            <span class="material-symbols-outlined text-[14px]">person</span>
            ผู้ป่วย / ลูกค้า
          </button>
        </div>

        <!-- Mode Title Header -->
        <h4 class="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-teal-600 dark:text-teal-400 text-[18px]">
            {{ isRegisterMode ? 'how_to_reg' : 'login' }}
          </span>
          {{ isRegisterMode ? 'ลงทะเบียนสมัครบัญชีใหม่' : 'เข้าสู่ระบบบัญชีของคุณ' }}
        </h4>

        <!-- Alert Banner Blocks -->
        <div v-if="errorMessage" class="mb-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed animate-shake">
          <span class="material-symbols-outlined shrink-0 text-[16px] text-red-500">error</span>
          <span>{{ errorMessage }}</span>
        </div>
        <div v-if="successMessage" class="mb-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-200 p-3.5 rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed">
          <span class="material-symbols-outlined shrink-0 text-[16px] text-emerald-600 dark:text-emerald-400">check_circle</span>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Submission Form (identical parameters and bindings to support automation tests) -->
        <form @submit.prevent="handleSubmit" class="space-y-3.5">
          <!-- Register Exclusive Form Fields -->
          <template v-if="isRegisterMode">
            <!-- Full Name input field -->
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ชื่อ-นามสกุลจริง</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[16px]">badge</span>
                <input 
                  v-model="regFullName"
                  type="text"
                  required
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="ป้อนชื่อและนามสกุลจริงของคุณ"
                />
              </div>
            </div>

            <!-- Phone Number input field -->
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">เบอร์โทรศัพท์มือถือ</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[16px]">phone</span>
                <input 
                  v-model="regPhone"
                  type="tel"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="08X-XXX-XXXX (ไม่บังคับ)"
                />
              </div>
            </div>

            <!-- Age + Gender Row -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Age -->
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">อายุ (ปี)</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[16px]">cake</span>
                  <input 
                    v-model="regAge"
                    type="number"
                    min="1"
                    max="120"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="เช่น 35"
                  />
                </div>
              </div>

              <!-- Gender -->
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">เพศ</label>
                <div class="flex gap-1.5">
                  <button
                    v-for="g in genderOptions"
                    :key="g.value"
                    type="button"
                    @click="regGender = g.value"
                    class="flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border"
                    :class="regGender === g.value
                      ? 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/60 text-teal-650 dark:text-teal-300 font-extrabold shadow-sm shadow-teal-500/5'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-300'"
                  >
                    {{ g.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Congenital Diseases input field -->
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">โรคประจำตัว</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[16px]">clinical_notes</span>
                <input 
                  v-model="regCongenitalDiseases"
                  type="text"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="เช่น โรคเบาหวาน, โรคความดันโลหิตสูง (ไม่บังคับ)"
                />
              </div>
            </div>

            <!-- Drug Allergies input field -->
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ประวัติการแพ้ยา</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[16px]">vaccines</span>
                <input 
                  v-model="regDrugAllergies"
                  type="text"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="เช่น กลุ่มยาเพนิซิลลิน, ยาแอสไพริน (ไม่บังคับ)"
                />
              </div>
            </div>

            <!-- Health Metrics Responsive Grid Inputs -->
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">น้ำหนัก (กก.)</label>
                <input 
                  v-model="regWeight"
                  type="text"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="เช่น 58"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ส่วนสูง (ซม.)</label>
                <input 
                  v-model="regHeight"
                  type="text"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="เช่น 165"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ความดันโลหิต</label>
                <input 
                  v-model="regBloodPressure"
                  type="text"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="เช่น 120/80"
                />
              </div>

              <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ชีพจร (ครั้ง/นาที)</label>
                <input 
                  v-model="regHeartRate"
                  type="text"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  placeholder="เช่น 72"
                />
              </div>
            </div>

            <!-- Notice box for roles inside Register Mode -->
            <div class="flex items-start gap-2.5 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-350 text-[10px] px-3.5 py-2.5 rounded-xl">
              <span class="material-symbols-outlined text-[14px] text-teal-600 dark:text-teal-450 shrink-0 mt-0.5 icon-fill">person</span>
              <span>สมัครสมาชิกสำหรับ <strong>ผู้ป่วย / ลูกค้าทั่วไป</strong> เท่านั้น — บัญชีแอดมินหรือเภสัชกรสร้างโดยผู้ดูแลระบบ</span>
            </div>
          </template>

          <!-- Email Address field -->
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">อีเมลผู้ใช้งาน</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[16px]">mail</span>
              <input 
                v-model="email"
                type="email"
                required
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <!-- Password field -->
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">รหัสผ่านบัญชี</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[16px]">lock</span>
              <input 
                v-model="password"
                type="password"
                required
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 pl-10 pr-3 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 outline-none text-xs text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="ป้อนรหัสผ่านเข้าใช้งาน"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="isLoading">
              <svg class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>กำลังส่งข้อมูลเข้าสู่ระบบ...</span>
            </template>
            <template v-else>
              <span class="material-symbols-outlined text-[16px] font-bold">
                {{ isRegisterMode ? 'how_to_reg' : 'login' }}
              </span>
              <span>{{ isRegisterMode ? 'ลงทะเบียนข้อมูลจริง' : 'เข้าสู่ระบบบัญชีสมาชิก' }}</span>
            </template>
          </button>
        </form>

        <!-- Toggle Switch login <-> register modes -->
        <div class="mt-5 pt-3.5 border-t border-white/10 text-center text-xs">
          <span class="text-slate-400">{{ isRegisterMode ? 'มีบัญชีผู้ใช้งานอยู่แล้วใช่ไหม?' : 'ยังไม่มีบัญชีในระบบ?' }}</span>
          <button 
            @click="toggleMode"
            class="text-teal-400 hover:text-teal-300 font-bold ml-1 hover:underline active:scale-95 transition-transform"
          >
            {{ isRegisterMode ? 'เข้าสู่ระบบตรงนี้' : 'สร้างบัญชีผู้ป่วยใหม่ที่นี่' }}
          </button>
        </div>

        <!-- Demonstration notice -->
        <div class="mt-4 bg-white/5 border border-white/5 rounded-xl p-3 text-center">
          <p class="text-[9px] text-slate-400 leading-relaxed">
            💡 <strong>ระบบคลาวด์สด</strong>: ข้อมูลที่ใช้ลงทะเบียนจะถูกบันทึกจริง สามารถป้อนรายละเอียดเพื่อทำการเข้าสู่ระบบเพื่อปลดล็อกฟังก์ชันการซื้อยาและประวัติทั้งหมดได้ทันที
          </p>
        </div>

      </div>
    </div>

    <!-- 8. Premium Cosmic Glassmorphic Logout Confirmation Modal Overlay -->
    <div 
      v-if="showLogoutModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.25s_ease-out]"
      @click.self="showLogoutModal = false"
    >
      <div class="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-800 dark:text-slate-100 flex flex-col items-center text-center z-10 animate-scaleUp font-medium text-xs leading-relaxed">
        
        <!-- Header Backdrop Gradient & Glowing Icon -->
        <div class="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 dark:border-red-500/25 shadow-lg shadow-red-500/5 dark:shadow-red-500/15 mb-4 hover:scale-105 transition-transform duration-300">
          <span class="material-symbols-outlined text-[28px] text-red-500 dark:text-red-400 icon-fill animate-pulse">logout</span>
        </div>

        <h3 class="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">ยืนยันออกจากระบบ</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-[280px] leading-relaxed">
          คุณต้องการลงชื่อออกจากระบบการใช้งานและเคลียร์ประวัติสุขภาพปัจจุบันใช่หรือไม่?
        </p>

        <!-- Warning contextual banner -->
        <div class="mt-4 w-full bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/15 text-red-700 dark:text-red-200 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 text-[10px] text-left leading-relaxed">
          <span class="material-symbols-outlined shrink-0 text-[14px] text-red-500 dark:text-red-400">warning</span>
          <span>หลังจากออกจากระบบแล้ว คุณจำเป็นต้องเข้าสู่ระบบใหม่อีกครั้งเพื่อเข้าถึงระบบคลังยา ประวัติการสั่งซื้อ และห้องแชทหลัก</span>
        </div>

        <!-- Action buttons -->
        <div class="mt-6 w-full flex items-center gap-3">
          <button
            @click="showLogoutModal = false"
            class="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white py-3 rounded-2xl text-xs font-bold border border-slate-200 dark:border-white/10 active:scale-95 transition-all duration-200"
          >
            ยกเลิก
          </button>
          
          <button
            @click="confirmLogout"
            :disabled="isLoggingOut"
            class="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
          >
            <span v-if="isLoggingOut" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span class="material-symbols-outlined text-[15px]" v-else>logout</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

// Configure page layout (public standalone pages - no layout wrappers)
definePageMeta({
  layout: 'default',
})

const { getSession, setSession, clearSession, getDefaultRoute } = useAuth()

// Dynamic session state loaded on client side
const activeSession = ref<any>(null)
const isMobileMenuOpen = ref(false)

const quickChips = [
  { label: 'มีไข้และปวดหัว', icon: '🌡️', query: 'รู้สึกปวดหัวและมีไข้ต่ำๆ มาตั้งแต่เมื่อวาน ตอนนี้เริ่มเจ็บคอด้วย มียาอะไรแนะนำไหมครับ' },
  { label: 'ปวดท้อง ท้องอืด', icon: '🤢', query: 'มีอาการปวดท้อง ท้องอืด แน่นท้องเหมือนอาหารไม่ย่อยหลังจากทานมื้อเย็นครับ' },
  { label: 'คันจมูกและจาม', icon: '🤧', query: 'มีอาการคันจมูก จามบ่อย น้ำมูกไหลใสๆ เวลาอากาศเปลี่ยน มีแนะนำยาแก้แพ้ไหม' },
  { label: 'ปวดเมื่อยกล้ามเนื้อ', icon: '💪', query: 'ปวดตึงกล้ามเนื้อบริเวณบ่าและหลังจากการนั่งทำงานนานๆ มียาทาหรือยากินบรรเทาไหม' }
]

onMounted(() => {
  if (process.client) {
    activeSession.value = getSession()
  }
  handleInputResize()
  scrollToBottom()
})

// ---------------------------------------------------------------------------
// Redirection logic and account management
// ---------------------------------------------------------------------------
const goToDashboard = async () => {
  if (activeSession.value) {
    await navigateTo(getDefaultRoute())
  }
}

const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = async () => {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    clearSession()
    activeSession.value = null
    errorMessage.value = ''
    successMessage.value = ''
  } finally {
    isLoggingOut.value = false
    showLogoutModal.value = false
  }
}

// ---------------------------------------------------------------------------
// Login / Register Modal controllers & forms
// ---------------------------------------------------------------------------
const showAuthModal = ref(false)
const authModalContext = ref('')

const openAuthModal = (mode: 'login' | 'register', contextText = '') => {
  isRegisterMode.value = mode === 'register'
  authModalContext.value = contextText
  errorMessage.value = ''
  successMessage.value = ''
  email.value = ''
  password.value = ''
  regFullName.value = ''
  regPhone.value = ''
  regAge.value = ''
  regGender.value = ''
  regCongenitalDiseases.value = ''
  regDrugAllergies.value = ''
  regWeight.value = ''
  regHeight.value = ''
  regBloodPressure.value = ''
  regHeartRate.value = ''
  showAuthModal.value = true
}

// Authentication reactive fields matching test targets exactly
const isRegisterMode = ref(false)
const role = ref<'pharmacist' | 'patient'>('patient')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

// Alert banners message text state
const errorMessage = ref('')
const successMessage = ref('')

// Patient register input values
const regFullName = ref('')
const regPhone = ref('')
const regAge = ref('')
const regGender = ref('')
const regCongenitalDiseases = ref('')
const regDrugAllergies = ref('')
const regWeight = ref('')
const regHeight = ref('')
const regBloodPressure = ref('')
const regHeartRate = ref('')
const regRole = ref<'patient'>('patient') // Locked to patients (pharmacists created via back-office admin)

const genderOptions = [
  { value: 'male', label: 'ชาย' },
  { value: 'female', label: 'หญิง' },
  { value: 'other', label: 'ไม่ระบุ' },
]

// Switch form mode
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  errorMessage.value = ''
  successMessage.value = ''
  email.value = ''
  password.value = ''
}

// Select role (pharmacist/patient tabs)
const handleRoleChange = (newRole: 'pharmacist' | 'patient') => {
  role.value = newRole
  email.value = ''
  password.value = ''
}

// Submit button triggers corresponding handlers
const handleSubmit = async () => {
  if (isRegisterMode.value) {
    await handleRegister()
  } else {
    await handleLogin()
  }
}

// Signup handler posting to Nuxt Server database APIs
const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch<any>('/api/auth/register', {
      method: 'POST',
      body: {
        fullName: regFullName.value.trim(),
        phone: regPhone.value.trim(),
        age: regAge.value ? parseInt(regAge.value, 10) : null,
        gender: regGender.value || null,
        congenitalDiseases: regCongenitalDiseases.value.trim(),
        drugAllergies: regDrugAllergies.value.trim(),
        weight: regWeight.value.trim(),
        height: regHeight.value.trim(),
        bloodPressure: regBloodPressure.value.trim(),
        heartRate: regHeartRate.value.trim(),
        email: email.value.trim().toLowerCase(),
        password: password.value.trim(),
        role: regRole.value,
      }
    })

    if (response?.success) {
      successMessage.value = 'ลงทะเบียนสำเร็จ! กรุณากรอกรหัสผ่านเพื่อล็อกอินด้านบน'
      
      const registeredEmail = email.value.trim()
      const registeredPassword = password.value.trim()
      
      // Auto prefills data and toggle to login page
      isRegisterMode.value = false
      email.value = registeredEmail
      password.value = registeredPassword
      
      regFullName.value = ''
      regPhone.value = ''
      regAge.value = ''
      regGender.value = ''
      regCongenitalDiseases.value = ''
      regDrugAllergies.value = ''
      regWeight.value = ''
      regHeight.value = ''
      regBloodPressure.value = ''
      regHeartRate.value = ''
    } else {
      errorMessage.value = response?.error || 'การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง'
    }
  } catch (err: any) {
    console.error('Registration query failed:', err)
    errorMessage.value = err.data?.error || 'ไม่สามารถติดต่อฐานข้อมูลเซิร์ฟเวอร์คลาวด์ได้'
  } finally {
    isLoading.value = false
  }
}

// Signin handler checking users credentials and role targets
const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch<any>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value.trim().toLowerCase(),
        password: password.value.trim(),
        role: role.value,
      }
    })

    if (response?.success && response.user) {
      const userData = response.user

      if (!userData.id || !userData.fullName || !userData.email || !userData.role) {
        errorMessage.value = 'ข้อมูลผู้ใช้ไม่ครบถ้วน กรุณาแจ้งผู้ดูแลระบบ'
        return
      }

      if (userData.role !== role.value) {
        errorMessage.value = 'role ไม่ตรงกัน'
        return
      }

      successMessage.value = 'เข้าสู่ระบบเครือข่ายสำเร็จ!'
      
      // Persist session values
      setSession(userData)
      activeSession.value = userData

      // Subtle loading delay for professional feel
      await new Promise((resolve) => setTimeout(resolve, 600))
      showAuthModal.value = false

      // Dynamically redirects to primary dashboards
      await navigateTo(getDefaultRoute())
    } else {
      errorMessage.value = response?.error || 'รหัสผ่านหรืออีเมลแอดเดรสผิดพลาด'
    }
  } catch (err: any) {
    console.error('Database connection login error:', err)
    errorMessage.value = err.data?.error || 'เกิดปัญหาขัดข้องของพอร์ทัลเซิร์ฟเวอร์'
  } finally {
    isLoading.value = false
  }
}

// ---------------------------------------------------------------------------
// Preview AI Consultation Chat widget functions
// ---------------------------------------------------------------------------
const chatContainer = ref<HTMLDivElement | null>(null)
const isTyping = ref(false)
const chatInputText = ref('')

const consultationMessages = ref([
  {
    id: 1,
    role: 'bot',
    content: 'สวัสดีครับ ผมคือผู้ช่วยเภสัชกรอัจฉริยะ (PharmaAI) วันนี้มีอาการไม่สบายตัวตรงไหนต้องการสอบถาม สามารถระบุอาการเบื้องต้นได้เลยครับ เช่น ปวดหัว, ท้องอืด หรือ คันจมูก'
  }
])

const isDefaultWelcome = computed(() => {
  return consultationMessages.value.length === 1 && 
         consultationMessages.value[0].role === 'bot' &&
         consultationMessages.value[0].content.startsWith('สวัสดีครับ ผมคือผู้ช่วยเภสัชกรอัจฉริยะ')
})

const currentSessionTime = computed(() => {
  const d = new Date()
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
})

// Triggered when clicks order medicine from preview recommendations
const handleBuyAction = () => {
  if (activeSession.value) {
    goToDashboard()
  } else {
    openAuthModal('login', 'กรุณาลงชื่อเข้าใช้งานก่อนสั่งซื้อยาและเวชภัณฑ์ เพื่อบันทึกประวัติสุขภาพและชำระบิล PromptPay!')
  }
}

// General warnings for locked options (e.g. photo attachment)
const handleRestrictedFeature = (featureName: string) => {
  if (activeSession.value) {
    goToDashboard()
  } else {
    openAuthModal('login', `กรุณาเข้าสู่ระบบก่อน เพื่อรับสิทธิ์การใช้งานฟังก์ชัน "${featureName}" !`)
  }
}

const sendQuickSymptom = (text: string) => {
  chatInputText.value = text
  sendMessage()
}

const triggerSendOnEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) return
  sendMessage()
}

const resetChat = () => {
  consultationMessages.value = [
    {
      id: 1,
      role: 'bot',
      content: 'สวัสดีครับ ผมคือผู้ช่วยเภสัชกรอัจฉริยะ (PharmaAI) วันนี้มีอาการไม่สบายตัวตรงไหนต้องการสอบถาม สามารถระบุอาการเบื้องต้นได้เลยครับ เช่น ปวดหัว, ท้องอืด หรือ คันจมูก'
    }
  ]
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

// Formatting markdown codes into visually gorgeous HTML elements
const formatBotMessage = (text: string): string => {
  if (!text) return ''
  
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Headers
  formatted = formatted.replace(/^### (.*?)$/gm, '<h4 class="font-bold text-teal-650 dark:text-teal-400 text-xs sm:text-sm mt-3 mb-1.5 flex items-center gap-1"><span class="w-1 h-3 bg-teal-500 rounded-full"></span>$1</h4>')
  formatted = formatted.replace(/^## (.*?)$/gm, '<h3 class="font-extrabold text-teal-650 dark:text-teal-400 text-sm mt-4 mb-2 flex items-center gap-1.5"><span class="w-1.5 h-3.5 bg-teal-500 rounded-full"></span>$1</h3>')
  
  // Bold strings
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-500/10 px-1 py-0.5 rounded border border-teal-200/40 dark:border-teal-500/25">$1</strong>')

  const lines = formatted.split('\n')
  const processedLines = lines.map(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const content = trimmed.substring(1).trim()
      return `<li class="flex items-start gap-1.5 my-1 text-slate-700 dark:text-slate-300 animate-slideIn">
        <span class="text-teal-500 dark:text-teal-450 font-black text-xs shrink-0 select-none">•</span>
        <span class="flex-1">${content}</span>
      </li>`
    }
    return line
  })

  let result = ''
  let inList = false
  
  for (const line of processedLines) {
    if (line.includes('<li')) {
      if (!inList) {
        result += '<ul class="flex flex-col my-1.5 pl-1 gap-0.5">'
        inList = true
      }
      result += line
    } else {
      if (inList) {
        result += '</ul>'
        inList = false
      }
      if (line.trim() !== '') {
        if (line.includes('<h4') || line.includes('<h3')) {
          result += line
        } else {
          result += `<p class="my-1.5 text-slate-700 dark:text-slate-300">${line}</p>`
        }
      } else {
        result += '<div class="h-1.5"></div>'
      }
    }
  }
  
  if (inList) {
    result += '</ul>'
  }
  
  return result
}

// Queries Gemini symptoms API
const sendMessage = async () => {
  if (!chatInputText.value.trim() || isTyping.value) return

  const userText = chatInputText.value.trim()
  chatInputText.value = ''

  consultationMessages.value.push({
    id: Date.now(),
    role: 'user',
    content: userText
  })
  
  scrollToBottom()
  isTyping.value = true

  try {
    const response = await $fetch<any>(`/api/symptoms?q=${encodeURIComponent(userText)}`)
    
    // Smooth natural-looking thinking latency
    await new Promise((resolve) => setTimeout(resolve, 850))

    if (response?.success && response.aiReply) {
      consultationMessages.value.push({
        id: Date.now() + 1,
        role: 'bot',
        content: response.aiReply
      })
    } else {
      consultationMessages.value.push({
        id: Date.now() + 1,
        role: 'bot',
        content: `ผมได้รับข้อมูลอาการ "${userText}" เรียบร้อยแล้วครับ ในแชทพรีวิวนี้แนะนำเบื้องต้นให้พักผ่อน หลีกเลี่ยงปัจจัยกระตุ้นและดื่มน้ำให้เพียงพอ หากต้องการสั่งซื้อยาที่เหมาะสมจากระบบสต็อกคลังกรุณาล็อกอินด้วยบัญชีคนไข้นะครับ`
      })
    }
  } catch (err) {
    console.error('Symptoms API search preview error:', err)
    consultationMessages.value.push({
      id: Date.now() + 1,
      role: 'bot',
      content: 'ขออภัยด้วยครับ ระบบวิเคราะห์อาการขัดข้องชั่วคราว แนะนำให้ประคบอุ่น/เย็นดูแลตัวเองเบื้องต้น หรือล็อกอินเข้าใช้ระบบหลักเพื่อติดต่อแอดมินยาเภสัชกรครับ'
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

// Empty placeholder resize trigger
const handleInputResize = () => {}
</script>

<style scoped>
/* Scroll styling custom overrides */
.scroll-container::-webkit-scrollbar {
  width: 6px;
}
.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(20, 184, 166, 0.2);
  border-radius: 9999px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(20, 184, 166, 0.4);
}

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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 2;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scaleUp {
  animation: scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
