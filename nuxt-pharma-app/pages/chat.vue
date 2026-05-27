<template>
  <NuxtLayout :name="layoutName">
    <div class="flex flex-col h-[calc(100vh-13rem)] md:h-[calc(100vh-10rem)] bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/30 border border-outline-variant/60 rounded-3xl overflow-hidden relative shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all">
      
      <!-- Interactive Toast confirmation banner -->
      <transition 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div 
          v-if="showToast"
          class="absolute top-18 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 border border-emerald-400 text-xs text-center"
        >
          <span class="material-symbols-outlined text-[18px] icon-fill">check_circle</span>
          <span>{{ toastMessage }}</span>
        </div>
      </transition>

      <!-- Decorative Mesh Background elements for WOW effect -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Chat Header -->
      <div class="px-6 py-4 flex items-center justify-between border-b border-outline-variant/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md z-10">
        <div class="flex items-center gap-3.5">
          <!-- Animated AI Status Indicator -->
          <div class="relative flex items-center justify-center">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center shadow-md shadow-primary/20">
              <span class="material-symbols-outlined text-[22px] icon-fill">smart_toy</span>
            </div>
            <!-- Pulsing Online Badge -->
            <span class="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </div>
          <div class="flex flex-col">
            <span class="font-headline-md text-[16px] font-bold text-on-surface leading-tight flex items-center gap-2">
              {{ isAdmin ? 'PharmaAI ผู้ช่วยสนับสนุนแอดมิน' : 'PharmaAI เภสัชกรอัจฉริยะ' }}
            </span>
            <span class="font-label-sm text-[11px] text-on-surface-variant flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {{ isAdmin ? 'พร้อมช่วยเหลือตอบคำถามและแนะนำการใช้ระบบร้านยา' : 'พร้อมให้คำปรึกษาและแนะนำยาในคลัง' }}
            </span>
          </div>
        </div>

        <!-- Shopping Cart button & Reset chat group -->
        <div class="flex items-center gap-2">
          <NuxtLink 
            v-if="!isAdmin"
            to="/checkout"
            class="p-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5 font-bold text-xs shadow-xs"
            title="ดูตะกร้ายาและสั่งซื้อ"
          >
            <span class="material-symbols-outlined text-[18px] icon-fill">shopping_cart</span>
            <span>ตะกร้าของฉัน ({{ cartTotalItems }})</span>
          </NuxtLink>

          <button 
            @click="resetChat"
            class="p-2.5 text-on-surface-variant/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5 font-label-sm text-xs border border-transparent hover:border-red-200/50"
            title="ล้างการสนทนา"
          >
            <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
            <span class="hidden sm:inline">ล้างแชท</span>
          </button>
        </div>
      </div>

      <!-- Chat Messages Area -->
      <div 
        ref="chatContainer"
        class="flex-grow overflow-y-auto chat-scroll px-6 py-6 flex flex-col gap-6 pb-44 relative z-10"
      >
        <!-- Time Separator -->
        <div class="flex justify-center w-full my-1">
          <span class="bg-outline-variant/20 dark:bg-slate-800/80 backdrop-blur-md text-on-surface-variant/80 font-label-sm text-[11px] px-3.5 py-1.5 rounded-full border border-outline-variant/10 shadow-xs">
            ปรึกษาเมื่อ {{ currentSessionTime }}
          </span>
        </div>

        <!-- Welcome Greeting & Quick-consultation Panel -->
        <div 
          v-if="consultationMessages.length === 1 && consultationMessages[0].role === 'bot' && isDefaultWelcome"
          class="flex flex-col gap-6 max-w-2xl mx-auto w-full py-4 animate-[fadeIn_0.4s_ease-out]"
        >
          <!-- Welcome Banner -->
          <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-outline-variant/40 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-center items-center">
            <div class="w-16 h-16 rounded-full bg-primary/10 dark:bg-emerald-900/30 flex items-center justify-center text-primary dark:text-emerald-400">
              <span class="material-symbols-outlined text-[36px] icon-fill">medical_services</span>
            </div>
            <div class="space-y-1">
              <h3 class="font-headline-md text-on-surface font-extrabold text-[18px]">
                {{ isAdmin ? 'ยินดีต้อนรับสู่ผู้ช่วยระบบ PharmaAI' : 'ยินดีต้อนรับสู่ PharmaAI Chat' }}
              </h3>
              <p class="font-body-md text-sm text-on-surface-variant">
                {{ isAdmin ? 'ระบบผู้ช่วยตอบคำถามการใช้งาน แนะนำการจัดการคลัง วิเคราะห์ธุรกรรม และยาหมดอายุ' : 'ระบบแนะนำอาการป่วยและตรวจสอบประวัติผลิตภัณฑ์ยาในคลังสินค้าแบบเรียลไทม์' }}
              </p>
            </div>
            <div class="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/40 to-transparent"></div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full text-left">
              <div class="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-outline-variant/20 flex flex-col gap-1.5">
                <span class="material-symbols-outlined text-[20px] text-primary dark:text-emerald-400">
                  {{ isAdmin ? 'query_stats' : 'health_and_safety' }}
                </span>
                <h4 class="font-label-md font-bold text-xs text-on-surface">
                  {{ isAdmin ? 'ภาพรวมวิเคราะห์ระบบ' : 'วิเคราะห์ตรงจุด' }}
                </h4>
                <p class="font-label-sm text-[11px] text-on-surface-variant leading-relaxed">
                  {{ isAdmin ? 'ช่วยแนะนำแนวทางการวิเคราะห์ยอดขายและการอัปเดตสถิติต่างๆ' : 'ประเมินอาการป่วยเบื้องต้นด้วยระบบ AI วิเคราะห์การดูแลสุขภาพ' }}
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-outline-variant/20 flex flex-col gap-1.5">
                <span class="material-symbols-outlined text-[20px] text-primary dark:text-emerald-400">inventory_2</span>
                <h4 class="font-label-md font-bold text-xs text-on-surface">
                  {{ isAdmin ? 'คู่มือคลังสินค้า' : 'แนะนำยาในคลัง' }}
                </h4>
                <p class="font-label-sm text-[11px] text-on-surface-variant leading-relaxed">
                  {{ isAdmin ? 'แนะนำการตรวจเช็กระดับสต็อกสินค้า การอัปเดต และการสั่งยาเพิ่ม' : 'ค้นหาและแนะนำยาที่มีพร้อมส่งในคลังร้านขายยาโดยตรง' }}
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-outline-variant/20 flex flex-col gap-1.5">
                <span class="material-symbols-outlined text-[20px] text-primary dark:text-emerald-400">
                  {{ isAdmin ? 'receipt_long' : 'warning' }}
                </span>
                <h4 class="font-label-md font-bold text-xs text-on-surface">
                  {{ isAdmin ? 'การจัดการคำสั่งซื้อ' : 'ความปลอดภัยสูง' }}
                </h4>
                <p class="font-label-sm text-[11px] text-on-surface-variant leading-relaxed">
                  {{ isAdmin ? 'ช่วยให้คำตอบเกี่ยวกับการควบคุมบิล อัปเดตการจัดส่ง หรือยกเลิกคำสั่งซื้อ' : 'มีคำแนะนำความปลอดภัยและข้อห้ามอย่างละเอียดทุกครั้ง' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Symptoms Section -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 px-1">
              <span class="w-1.5 h-3.5 bg-primary dark:bg-emerald-500 rounded-full"></span>
              <span class="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {{ isAdmin ? 'เลือกคำถามทั่วไปที่พบบ่อยเกี่ยวกับระบบ' : 'เลือกอาการเพื่อเริ่มสอบถามด่วน' }}
              </span>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="chip in quickChips" 
                :key="chip.label"
                @click="sendQuickSymptom(chip.query)"
                class="px-4 py-2.5 bg-white hover:bg-slate-50 hover:border-primary/50 text-on-surface dark:bg-slate-900 dark:hover:bg-slate-800 border border-outline-variant/40 rounded-full font-body-md text-xs font-medium shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 group hover:shadow-sm"
              >
                <span>{{ chip.icon }}</span>
                <span>{{ chip.label }}</span>
                <span class="material-symbols-outlined text-[14px] text-on-surface-variant/50 group-hover:text-primary dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Messages Loop -->
        <template v-else>
          <div 
            v-for="message in consultationMessages" 
            :key="message.id" 
            class="flex items-start gap-4 max-w-[90%] md:max-w-[78%] animate-[fadeIn_0.25s_ease-out]" 
            :class="message.role === 'user' ? 'self-end flex-row-reverse' : ''"
          >
            <!-- Message Avatar -->
            <div 
              class="w-10 h-10 rounded-2xl flex-shrink-0 shadow-sm border border-outline-variant/40 overflow-hidden flex items-center justify-center transition-all"
              :class="message.role === 'bot' 
                ? 'bg-gradient-to-tr from-primary to-primary-container text-white' 
                : 'bg-white dark:bg-slate-850'"
            >
              <span v-if="message.role === 'bot'" class="material-symbols-outlined text-[20px] icon-fill">smart_toy</span>
              <span v-else class="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[22px]">person</span>
            </div>

            <!-- Message Box content -->
            <div class="flex flex-col gap-1.5" :class="message.role === 'user' ? 'items-end' : ''">
              <!-- Sender Header Details -->
              <div class="flex items-center gap-2 px-1">
                <span class="font-label-sm text-[11px] font-bold text-on-surface-variant">
                  {{ message.role === 'bot' ? (isAdmin ? 'ผู้ช่วยแอดมิน AI' : 'ระบบวิเคราะห์โรค AI') : displayName }}
                </span>
                <span 
                  v-if="message.role === 'bot'" 
                  class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider border border-emerald-200/40 dark:border-emerald-800/40"
                >
                  Verified AI
                </span>
              </div>

              <!-- Main Bubble -->
              <div 
                class="px-5 py-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] font-body-md text-[14px] leading-relaxed transition-all"
                :class="message.role === 'bot' 
                  ? 'bg-white dark:bg-slate-900 border border-outline-variant/40 rounded-3xl rounded-tl-none text-on-surface' 
                  : 'bg-gradient-to-tr from-primary to-primary-container text-white rounded-3xl rounded-tr-none shadow-md shadow-primary/5'"
              >
                <!-- Bot rendered with Markdown styling support -->
                <div v-if="message.role === 'bot'">
                  <div v-html="formatBotMessage(message.content)"></div>
                  
                  <!-- Interactive Related Products Recommendations Cards -->
                  <div 
                    v-if="getMentionedProducts(message.content).length > 0"
                    class="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5"
                  >
                    <p class="text-[11px] font-bold text-primary dark:text-emerald-400 flex items-center gap-1">
                      <span class="material-symbols-outlined text-[15px] icon-fill">medication</span>
                      เวชภัณฑ์ยาในคลังที่เกี่ยวข้อง:
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div 
                        v-for="p in getMentionedProducts(message.content)" 
                        :key="p.id"
                        class="bg-slate-50 dark:bg-slate-950/90 border border-outline-variant/60 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:border-primary/30 dark:hover:border-emerald-500/30 transition-all"
                      >
                        <div>
                          <div class="flex justify-between items-start gap-1">
                            <h5 class="text-xs font-black text-on-surface leading-tight">{{ p.name }}</h5>
                            <span class="text-[9px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">{{ p.brand }}</span>
                          </div>
                          <p class="text-[10px] text-on-surface-variant line-clamp-2 mt-1 leading-normal">{{ p.description }}</p>
                          <div class="flex items-center gap-2 mt-2 text-[10.5px]">
                            <span class="text-primary dark:text-emerald-400 font-bold">฿{{ p.price }}</span>
                            <span class="text-slate-300 dark:text-slate-700">|</span>
                            <span :class="p.stock === 0 ? 'text-red-500 font-bold' : 'text-on-surface-variant/80'">
                              {{ p.stock === 0 ? 'สินค้าหมดคลัง' : `คลังคงเหลือ ${p.stock} ${p.unit}` }}
                            </span>
                          </div>
                        </div>
                        <button 
                          @click="addToCart(p)"
                          :disabled="p.stock === 0"
                          class="mt-3 w-full bg-primary dark:bg-emerald-600 hover:bg-primary-container dark:hover:bg-emerald-500 text-white disabled:bg-slate-200 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-600 font-black py-2 rounded-xl text-[10.5px] transition-all flex items-center justify-center gap-1 active:scale-[0.97]"
                        >
                          <span class="material-symbols-outlined text-[13px] icon-fill">shopping_cart</span>
                          ใส่ตะกร้ายา
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- User standard text -->
                <div v-else class="whitespace-pre-wrap font-medium">{{ message.content }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- Typing Indicator (Simulated) -->
        <div v-if="isTyping" class="flex items-start gap-4 max-w-[90%] md:max-w-[78%] animate-[fadeIn_0.2s_ease-out]">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-outline-variant/40">
            <span class="material-symbols-outlined text-[20px] icon-fill">smart_toy</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 px-1">
              <span class="font-label-sm text-[11px] font-bold text-on-surface-variant">PharmaAI กำลังประมวลผลคำแนะนำ...</span>
            </div>
            <div class="bg-white dark:bg-slate-900 border border-outline-variant/40 rounded-3xl rounded-tl-none px-6 py-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] flex items-center gap-1.5 h-[52px]">
              <div class="w-2 h-2 bg-primary dark:bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-primary dark:bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-primary dark:bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area & Floating Capsule -->
      <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-50 via-slate-50/95 to-slate-50/0 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950/0 px-6 pb-6 pt-2 z-20">
        <div class="max-w-4xl mx-auto w-full">
          <!-- Input Dock Capsule -->
          <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-outline-variant/60 rounded-2xl p-2.5 flex items-end gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:border-primary/50 dark:focus-within:border-emerald-500/50 focus-within:shadow-[0_8px_30px_rgba(0,104,95,0.06)] dark:focus-within:shadow-[0_8px_30px_rgba(16,185,129,0.06)] transition-all duration-300">
            <!-- File Attach Button -->
            <button 
              class="p-3 text-on-surface-variant/60 hover:text-primary dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 flex-shrink-0 active:scale-90"
              title="แนบไฟล์รูปภาพอาการป่วย"
            >
              <span class="material-symbols-outlined text-[22px]">attach_file</span>
            </button>

            <!-- Text Input -->
            <div class="flex-grow relative">
              <textarea
                ref="messageInput"
                class="w-full bg-transparent border-0 focus:ring-0 outline-none resize-none font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/60 min-h-[44px] max-h-[140px] transition-all py-2.5 pr-2 pl-1 leading-normal"
                :placeholder="isAdmin ? 'สอบถามวิธีการใช้งานระบบ หรือเคล็ดลับการบริหาร เช่น \'จัดการคลังสินค้าอย่างไร?\' ' : 'อธิบายอาการป่วย หรือถามหายาของคุณ เช่น \'ปวดหัวมีไข้ต่ำๆ มียาอะไรแนะนำบ้าง?\''"
                rows="1"
                @input="handleInputResize"
                @keydown.enter.exact.prevent="triggerSendOnEnter"
              ></textarea>
            </div>

            <!-- Send Button -->
            <button 
              class="p-3.5 bg-primary dark:bg-emerald-600 text-white rounded-xl hover:bg-primary-container dark:hover:bg-emerald-500 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 flex-shrink-0 h-[46px] w-[46px] flex items-center justify-center active:scale-90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
              @click="sendMessage"
              :disabled="isTyping"
            >
              <span class="material-symbols-outlined text-[20px] icon-fill">send</span>
            </button>
          </div>

          <!-- Bottom Warning / Disclaimer text -->
          <div class="text-center mt-2.5 flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[14px] text-on-surface-variant/60">info</span>
            <span class="font-label-sm text-[10.5px] text-on-surface-variant/65">
              {{ isAdmin ? 'PharmaAI ผู้ช่วยสนับสนุนแอดมิน เพื่อความรวดเร็วและประสิทธิภาพในการควบคุมระบบร้านยา' : 'PharmaAI เป็นผู้ช่วยวิเคราะห์อาการเบื้องต้นเท่านั้น โปรดอ่านคำเตือนและปรึกษาแพทย์หากมีอาการวิกฤต' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { navigateTo } from '#app'

definePageMeta({
  layout: false,
})

const { getSession } = useAuth()
const session = getSession()

if (!session && process.client) {
  await navigateTo('/')
}

const layoutName = computed(() => session?.role === 'pharmacist' ? 'admin' : 'user')
const displayName = computed(() => session?.fullName?.trim() || 'ผู้ใช้งาน')
const isAdmin = computed(() => session?.role === 'pharmacist')

const messageInput = ref<HTMLTextAreaElement | null>(null)
const chatContainer = ref<HTMLDivElement | null>(null)
const isTyping = ref(false)

const consultationMessages = ref([
  {
    id: 1,
    role: 'bot',
    content: session?.role === 'pharmacist'
      ? 'สวัสดีครับเภสัชกร ผมคือผู้ช่วยระบบจัดการอัจฉริยะ (PharmaAI System Assistant) วันนี้ต้องการให้ช่วยเหลือหรือสอบถามการใช้งานระบบในส่วนไหน สามารถระบุรายละเอียดที่ต้องการสอบถามได้เลยครับ เช่น แนะนำการจัดการคลังสินค้า หรือ วิธีจัดการคำสั่งซื้อลูกค้า!'
      : 'สวัสดีครับ ผมคือผู้ช่วยเภสัชกรอัจฉริยะ (PharmaAI) วันนี้มีอาการไม่สบายตัวตรงไหนต้องการสอบถาม สามารถระบุอาการเบื้องต้นได้เลยครับ เช่น ปวดหัว, ท้องอืด หรือ คันจมูก'
  }
])

// Determine if the messages are only the original welcome message
const isDefaultWelcome = computed(() => {
  return consultationMessages.value.length === 1 && 
         consultationMessages.value[0].role === 'bot' &&
         (consultationMessages.value[0].content.startsWith('สวัสดีครับ ผมคือผู้ช่วยเภสัชกรอัจฉริยะ') ||
          consultationMessages.value[0].content.startsWith('สวัสดีครับเภสัชกร ผมคือผู้ช่วยระบบจัดการอัจฉริยะ'))
})

const currentSessionTime = computed(() => {
  const d = new Date()
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
})

const quickChips = computed(() => {
  if (isAdmin.value) {
    return [
      { label: 'จัดการคลังสินค้าอย่างไร?', icon: '📦', query: 'ช่วยแนะนำการจัดการระดับคลังสินค้าและการสั่งซื้อยาเพิ่มด่วนในระบบหน่อยครับ' },
      { label: 'จัดการคำสั่งซื้อลูกค้าอย่างไร?', icon: '💳', query: 'ขั้นตอนการตรวจสอบ ตรวจบิล และอัปเดตสถานะจัดส่งของลูกค้าทำอย่างไร' },
      { label: 'ตรวจสอบยาหมดอายุอย่างไร?', icon: '⏳', query: 'ระบบแจ้งเตือนยาใกล้หมดอายุทำงานอย่างไร มีปุ่มทำอะไรได้บ้าง' },
      { label: 'แดชบอร์ดหลักดูสถิติอะไรได้บ้าง?', icon: '📊', query: 'ช่วยอธิบายข้อมูลและสรุปสถิติต่างๆ ในหน้าแดชบอร์ดหลักให้เข้าใจหน่อย' }
    ]
  }
  return [
    { label: 'มีไข้และปวดหัว', icon: '🌡️', query: 'รู้สึกปวดหัวและมีไข้ต่ำๆ มาตั้งแต่เมื่อวาน ตอนนี้เริ่มเจ็บคอด้วย มียาอะไรแนะนำไหมครับ' },
    { label: 'ปวดท้อง ท้องอืด', icon: '🤢', query: 'มีอาการปวดท้อง ท้องอืด แน่นท้องเหมือนอาหารไม่ย่อยหลังจากทานมื้อเย็นครับ' },
    { label: 'คันจมูกและจาม', icon: '🤧', query: 'มีอาการคันจมูก จามบ่อย น้ำมูกไหลใสๆ เวลาอากาศเปลี่ยน มีแนะนำยาแก้แพ้ไหม' },
    { label: 'ปวดเมื่อยกล้ามเนื้อ', icon: '💪', query: 'ปวดตึงกล้ามเนื้อบริเวณบ่าและหลังจากการนั่งทำงานนานๆ มียาทาหรือยากินบรรเทาไหม' }
  ]
})

const handleInputResize = (): void => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
  }
}

const scrollToBottom = (): void => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

const sendQuickSymptom = (text: string): void => {
  if (messageInput.value) {
    messageInput.value.value = text
    handleInputResize()
    sendMessage()
  }
}

const triggerSendOnEnter = (e: KeyboardEvent): void => {
  if (e.shiftKey) return
  sendMessage()
}

const resetChat = (): void => {
  consultationMessages.value = [
    {
      id: 1,
      role: 'bot',
      content: isAdmin.value
        ? 'สวัสดีครับเภสัชกร ผมคือผู้ช่วยระบบจัดการอัจฉริยะ (PharmaAI System Assistant) วันนี้ต้องการให้ช่วยเหลือหรือสอบถามการใช้งานระบบในส่วนไหน สามารถระบุรายละเอียดที่ต้องการสอบถามได้เลยครับ เช่น แนะนำการจัดการคลังสินค้า หรือ วิธีจัดการคำสั่งซื้อลูกค้า!'
        : 'สวัสดีครับ ผมคือผู้ช่วยเภสัชกรอัจฉริยะ (PharmaAI) วันนี้มีอาการไม่สบายตัวตรงไหนต้องการสอบถาม สามารถระบุอาการเบื้องต้นได้เลยครับ เช่น ปวดหัว, ท้องอืด หรือ คันจมูก'
    }
  ]
  scrollToBottom()
}

const formatBotMessage = (text: string): string => {
  if (!text) return ''
  
  // Basic security escaping
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Render headers
  formatted = formatted.replace(/^### (.*?)$/gm, '<h4 class="font-extrabold text-[15px] text-primary dark:text-emerald-400 mt-4 mb-2">$1</h4>')
  formatted = formatted.replace(/^## (.*?)$/gm, '<h3 class="font-extrabold text-[17px] text-primary dark:text-emerald-400 mt-5 mb-2.5">$1</h3>')
  
  // Render bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary dark:text-emerald-400">$1</strong>')

  const lines = formatted.split('\n')
  const processedLines = lines.map(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const content = trimmed.substring(1).trim()
      return `<li class="flex items-start gap-2 my-1.5 text-on-surface/90 dark:text-slate-200">
        <span class="text-primary dark:text-emerald-400 font-extrabold shrink-0 mt-1">•</span>
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
        result += '<ul class="flex flex-col my-2 gap-0.5">'
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
          result += `<p class="my-2.5 leading-relaxed text-on-surface/95 dark:text-slate-200">${line}</p>`
        }
      } else {
        result += '<div class="h-2"></div>'
      }
    }
  }
  
  if (inList) {
    result += '</ul>'
  }
  
  return result
}

const sendMessage = async (): Promise<void> => {
  if (!messageInput.value || !messageInput.value.value.trim() || isTyping.value) return

  const userText = messageInput.value.value.trim()
  messageInput.value.value = ''
  handleInputResize()

  // 1. Add user message
  consultationMessages.value.push({
    id: Date.now(),
    role: 'user',
    content: userText
  })
  
  scrollToBottom()
  isTyping.value = true

  try {
    // 2. Query symptoms database API with user role headers
    const response = await $fetch<any>(`/api/symptoms?q=${encodeURIComponent(userText)}`, {
      headers: {
        'x-user-role': session?.role || '',
        'x-user-id': session?.id?.toString() || '',
      }
    })
    
    // Artificial thinking timeout for natural conversational delay
    await new Promise((resolve) => setTimeout(resolve, 800))

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
        content: `ผมได้รับข้อมูลอาการ "${userText}" แล้วครับ สำหรับอาการนี้ เบื้องต้นแนะนำหลีกเลี่ยงปัจจัยกระตุ้น ดื่มน้ำอุ่น พักผ่อนให้เพียงพอ หากอาการไม่บรรเทาลง หรือทวีความรุนแรงมากขึ้น แนะนำให้เข้ามาปรึกษาแพทย์หรือเภสัชกรโดยตรงนะครับ`
      })
    }
  } catch (err) {
    console.error('Symptoms API search error:', err)
    consultationMessages.value.push({
      id: Date.now() + 1,
      role: 'bot',
      content: 'ขออภัยด้วยครับ ระบบประมวลผลอาการติดขัดชั่วคราว แนะนำให้พักผ่อนดูแลตัวเองเบื้องต้น หรือปรึกษาแพทย์หากอาการวิกฤตครับ'
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

// ---------------------------------------------------------------------------
// Shopping Cart reactive states & matches
// ---------------------------------------------------------------------------
const cart = ref<any[]>([])
const productsList = ref<any[]>([])

const cartTotalItems = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.qty, 0)
})

const fetchProducts = async () => {
  try {
    const res = await $fetch<any>('/api/products')
    if (res?.success) {
      productsList.value = res.products || []
    }
  } catch (err) {
    console.error('Failed to load products for AI matching:', err)
  }
}

const getMentionedProducts = (messageContent: string) => {
  if (!productsList.value || productsList.value.length === 0) return []
  return productsList.value.filter(p => {
    const nameLower = p.name.toLowerCase()
    const textLower = messageContent.toLowerCase()
    return textLower.includes(nameLower)
  })
}

// Interactive Toast notification controllers
const toastMessage = ref('')
const showToast = ref(false)

const alertToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2200)
}

const addToCart = (product: any) => {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    existing.qty += 1
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      unit: product.unit,
      qty: 1,
      stock: product.stock
    })
  }
  if (process.client) {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }
  alertToast(`เพิ่ม "${product.name}" ลงในตะกร้ายาเรียบร้อยแล้ว!`)
}

onMounted(() => {
  handleInputResize()
  scrollToBottom()
  fetchProducts()
  
  if (process.client) {
    const raw = localStorage.getItem('cart')
    if (raw) {
      try {
        cart.value = JSON.parse(raw)
      } catch (err) {
        cart.value = []
      }
    }
  }
})
</script>

<style scoped>
/* Custom scrollbar for chat area */
.chat-scroll::-webkit-scrollbar {
  width: 6px;
}
.chat-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.chat-scroll::-webkit-scrollbar-thumb {
  background-color: #bcc9c6;
  border-radius: 10px;
}
</style>
