<template>
  <div class="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
    <!-- TopAppBar -->
    <header class="bg-surface text-primary font-headline-md text-headline-md docked full-width top-0 border-b border-outline-variant flat no shadows flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 sticky z-40">
      <div class="flex items-center gap-4">
        <button aria-label="Menu" class="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center active:scale-95 transition-transform">
          <span class="material-symbols-outlined" data-icon="menu">menu</span>
        </button>
        <span class="font-headline-md text-headline-md font-bold text-primary">PharmaAI</span>
      </div>
      <button aria-label="Search" class="p-2 -mr-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center active:scale-95 transition-transform">
        <span class="material-symbols-outlined" data-icon="search">search</span>
      </button>
    </header>
    <!-- Main Content Area: Chat & Recommendations -->
    <main class="flex-1 flex flex-col max-w-5xl mx-auto w-full pt-6 pb-40 md:pb-32 px-margin-mobile md:px-margin-desktop gap-8">
      <!-- Chat History Context (Faded/Previous messages placeholder) -->
      <div class="flex flex-col gap-6 opacity-70">
        <!-- User Message -->
        <div class="flex items-start gap-4 self-end max-w-[85%] sm:max-w-2xl">
          <div class="bg-surface-container-high text-on-surface p-4 rounded-2xl rounded-tr-none shadow-sm border border-outline-variant">
            <p class="font-body-md text-body-md">{{ chatMessages[0].content }}</p>
          </div>
        </div>
      </div>
      <!-- Latest AI Interaction -->
      <div class="flex flex-col gap-6">
        <!-- Bot Message -->
        <div class="flex items-start gap-3 max-w-full sm:max-w-[90%] animate-[fadeIn_0.3s_ease-out]">
          <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0 shadow-sm border border-outline-variant">
            <span class="material-symbols-outlined text-on-primary-container" data-icon="robot_2" style="font-variation-settings: 'FILL' 1;">robot_2</span>
          </div>
          <div class="bg-primary text-on-primary p-5 rounded-2xl rounded-tl-none shadow-md">
            <p class="font-body-md text-body-md leading-relaxed">
              {{ chatMessages[1].content }}
            </p>
          </div>
        </div>
        <!-- Medicine Recommendations Layout (Grid) -->
        <div class="pl-14">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Medicine Card -->
            <article v-for="medicine in medicines" :key="medicine.id" class="bg-surface-container-lowest shadow-sm rounded-xl border border-outline-variant overflow-hidden flex flex-col transition-shadow hover:shadow-md">
              <!-- Image Container: 1:1 Aspect Ratio -->
              <div class="w-full aspect-square bg-surface-variant relative p-6 flex items-center justify-center">
                <img :alt="medicine.name" class="w-full h-full object-contain drop-shadow-sm mix-blend-multiply" :src="medicine.imageUrl">
                <!-- Status Badge -->
                <div class="absolute top-3 left-3 bg-[#e6f4ea] text-[#137333] px-2 py-1 rounded-full flex items-center gap-1 border border-[#ceead6]">
                  <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                  <span class="font-label-sm text-label-sm">{{ medicine.statusText }}</span>
                </div>
              </div>
              <!-- Content -->
              <div class="p-4 flex flex-col flex-1 gap-1">
                <h3 class="font-headline-md text-headline-md text-on-surface truncate" :title="medicine.name">{{ medicine.name }}</h3>
                <p class="font-label-md text-label-md text-on-surface-variant line-clamp-2 mb-2">{{ medicine.description }}</p>
                <div class="mt-auto flex items-end justify-between pt-2">
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">ราคา</span>
                    <span class="font-headline-md text-headline-md text-primary">{{ medicine.price }}</span>
                  </div>
                </div>
              </div>
              <!-- Action Button Docked -->
              <button class="w-full bg-surface-container hover:bg-primary-container text-primary hover:text-on-primary-container border-t border-outline-variant transition-colors py-4 font-label-md text-label-md flex items-center justify-center gap-2 group">
                <span class="material-symbols-outlined group-hover:scale-110 transition-transform" data-icon="add_shopping_cart">add_shopping_cart</span>
                เพิ่มลงตะกร้า
              </button>
            </article>
          </div>
        </div>
      </div>
    </main>
    <!-- Chat Input Area (Fixed above bottom nav on mobile, absolute bottom on desktop if no nav) -->
    <div class="fixed bottom-[80px] md:bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-outline-variant px-margin-mobile md:px-margin-desktop py-3 z-30 flex justify-center">
      <div class="max-w-3xl w-full flex items-center gap-3">
        <button class="w-12 h-12 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0">
          <span class="material-symbols-outlined text-[28px]" data-icon="add_circle">add_circle</span>
        </button>
        <div class="flex-1 bg-surface-container-lowest border border-outline-variant rounded-full flex items-center px-4 h-12 shadow-sm focus-within:ring-2 focus-within:ring-secondary focus-within:border-secondary transition-all">
          <input class="w-full bg-transparent border-none focus:ring-0 p-0 font-body-md text-on-surface placeholder:text-on-surface-variant h-full outline-none" placeholder="พิมพ์ข้อความของคุณที่นี่..." type="text">
        </div>
        <button class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm transition-colors shrink-0 active:scale-95">
          <span class="material-symbols-outlined" data-icon="send" style="font-variation-settings: 'FILL' 1;">send</span>
        </button>
      </div>
    </div>
    <!-- BottomNavBar (Mobile Only as per destination rule for mobile view) -->
    <nav class="md:hidden bg-surface-container-lowest text-primary font-label-sm text-label-sm docked full-width bottom-0 rounded-t-xl shadow-md fixed w-full z-50 flex justify-around items-center h-20 px-4 pb-2">
      <!-- Active Tab: Chat -->
      <button class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-all duration-200 w-16 h-12 group">
        <span class="material-symbols-outlined text-[24px]" data-icon="chat_bubble" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
        <span class="font-label-sm text-label-sm mt-1">แชท</span>
      </button>
      <!-- Inactive Tab: Orders -->
      <button class="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:rounded-xl active:scale-90 transition-all duration-200 w-16 h-12 px-2 py-1">
        <span class="material-symbols-outlined text-[24px]" data-icon="local_shipping">local_shipping</span>
        <span class="font-label-sm text-label-sm mt-1">คำสั่งซื้อ</span>
      </button>
      <!-- Inactive Tab: Health -->
      <button class="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:rounded-xl active:scale-90 transition-all duration-200 w-16 h-12 px-2 py-1">
        <span class="material-symbols-outlined text-[24px]" data-icon="person">person</span>
        <span class="font-label-sm text-label-sm mt-1">สุขภาพ</span>
      </button>
      <!-- Inactive Tab: Settings -->
      <button class="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:rounded-xl active:scale-90 transition-all duration-200 w-16 h-12 px-2 py-1">
        <span class="material-symbols-outlined text-[24px]" data-icon="settings">settings</span>
        <span class="font-label-sm text-label-sm mt-1">ตั้งค่า</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
