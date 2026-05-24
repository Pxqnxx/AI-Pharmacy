<template>
  <div class="flex flex-col h-[calc(100vh-13rem)] md:h-[calc(100vh-10rem)] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden relative shadow-sm">
    <!-- Chat Header Info -->
    <div class="px-6 py-4 flex items-center justify-center border-b border-outline-variant bg-surface-container-low/50 backdrop-blur-sm z-10">
      <div class="flex flex-col items-center">
        <span class="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-0.5">เซสชันการปรึกษา</span>
        <span class="font-label-md text-label-md text-on-surface font-bold">เชื่อมต่อเภสัชกร AI ปลอดภัย</span>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div class="flex-grow overflow-y-auto chat-scroll px-6 py-6 flex flex-col gap-6 pb-24">
      <!-- Time separator -->
      <div class="flex justify-center w-full my-2">
        <span class="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full">วันนี้, 10:42 AM</span>
      </div>

      <!-- Messages Loop -->
      <div 
        v-for="message in consultationMessages" 
        :key="message.id" 
        class="flex items-start gap-4 max-w-[85%] md:max-w-[70%]" 
        :class="message.role === 'user' ? 'self-end flex-row-reverse' : ''"
      >
        <div 
          class="w-10 h-10 rounded-full flex-shrink-0 shadow-sm border border-outline-variant/30 overflow-hidden flex items-center justify-center"
          :class="message.role === 'bot' ? 'bg-primary text-on-primary' : 'bg-surface-container-highest'"
        >
          <span v-if="message.role === 'bot'" class="material-symbols-outlined text-[20px] icon-fill">medical_services</span>
          <img v-else :alt="`User Avatar`" class="w-full h-full object-cover" :src="userInfo.avatarUrl">
        </div>
        <div class="flex flex-col gap-1" :class="message.role === 'user' ? 'items-end' : ''">
          <span class="font-label-sm text-label-sm text-on-surface-variant ml-1" :class="message.role === 'user' ? 'mr-1' : ''">
            {{ message.role === 'bot' ? 'ผู้ช่วย AI' : userInfo.name }}
          </span>
          <div 
            class="p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-body-md text-body-md whitespace-pre-wrap"
            :class="message.role === 'bot' 
              ? 'bg-surface-container-low border border-outline-variant rounded-2xl rounded-tl-none text-on-surface' 
              : 'bg-primary text-on-primary rounded-2xl rounded-tr-none'"
          >
            {{ message.content }}
          </div>
        </div>
      </div>

      <!-- Typing Indicator (Simulated) -->
      <div v-if="isTyping" class="flex items-start gap-4 max-w-[85%] md:max-w-[70%]">
        <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-outline-variant/30">
          <span class="material-symbols-outlined text-[20px] icon-fill">medical_services</span>
        </div>
        <div class="bg-surface-container-low border border-outline-variant rounded-2xl rounded-tl-none p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 bg-outline-variant rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2.5 h-2.5 bg-outline-variant rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2.5 h-2.5 bg-outline-variant rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="absolute bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.01)] z-20">
      <div class="flex items-end gap-3">
        <button class="p-3 text-tertiary hover:bg-surface-container hover:text-primary rounded-full transition-colors flex-shrink-0 active:scale-95">
          <span class="material-symbols-outlined">attach_file</span>
        </button>
        <div class="flex-grow relative">
          <textarea
            ref="messageInput"
            class="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none font-body-md text-body-md text-on-surface min-h-[52px] max-h-[120px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all"
            placeholder="พิมพ์อาการของคุณที่นี่..."
            rows="1"
            @input="handleInputResize"
          ></textarea>
        </div>
        <button 
          class="p-3 bg-primary text-on-primary rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex-shrink-0 h-[52px] w-[52px] flex items-center justify-center active:scale-95" 
          @click="sendMessage"
        >
          <span class="material-symbols-outlined icon-fill" style="font-variation-settings: 'FILL' 1;">send</span>
        </button>
      </div>
      <div class="text-center mt-2">
        <span class="font-label-sm text-[11px] text-on-surface-variant opacity-75">PharmaAI อาจแสดงข้อมูลที่ไม่ถูกต้องเกี่ยวกับบุคคล สถานที่ หรือข้อเท็จจริง</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
})

const messageInput = ref<HTMLTextAreaElement | null>(null)
const isTyping = ref(false)

const userInfo = {
  name: 'คุณ ณิชชา',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxBLu7zT0jTqNe9TQngx_J3GsfySpVE1lxQOQcyZ26mDVejD0RSPb0PbLj_CmweAklHmXVk6Rq8PySysYwweBHZTpa1gM5nY3MLsyhR2piDo8G5_2CcRKIQvH9mil3m5cuncmBpdlYkKDqXy5uXKzvAMpDT4Q_HYOg3jMsf0h5eaWlNHSbefzMJsW28xyegn8TLNclHVeZWHnfuGh4X6Ut68qMU2Np6osxSQGQoSqqCpz9gcpGwCRwtioxqe5UbNOfItS333ifggY'
}

const consultationMessages = ref([
  {
    id: 1,
    role: 'bot',
    content: 'สวัสดีครับ ผมคือผู้ช่วยเภสัชกรอัจฉริยะ (PharmaAI) วันนี้มีอาการไม่สบายตัวตรงไหนต้องการสอบถาม สามารถระบุอาการเบื้องต้นได้เลยครับ เช่น ปวดหัว, ท้องอืด หรือ คันจมูก'
  }
])

const handleInputResize = (): void => {
  if (messageInput.value) {
    messageInput.value.style.height = '0'
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
  }
}

const sendMessage = async (): Promise<void> => {
  if (!messageInput.value || !messageInput.value.value.trim()) return

  const userText = messageInput.value.value.trim()
  messageInput.value.value = ''
  handleInputResize()

  // 1. Add user message
  consultationMessages.value.push({
    id: Date.now(),
    role: 'user',
    content: userText
  })

  isTyping.value = true

  try {
    // 2. Query symptoms database API (now integrates Gemini API RAG)
    const response = await $fetch<any>(`/api/symptoms?q=${encodeURIComponent(userText)}`)
    
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
  }
}

onMounted(() => {
  handleInputResize()
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