const chatMessages = [
  {
    id: '1',
    role: 'user',
    content: 'สวัสดีครับ รู้สึกปวดหัวและมีไข้ต่ำๆ มาตั้งแต่เมื่อวาน ตอนนี้เริ่มเจ็บคอด้วย มียาอะไรแนะนำไหมครับ?',
  },
  {
    id: '2',
    role: 'bot',
    content: 'จากการวิเคราะห์เบื้องต้น คุณอาจจะมีอาการไข้หวัด แนะนำให้ทานยาลดไข้และพักผ่อนครับ นี่คือยาที่แนะนำ:',
  },
]

const medicines = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever & fever reducer. Take 1-2 tablets every 4-6 hours.',
    price: '25 บาท',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC68tT_iwN9t_30gMy00UFEYWTQMrAgOVt_dC9k9hMM3w3e0QaAiNeLRnQoqfhg6EhZ99m6fDekHibR0qdXcxhThr_stNsEI0boaVgErgASK23BvrXbFUJ7NUZiluE0iDKJghIxVV0heK_UIgB9jbaZk0Siq4j3xXOUdJqH5XhyIcNlkDutka1sUmgt-DLpFo_ayLQeYLVb9B6S_-eYfmRNtAH5JLxxE1iW-47bsEbx3HXEj-3a7Ly58bMV4U9ttk_QUp8liD0Mqz0',
    status: 'in-stock',
    statusText: 'มีสินค้า',
  },
  {
    id: '2',
    name: 'Throat Lozenges',
    description: 'Relieves sore throat and cough. Dissolve 1 lozenge slowly in mouth.',
    price: '45 บาท',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUdfVljFJ01VpnKbGKtZKC_VHBEiN4lsEXqI9I7XTvoSaeOWBeiBnsHrmknAnm3fQz_z3Kvp8iLgWTFy6Sy3LHdAXy2F7wH2SChGgrLwyqdpj-lsn7HX3XFZ5hIQNckXEmitBUHh7K_m_Q7pZjTV5ogY0Z_nCO7vjrdrrd2kLpGldfRLD9jixogdINm4buHNwqb01Z5GmeAleFOF_WwR6PkCnbMur5qsLb53s0Wrt4m4RPE08KOAdSFNngK7oyTEbq3aTq0GgKp7A',
    status: 'in-stock',
    statusText: 'มีสินค้า',
  },
]

definePageMeta({
  layout: 'default',
})
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
/* Custom scrollbar for chat area */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: theme('colors.outline-variant');
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: theme('colors.outline');
}
</style>
