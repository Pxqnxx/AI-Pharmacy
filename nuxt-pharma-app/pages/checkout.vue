<template>
  <NuxtLayout :name="layoutName">
    <div>
      <!-- Header Section -->
      <div class="mb-8">
        <NuxtLink to="/chat" class="inline-flex items-center gap-1.5 text-primary dark:text-emerald-400 hover:underline text-xs font-semibold mb-2">
          <span class="material-symbols-outlined text-[15px]">arrow_back</span>
          กลับไปคุยกับบอท AI
        </NuxtLink>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">ทำการสั่งซื้อเวชภัณฑ์ยา</h2>
        <p class="text-xs text-slate-500 mt-1">กรุณาตรวจสอบสินค้าในตะกร้าและระบุที่อยู่จัดส่งเพื่อทำการสั่งซื้อยาออนไลน์</p>
      </div>

      <!-- Main Content Canvas (Split scenarios to achieve absolute vertical alignment and visual balance) -->
      <div class="space-y-8">
        
        <!-- Scenario A: Interactive Split-Screen Dashboard (When cart has items) -->
        <div v-if="cart.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left Column (lg:col-span-7 xl:col-span-8): Cart List & Dynamic Products Catalog -->
          <div class="lg:col-span-7 xl:col-span-8 space-y-6">
            
            <!-- 1. Cart Items List Card -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-4">
              <h3 class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span class="material-symbols-outlined text-[18px] text-primary dark:text-emerald-400 icon-fill">shopping_cart</span>
                รายการยาในตะกร้า ({{ cartTotalItems }} รายการ)
              </h3>

              <div class="divide-y divide-slate-100 dark:divide-slate-800">
                <div 
                  v-for="item in cart" 
                  :key="item.id"
                  class="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <!-- Product Details -->
                  <div class="flex-grow min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-black text-slate-850 dark:text-slate-100 leading-snug">{{ item.name }}</span>
                      <span class="text-[9px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider">{{ item.brand }}</span>
                    </div>
                    <p class="text-[10px] text-slate-400 mt-1">ราคาต่อหน่วย: ฿{{ item.price }} / {{ item.unit }}</p>
                  </div>

                  <!-- Quantity Controls + Actions -->
                  <div class="flex items-center gap-4 flex-shrink-0">
                    <div class="flex items-center bg-slate-100 dark:bg-slate-855 border border-slate-200 dark:border-slate-700 rounded-xl p-1 gap-1">
                      <button 
                        @click="updateQty(item, -1)"
                        class="w-7 h-7 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-100 rounded-lg flex items-center justify-center text-xs font-bold active:scale-90 transition-all border border-slate-200/50 dark:border-slate-700"
                      >
                        -
                      </button>
                      <span class="w-8 text-center text-xs font-black text-slate-800 dark:text-slate-100">{{ item.qty }}</span>
                      <button 
                        @click="updateQty(item, 1)"
                        class="w-7 h-7 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-100 rounded-lg flex items-center justify-center text-xs font-bold active:scale-90 transition-all border border-slate-200/50 dark:border-slate-700"
                      >
                        +
                      </button>
                    </div>
                    
                    <!-- Price & Deletion -->
                    <div class="text-right flex flex-col items-end gap-1">
                      <span class="text-xs font-black text-slate-800 dark:text-slate-100">฿{{ (item.price * item.qty).toLocaleString() }}</span>
                      <button 
                        @click="removeItem(item)"
                        class="text-red-500 hover:text-red-400 transition-colors"
                        title="ลบออกจากตะกร้า"
                      >
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Dynamic Product Inventory Selection Grid (Nested on Left Column for Vertical Balance) -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary dark:text-emerald-400 text-[22px]">medical_services</span>
                  <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    เลือกช้อปเวชภัณฑ์ยาเพิ่มลงในตะกร้า
                  </h3>
                </div>
                <!-- Search field -->
                <div class="relative w-full sm:w-64">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">search</span>
                  <input 
                    v-model="searchQuery"
                    type="text"
                    placeholder="ค้นหายา แบรนด์ หรือหมวดหมู่..."
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl py-2.5 pl-9 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              <!-- Category Chips Filter -->
              <div class="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
                <button
                  v-for="cat in availableCategories"
                  :key="cat"
                  @click="selectedCategory = cat"
                  class="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200"
                  :class="selectedCategory === cat 
                    ? 'bg-primary dark:bg-emerald-600 text-white shadow-xs scale-102' 
                    : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'"
                >
                  {{ cat }}
                </button>
              </div>

              <!-- Dynamic Products Grid (2 columns wide inside the Left Column) -->
              <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  v-for="product in filteredProducts" 
                  :key="product.id"
                  @click="openProductDetail(product)"
                  class="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-primary/40 dark:hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xs transition-all bg-white dark:bg-slate-950/20 duration-300 cursor-pointer overflow-hidden group"
                >
                  <!-- Top Illustration Area with Category Backdrop Glow -->
                  <div 
                    class="h-32 w-full flex items-center justify-center bg-gradient-to-br relative transition-all duration-300 group-hover:brightness-102 shrink-0"
                    :class="getProductGradient(product.category)"
                  >
                    <!-- Absolute Category Tag -->
                    <span class="absolute top-2.5 left-2.5 text-[9px] font-black bg-white/95 dark:bg-slate-900/90 shadow-3xs px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800">
                      {{ product.category }}
                    </span>
                    
                    <!-- Ratings Star Badge -->
                    <div class="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-white/95 dark:bg-slate-900/90 shadow-3xs px-1.5 py-0.5 rounded-full border border-slate-100 dark:border-slate-800 text-amber-500">
                      <span class="material-symbols-outlined text-[10px] icon-fill">star</span>
                      <span class="text-[9px] font-black leading-none">{{ product.rating }}</span>
                    </div>
                    
                    <!-- SVG Illustration Holder -->
                    <div v-html="getProductSvg(product.category, product.name)" class="transform group-hover:scale-105 transition-all duration-300"></div>
                  </div>

                  <!-- Product Details and Footer -->
                  <div class="p-4 flex-grow flex flex-col justify-between">
                    <div class="space-y-1">
                      <h4 class="text-xs font-black text-slate-850 dark:text-slate-200 leading-snug group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {{ product.name }}
                      </h4>
                      <p class="text-[10px] text-slate-400 dark:text-slate-450 leading-relaxed line-clamp-2" :title="product.description">
                        {{ product.description }}
                      </p>
                    </div>

                    <div class="mt-3 space-y-2">
                      <!-- Dynamic Stock Gauge -->
                      <div class="space-y-1">
                        <div class="flex justify-between items-center text-[9px] font-bold text-slate-450">
                          <span>คงเหลือในคลัง:</span>
                          <span :class="product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'">
                            {{ product.stock === 0 ? 'หมดสต็อก' : `${product.stock} ${product.unit}` }}
                          </span>
                        </div>
                        <!-- Visual Progress Bar -->
                        <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                          <div 
                            class="h-full rounded-full transition-all duration-500"
                            :class="[
                              product.stock === 0 ? 'bg-transparent' :
                              product.stock <= 5 ? 'bg-red-500' :
                              product.stock <= 20 ? 'bg-orange-400' : 'bg-emerald-500'
                            ]"
                            :style="{ width: Math.min((product.stock / 60) * 100, 100) + '%' }"
                          ></div>
                        </div>
                      </div>

                      <!-- Price & Selection Stepper Action -->
                      <div class="flex items-center justify-between gap-4 pt-2.5 border-t border-slate-100 dark:border-slate-900">
                        <div class="flex flex-col">
                          <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase leading-none mb-0.5">ราคา</span>
                          <span class="text-xs font-black text-primary dark:text-emerald-400">฿{{ product.price }} <span class="text-[9px] font-normal text-slate-400">/ {{ product.unit }}</span></span>
                        </div>
                        <button 
                          @click.stop="addToCart(product)"
                          :disabled="product.stock <= 0"
                          class="flex items-center gap-1.5 px-3 py-1.5 bg-primary dark:bg-emerald-600 hover:bg-primary-container dark:hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-xl text-[10px] active:scale-95 transition-all shadow-2xs"
                        >
                          <span class="material-symbols-outlined text-[12px]">add_shopping_cart</span>
                          <span>{{ product.stock <= 0 ? 'หมด' : 'ใส่ตะกร้า' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center py-8 text-slate-400 text-xs" v-else>
                ไม่พบเวชภัณฑ์ยาที่ตรงกับการค้นหาในระบบคลังสินค้าขณะนี้
              </div>
            </div>

          </div>

          <!-- Right Column (lg:col-span-5 xl:col-span-4): Billing summaries, Recipient Details & Payment selector -->
          <div class="lg:col-span-5 xl:col-span-4 space-y-6">
            
            <!-- 3. Bill Summary Card -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-5">
              <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                สรุปยอดค่าใช้จ่าย
              </h3>

              <div class="space-y-3.5 text-xs">
                <div class="flex justify-between text-slate-500">
                  <span>ยอดเงินยารวมในตะกร้า</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">฿{{ cartPriceSubtotal.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>ค่าธรรมเนียมจัดส่งด่วน</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200">฿{{ shippingFee }}</span>
                </div>
                
                <div class="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-2">
                  <div class="flex justify-between items-center text-slate-900 dark:text-white font-black">
                    <span class="text-sm">ยอดชำระเงินสุทธิ</span>
                    <span class="text-lg text-primary dark:text-emerald-400">฿{{ cartPriceGrandTotal.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <!-- Error panel if incomplete address -->
              <div v-if="localError" class="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 p-3.5 rounded-xl text-[11px] leading-relaxed flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-red-500 shrink-0">error</span>
                <span>{{ localError }}</span>
              </div>

              <!-- Place order button -->
              <button 
                @click="submitOrder"
                :disabled="isSubmitting"
                class="w-full bg-primary dark:bg-emerald-600 hover:bg-primary-container dark:hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-4 px-6 rounded-2xl shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <template v-if="isSubmitting">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>กำลังส่งข้อมูลการชำระบิลค่ายา...</span>
                </template>
                <template v-else>
                  <span class="material-symbols-outlined text-[20px] icon-fill">verified</span>
                  <span>{{ paymentMethod === 'PromptPay' ? 'ยืนยันสั่งซื้อและสแกน PromptPay' : 'ยืนยันสั่งซื้อสินค้าปลายทาง' }}</span>
                </template>
              </button>
            </div>

            <!-- 4. Recipient details & Shipping Address Form -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-4">
              <h3 class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span class="material-symbols-outlined text-[18px] text-primary dark:text-emerald-400 icon-fill">local_shipping</span>
                ข้อมูลที่อยู่และผู้รับสินค้า
              </h3>

              <div class="space-y-4">
                <!-- Name Input -->
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ชื่อ-นามสกุล ผู้รับยา</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">person</span>
                    <input 
                      v-model="customerName"
                      type="text"
                      required
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                      placeholder="ป้อนชื่อและนามสกุลผู้รับ"
                    />
                  </div>
                </div>

                <!-- Phone Input -->
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">เบอร์โทรศัพท์ติดต่อ</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">phone</span>
                    <input 
                      v-model="customerPhone"
                      type="tel"
                      required
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                      placeholder="08X-XXX-XXXX"
                    />
                  </div>
                </div>

                <!-- Address textarea -->
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ที่อยู่จัดส่งยาโดยละเอียด</label>
                  <textarea 
                    v-model="customerAddress"
                    rows="3"
                    required
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400 resize-none"
                    placeholder="กรอกบ้านเลขที่ ถนน ซอย ตำบล อำเภอ จังหวัด และรหัสไปรษณีย์"
                  ></textarea>
                </div>

                <!-- Payment channel selection -->
                <div class="space-y-2.5">
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ช่องทางการชำระเงิน</label>
                  <div class="space-y-2">
                    <label class="border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-2xs" :class="paymentMethod === 'PromptPay' ? 'bg-primary/5 dark:bg-emerald-950/20 border-primary dark:border-emerald-500 text-primary dark:text-emerald-400 font-bold' : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'">
                      <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[20px]">qr_code_2</span>
                        <span class="text-xs">QR PromptPay (ชำระทันที)</span>
                      </div>
                      <input type="radio" v-model="paymentMethod" value="PromptPay" class="text-primary focus:ring-primary" checked />
                    </label>

                    <label class="border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-2xs" :class="paymentMethod === 'COD' ? 'bg-primary/5 dark:bg-emerald-950/20 border-primary dark:border-emerald-500 text-primary dark:text-emerald-400 font-bold' : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'">
                      <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[20px]">local_shipping</span>
                        <span class="text-xs">เก็บเงินปลายทาง (COD)</span>
                      </div>
                      <input type="radio" v-model="paymentMethod" value="COD" class="text-primary focus:ring-primary" />
                    </label>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        <!-- Scenario B: Balanced Info Panel & Wide Catalog Dashboard (When cart is empty) -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left Column (lg:col-span-4): Ultra-Premium Informational Consultation Panel -->
          <div class="lg:col-span-4 bg-gradient-to-br from-primary/5 to-teal-500/10 dark:from-slate-900/40 dark:to-emerald-950/20 border border-slate-200/80 dark:border-slate-850 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[320px] lg:min-h-[460px] shrink-0">
            <div class="space-y-5">
              <div class="w-12 h-12 bg-white dark:bg-slate-900 text-primary dark:text-emerald-400 border border-slate-200/60 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-2xs">
                <span class="material-symbols-outlined text-[26px] icon-fill">medical_information</span>
              </div>
              
              <div class="space-y-2">
                <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  ตะกร้ายาของคุณว่างเปล่า
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  คุณสามารถปรึกษาอาการป่วยกับผู้ช่วยปัญญาประดิษฐ์ AI เภสัชกรของเราเพื่อช่วยจัดยา หรือคลิกค้นหายาที่คลังเวชภัณฑ์โรงพยาบาลทางขวา เพื่อเลือกซื้อและระบุจำนวนยาด้วยตนเองได้ทันที
                </p>
              </div>

              <!-- Bullet guidelines -->
              <ul class="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[14px] text-primary dark:text-emerald-400">check_circle</span>
                  <span>เลือกช้อปยาสามัญประจำบ้านได้เอง</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[14px] text-primary dark:text-emerald-400">check_circle</span>
                  <span>ตรวจสอบคำเตือนเพื่อความปลอดภัยได้ทันที</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[14px] text-primary dark:text-emerald-400">check_circle</span>
                  <span>จำกัดสต็อกตามคลังคงเหลือจริง</span>
                </li>
              </ul>
            </div>
            
            <div class="pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
              <NuxtLink 
                to="/chat"
                class="w-full bg-primary dark:bg-emerald-600 hover:bg-primary-container dark:hover:bg-emerald-500 text-white font-black py-4 px-4 rounded-2xl text-xs shadow-sm hover:shadow active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-[16px] icon-fill">forum</span>
                <span>แชทปรึกษา AI ค้นหายา</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Right Column (lg:col-span-8): Dynamic Selection Catalog (Wide Layout) -->
          <div class="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary dark:text-emerald-400 text-[22px]">medical_services</span>
                <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  เลือกซื้อเวชภัณฑ์ยาในคลังระบบด้วยตนเอง
                </h3>
              </div>
              <!-- Search field -->
              <div class="relative w-full sm:w-72">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">search</span>
                <input 
                  v-model="searchQuery"
                  type="text"
                  placeholder="ค้นหาชื่อยา แบรนด์ หรือหมวดหมู่..."
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl py-2.5 pl-9 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <!-- Category Chips Filter -->
            <div class="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
              <button
                v-for="cat in availableCategories"
                :key="cat"
                @click="selectedCategory = cat"
                class="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200"
                :class="selectedCategory === cat 
                  ? 'bg-primary dark:bg-emerald-600 text-white shadow-xs scale-102' 
                  : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'"
              >
                {{ cat }}
              </button>
            </div>

            <!-- Wide Products Grid (3 columns on lg sizes since it's 8 cols span) -->
            <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="product in filteredProducts" 
                :key="product.id"
                @click="openProductDetail(product)"
                class="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-primary/40 dark:hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xs transition-all bg-white dark:bg-slate-950/20 duration-300 cursor-pointer overflow-hidden group"
              >
                <!-- Top Illustration Area with Category Backdrop Glow -->
                <div 
                  class="h-32 w-full flex items-center justify-center bg-gradient-to-br relative transition-all duration-300 group-hover:brightness-102 shrink-0"
                  :class="getProductGradient(product.category)"
                >
                  <!-- Absolute Category Tag -->
                  <span class="absolute top-2.5 left-2.5 text-[9px] font-black bg-white/95 dark:bg-slate-900/90 shadow-3xs px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800">
                    {{ product.category }}
                  </span>
                  
                  <!-- Ratings Star Badge -->
                  <div class="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-white/95 dark:bg-slate-900/90 shadow-3xs px-1.5 py-0.5 rounded-full border border-slate-100 dark:border-slate-800 text-amber-500">
                    <span class="material-symbols-outlined text-[10px] icon-fill">star</span>
                    <span class="text-[9px] font-black leading-none">{{ product.rating }}</span>
                  </div>
                  
                  <!-- SVG Illustration Holder -->
                  <div v-html="getProductSvg(product.category, product.name)" class="transform group-hover:scale-105 transition-all duration-300"></div>
                </div>

                <!-- Product Details and Footer -->
                <div class="p-4 flex-grow flex flex-col justify-between">
                  <div class="space-y-1">
                    <h4 class="text-xs font-black text-slate-855 dark:text-slate-200 leading-snug group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {{ product.name }}
                    </h4>
                    <p class="text-[10px] text-slate-400 dark:text-slate-455 leading-relaxed line-clamp-2" :title="product.description">
                      {{ product.description }}
                    </p>
                  </div>

                  <div class="mt-3 space-y-2">
                    <!-- Dynamic Stock Gauge -->
                    <div class="space-y-1">
                      <div class="flex justify-between items-center text-[9px] font-bold text-slate-450">
                        <span>คงเหลือในคลัง:</span>
                        <span :class="product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'">
                          {{ product.stock === 0 ? 'หมดสต็อก' : `${product.stock} ${product.unit}` }}
                        </span>
                      </div>
                      <!-- Visual Progress Bar -->
                      <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-500"
                          :class="[
                            product.stock === 0 ? 'bg-transparent' :
                            product.stock <= 5 ? 'bg-red-500' :
                            product.stock <= 20 ? 'bg-orange-400' : 'bg-emerald-500'
                          ]"
                          :style="{ width: Math.min((product.stock / 60) * 100, 100) + '%' }"
                        ></div>
                      </div>
                    </div>

                    <!-- Price & Selection Stepper Action -->
                    <div class="flex items-center justify-between gap-4 pt-2.5 border-t border-slate-100 dark:border-slate-900">
                      <div class="flex flex-col">
                        <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase leading-none mb-0.5">ราคา</span>
                        <span class="text-xs font-black text-primary dark:text-emerald-400">฿{{ product.price }} <span class="text-[9px] font-normal text-slate-400">/ {{ product.unit }}</span></span>
                      </div>
                      <button 
                        @click.stop="addToCart(product)"
                        :disabled="product.stock <= 0"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-primary dark:bg-emerald-600 hover:bg-primary-container dark:hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-xl text-[10px] active:scale-95 transition-all shadow-2xs"
                      >
                        <span class="material-symbols-outlined text-[12px]">add_shopping_cart</span>
                        <span>{{ product.stock <= 0 ? 'หมด' : 'ใส่ตะกร้า' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-center py-8 text-slate-400 text-xs" v-else>
              ไม่พบเวชภัณฑ์ยาที่ตรงกับการค้นหาในระบบคลังสินค้าขณะนี้
            </div>
          </div>

        </div>

        <!-- 4. Interactive Medical Safety & Warnings Detail Modal Overlay -->
        <div 
          v-if="selectedProductForDetail"
          class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity duration-300"
          @click.self="selectedProductForDetail = null"
        >
          <div 
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
          >
            <!-- Modal Header Backdrop Glow -->
            <div class="p-6 pb-4 bg-gradient-to-br relative flex items-center justify-center h-44 shrink-0" :class="getProductGradient(selectedProductForDetail.category)">
              <!-- Close Button -->
              <button 
                @click="selectedProductForDetail = null"
                class="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-90"
              >
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
              
              <div v-html="getProductSvg(selectedProductForDetail.category, selectedProductForDetail.name)" class="transform scale-120 drop-shadow-md"></div>
            </div>

            <!-- Modal Content (Scrollable) -->
            <div class="p-6 space-y-5 overflow-y-auto flex-grow">
              <div>
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span class="text-[9px] font-black uppercase bg-primary/10 dark:bg-emerald-950/30 text-primary dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-primary/10 dark:border-emerald-500/10">
                    {{ selectedProductForDetail.category }}
                  </span>
                  <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    แบรนด์: {{ selectedProductForDetail.brand }}
                  </span>
                </div>
                <h3 class="text-sm font-black text-slate-900 dark:text-white leading-snug">
                  {{ selectedProductForDetail.name }}
                </h3>
                <div class="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  <div class="flex items-center gap-0.5 text-amber-500">
                    <span class="material-symbols-outlined text-[13px] icon-fill">star</span>
                    <span>{{ selectedProductForDetail.rating }} คะแนน</span>
                  </div>
                  <span class="text-slate-200 dark:text-slate-800">•</span>
                  <span>จำหน่ายแล้ว {{ selectedProductForDetail.sold }} ชิ้น</span>
                  <span class="text-slate-200 dark:text-slate-800">•</span>
                  <span>หมดอายุ: {{ selectedProductForDetail.expiryDate }}</span>
                </div>
              </div>

              <!-- Product Description Block -->
              <div class="space-y-1.5">
                <h4 class="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[13px] text-slate-400">description</span>
                  สรรพคุณยาและข้อมูลผลิตภัณฑ์
                </h4>
                <p class="text-xs text-slate-650 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-3 rounded-xl">
                  {{ selectedProductForDetail.description }}
                </p>
              </div>

              <!-- Usage Instructions Block -->
              <div class="space-y-1.5">
                <h4 class="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[13px] text-slate-400">menu_book</span>
                  วิธีการและขนาดการใช้งานยา
                </h4>
                <p class="text-xs text-slate-650 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-3 rounded-xl">
                  {{ selectedProductForDetail.usage }}
                </p>
              </div>

              <!-- Clinical Safety Warnings -->
              <div v-if="selectedProductForDetail.warning && selectedProductForDetail.warning !== '—'" class="space-y-1.5">
                <h4 class="text-[9px] font-black uppercase tracking-wider text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[13px] text-red-500 icon-fill">warning</span>
                  ข้อควรระวังและคำเตือนสำคัญทางการแพทย์
                </h4>
                <div class="bg-red-500/10 border border-red-500/20 text-red-750 dark:text-red-300 p-3.5 rounded-xl text-xs leading-relaxed flex items-start gap-2.5">
                  <span class="material-symbols-outlined text-[16px] text-red-500 shrink-0 mt-0.5 icon-fill">gpp_maybe</span>
                  <span class="font-bold">{{ selectedProductForDetail.warning }}</span>
                </div>
              </div>
            </div>

            <!-- Modal Footer and Stepper controls -->
            <div class="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4 shrink-0">
              <div>
                <span class="block text-[9px] font-bold text-slate-450 uppercase leading-none mb-1">ยอดรวมค่ายา</span>
                <span class="text-sm font-black text-primary dark:text-emerald-400">
                  ฿{{ (selectedProductForDetail.price * modalQty).toLocaleString() }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <!-- Stepper controls -->
                <div class="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-1 gap-1">
                  <button 
                    @click="modalQty > 1 ? modalQty-- : null"
                    :disabled="modalQty <= 1"
                    class="w-8 h-8 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-40 text-slate-855 dark:text-slate-200 rounded-lg flex items-center justify-center text-xs font-bold transition-all border border-slate-100 dark:border-slate-800"
                  >
                    -
                  </button>
                  <span class="w-8 text-center text-xs font-black text-slate-800 dark:text-slate-100">{{ modalQty }}</span>
                  <button 
                    @click="modalQty < selectedProductForDetail.stock ? modalQty++ : alert(`ขออภัย ยาชนิดนี้ในระบบคลังมีสต็อกจำกัดเพียง ${selectedProductForDetail.stock} ชิ้นเท่านั้น`)"
                    :disabled="modalQty >= selectedProductForDetail.stock"
                    class="w-8 h-8 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-40 text-slate-855 dark:text-slate-200 rounded-lg flex items-center justify-center text-xs font-bold transition-all border border-slate-100 dark:border-slate-800"
                  >
                    +
                  </button>
                </div>

                <!-- Add Button -->
                <button 
                  @click="addProductFromModal"
                  :disabled="selectedProductForDetail.stock <= 0"
                  class="bg-primary dark:bg-emerald-600 hover:bg-primary-container dark:hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-3 px-5 rounded-2xl text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                >
                  <span class="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  <span>ยืนยันใส่ตะกร้า</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Floating Toast Feedback Alerts -->
        <div 
          v-if="toastVisible"
          class="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 bg-slate-900/95 dark:bg-slate-955/95 backdrop-blur-xs text-white border border-slate-800/80 rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-6 duration-300 max-w-sm"
        >
          <span class="material-symbols-outlined text-emerald-400 text-[20px] icon-fill">check_circle</span>
          <p class="text-xs font-black tracking-wide pr-2">{{ toastMessage }}</p>
          <button @click="toastVisible = false" class="text-slate-400 hover:text-white transition-colors shrink-0">
            <span class="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>


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
const session = getSession()

if (!session && process.client) {
  await navigateTo('/')
}

const layoutName = computed(() => session?.role === 'pharmacist' ? 'admin' : 'user')

// Cart state loaded from localStorage
const cart = ref<any[]>([])

// Products inventory state
const products = ref<any[]>([])
const searchQuery = ref('')
const selectedCategory = ref('ทั้งหมด')
const selectedProductForDetail = ref<any | null>(null)
const modalQty = ref(1)

const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer: any = null

const showToast = (msg: string) => {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

onMounted(async () => {
  if (process.client) {
    const raw = localStorage.getItem('cart')
    if (raw) {
      try {
        cart.value = JSON.parse(raw)
      } catch (err) {
        cart.value = []
      }
    }
    
    // Load products from inventory database API
    await fetchProducts()

    // Sync cart stock levels and cap quantity if it exceeds DB stock
    if (products.value.length > 0) {
      let cartChanged = false
      cart.value.forEach(item => {
        const dbProd = products.value.find(p => p.id === item.id)
        if (dbProd) {
          if (item.stock !== dbProd.stock) {
            item.stock = dbProd.stock
            cartChanged = true
          }
          if (item.qty > dbProd.stock) {
            item.qty = dbProd.stock
            cartChanged = true
          }
        }
      })
      if (cartChanged) {
        saveCart()
      }
    }
  }
})

const fetchProducts = async () => {
  try {
    const response = await $fetch<any>('/api/products')
    if (response?.success) {
      products.value = response.products || []
    }
  } catch (err) {
    console.error('Failed to load products from database:', err)
  }
}

// Dynamically generate all loaded categories
const availableCategories = computed(() => {
  const cats = products.value.map(p => p.category)
  return ['ทั้งหมด', ...new Set(cats.filter(Boolean))]
})

// Filtered products computed list
const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const cat = selectedCategory.value
  
  let list = products.value
  
  // Category Filter
  if (cat && cat !== 'ทั้งหมด') {
    list = list.filter(p => p.category === cat)
  }
  
  // Search Query Filter
  if (query) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }
  
  return list
})

// Category colors helper for gradient backdrop glows
const getProductGradient = (category: string) => {
  const cat = category || ''
  if (cat.includes('แก้ปวด') || cat.includes('แก้แพ้')) {
    return 'from-emerald-500/10 to-teal-500/20 text-emerald-600 dark:text-emerald-400'
  }
  if (cat.includes('ลดกรด') || cat.includes('ทางเดินอาหาร')) {
    return 'from-indigo-500/10 to-blue-500/20 text-indigo-600 dark:text-indigo-400'
  }
  if (cat.includes('วิตามิน') || cat.includes('อาหารเสริม')) {
    return 'from-amber-500/10 to-orange-500/20 text-amber-600 dark:text-amber-400'
  }
  if (cat.includes('ภายนอก') || cat.includes('ผิว')) {
    return 'from-rose-500/10 to-pink-500/20 text-rose-600 dark:text-pink-400'
  }
  return 'from-cyan-500/10 to-sky-500/20 text-cyan-600 dark:text-cyan-400'
}

// Gorgeous category-specific medical SVG illustrations loaded inline
const getProductSvg = (category: string, name: string) => {
  const cat = category || ''
  const nm = name || ''
  
  // 1. Tablet Blister Pack (for tablets, pills, paracetamol, cetirizine, calcium)
  if (nm.includes('Paracetamol') || nm.includes('Cetirizine') || nm.includes('แคลเซียม') || cat.includes('แก้ปวด') || cat.includes('แก้แพ้')) {
    return `
      <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2050/svg">
        <rect x="8" y="14" width="48" height="36" rx="6" class="fill-slate-50 dark:fill-slate-800 stroke-slate-350 dark:stroke-slate-700" stroke-width="2"/>
        <line x1="8" y1="32" x2="56" y2="32" class="stroke-slate-200 dark:stroke-slate-700" stroke-dasharray="2 2"/>
        <line x1="24" y1="14" x2="24" y2="50" class="stroke-slate-200 dark:stroke-slate-700" stroke-dasharray="2 2"/>
        <line x1="40" y1="14" x2="40" y2="50" class="stroke-slate-200 dark:stroke-slate-700" stroke-dasharray="2 2"/>
        <rect x="13" y="19" width="6" height="8" rx="3" class="fill-emerald-400/80 dark:fill-emerald-500/60 stroke-emerald-500/30" stroke-width="1"/>
        <rect x="29" y="19" width="6" height="8" rx="3" class="fill-emerald-400/80 dark:fill-emerald-500/60 stroke-emerald-500/30" stroke-width="1"/>
        <rect x="45" y="19" width="6" height="8" rx="3" class="fill-emerald-400/80 dark:fill-emerald-500/60 stroke-emerald-500/30" stroke-width="1"/>
        <rect x="13" y="35" width="6" height="8" rx="3" class="fill-emerald-400/80 dark:fill-emerald-500/60 stroke-emerald-500/30" stroke-width="1"/>
        <rect x="29" y="35" width="6" height="8" rx="3" class="fill-emerald-400/80 dark:fill-emerald-500/60 stroke-emerald-500/30" stroke-width="1"/>
        <rect x="45" y="35" width="6" height="8" rx="3" class="fill-emerald-400/80 dark:fill-emerald-500/60 stroke-emerald-500/30" stroke-width="1"/>
      </svg>
    `
  }
  
  // 2. Liquid Syrup Bottle (for antacid mixture, liquid black mixture, stomach mixtures)
  if (nm.includes('น้ำแดง') || nm.includes('น้ำขาว') || nm.includes('น้ำดำ') || cat.includes('ลดกรด') || cat.includes('ยาระบบทางเดินอาหาร')) {
    return `
      <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2050/svg">
        <rect x="27" y="10" width="10" height="8" rx="1" class="fill-slate-400 dark:fill-slate-650 stroke-slate-500" stroke-width="1.5"/>
        <rect x="29" y="6" width="6" height="4" rx="1" class="fill-slate-600 dark:fill-slate-800"/>
        <rect x="18" y="18" width="28" height="38" rx="4" class="fill-blue-500/20 dark:fill-blue-600/30 stroke-blue-500/40" stroke-width="2"/>
        <rect x="20" y="30" width="24" height="24" rx="2" class="fill-indigo-500/40 dark:fill-indigo-400/30"/>
        <rect x="22" y="34" width="20" height="14" rx="1" fill="white" fill-opacity="0.8" class="stroke-slate-350" stroke-width="0.5"/>
        <line x1="25" y1="38" x2="39" y2="38" stroke="#1e293b" stroke-width="1"/>
        <line x1="25" y1="41" x2="35" y2="41" stroke="#475569" stroke-width="0.75"/>
      </svg>
    `
  }
  
  // 3. Ointment Tube (for skin creams, Clotrimazole)
  if (nm.includes('ครีม') || nm.includes('ทา') || cat.includes('ภายนอก') || cat.includes('ผิว')) {
    return `
      <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26 12L38 12L42 48C42 50.2 38 52 32 52C26 52 22 50.2 22 48L26 12Z" class="fill-rose-100 dark:fill-rose-950/40 stroke-rose-450" stroke-width="2"/>
        <rect x="24" y="8" width="16" height="4" rx="1" class="fill-rose-400 stroke-rose-500" stroke-width="0.5"/>
        <rect x="29" y="52" width="6" height="6" rx="1" class="fill-slate-700 dark:fill-slate-300"/>
        <path d="M23.5 28C27 30 37 30 40.5 28L41.3 36C38 38 26 38 22.7 36L23.5 28Z" class="fill-rose-300/60 dark:fill-rose-800/40"/>
      </svg>
    `
  }
  
  // 4. Supplement Vitamin Bottle (for Probiotics, Vitamin C, Vitamin D, Fish Oil)
  if (nm.includes('วิตามิน') || nm.includes('โอเมก้า') || nm.includes('โปรไบโอติกส์') || cat.includes('วิตามิน') || cat.includes('อาหารเสริม')) {
    return `
      <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="24" y="6" width="16" height="6" rx="1" class="fill-amber-500 dark:fill-amber-600 stroke-amber-600" stroke-width="1"/>
        <rect x="18" y="12" width="28" height="44" rx="6" class="fill-amber-700/10 dark:fill-amber-600/20 stroke-amber-500/40" stroke-width="2"/>
        <rect x="20" y="24" width="24" height="22" rx="2" fill="white" fill-opacity="0.9" class="stroke-amber-500/20" stroke-width="1"/>
        <circle cx="32" cy="35" r="6" class="fill-orange-400/80 stroke-orange-500/20" stroke-width="0.5"/>
      </svg>
    `
  }
  
  // 5. Medical Device / Other (for Thermometer, Spray, Bandages, etc.)
  return `
    <svg class="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="16" width="40" height="36" rx="4" class="fill-cyan-500/10 dark:fill-cyan-600/20 stroke-cyan-500/30" stroke-width="2"/>
      <circle cx="32" cy="34" r="9" class="fill-cyan-400/30 dark:fill-cyan-500/20"/>
      <rect x="30" y="29" width="4" height="10" rx="1" fill="#06b6d4"/>
      <rect x="27" y="32" width="10" height="4" rx="1" fill="#06b6d4"/>
    </svg>
  `
}

// Open modal detail card
const openProductDetail = (product: any) => {
  selectedProductForDetail.value = product
  modalQty.value = 1
}

// Increments basket state directly from clinical detail modal
const addProductFromModal = () => {
  if (!selectedProductForDetail.value) return
  const prod = selectedProductForDetail.value
  
  if (prod.stock <= 0) {
    alert('ขออภัย ยาชนิดนี้สินค้าหมดชั่วคราว')
    return
  }
  
  const existing = cart.value.find(item => item.id === prod.id)
  const currentCartQty = existing ? existing.qty : 0
  const requestedTotal = currentCartQty + modalQty.value
  
  if (requestedTotal > prod.stock) {
    const maxAddable = prod.stock - currentCartQty
    if (maxAddable <= 0) {
      alert(`ขออภัย คุณมีผลิตภัณฑ์นี้ในตะกร้าครบตามจำนวนสต็อกสูงสุดแล้ว (${prod.stock} ชิ้น)`)
    } else {
      alert(`ขออภัย ยาชนิดนี้ในระบบคลังมีสต็อกจำกัดรวม ${prod.stock} ชิ้นเท่านั้น (คุณสามารถเพิ่มได้อีกสูงสุด ${maxAddable} ชิ้น)`)
    }
    return
  }
  
  if (existing) {
    existing.qty += modalQty.value
  } else {
    cart.value.push({
      id: prod.id,
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      unit: prod.unit,
      stock: prod.stock,
      qty: modalQty.value
    })
  }
  
  saveCart()
  showToast(`เพิ่ม ${prod.name} จำนวน ${modalQty.value} ${prod.unit} ลงตะกร้าแล้ว!`)
  selectedProductForDetail.value = null
}

// Add product directly to reactive basket state
const addToCart = (product: any) => {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty++
      showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว!`)
    } else {
      alert(`ขออภัย ยาชนิดนี้ในระบบคลังมีสต็อกจำกัดเพียง ${product.stock} ชิ้นเท่านั้น`)
    }
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      qty: 1
    })
    showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว!`)
  }
  saveCart()
}

// Prefills form with patient session credentials
const customerName = ref(session?.fullName || '')
const customerPhone = ref(session?.phone || '')
const customerAddress = ref('')
const paymentMethod = ref<'PromptPay' | 'COD'>('PromptPay')

const shippingFee = ref(50)
const isSubmitting = ref(false)
const localError = ref('')

const cartTotalItems = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.qty, 0)
})

const cartPriceSubtotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0)
})

const cartPriceGrandTotal = computed(() => {
  return cartPriceSubtotal.value + shippingFee.value
})

const updateQty = (item: any, delta: number) => {
  const target = cart.value.find(i => i.id === item.id)
  if (!target) return

  target.qty += delta
  if (target.qty <= 0) {
    removeItem(item)
    return
  }

  // Cap quantity at stock limits
  if (target.qty > target.stock) {
    target.qty = target.stock
    alert(`ขออภัย ยาชนิดนี้ในระบบคลังมีสต็อกจำกัดเพียง ${target.stock} ชิ้นเท่านั้น`)
  }

  saveCart()
}

const removeItem = (item: any) => {
  cart.value = cart.value.filter(i => i.id !== item.id)
  saveCart()
}

const saveCart = () => {
  if (process.client) {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }
}

// Writes transaction to Postgres live database and navigates to pay Simulation
const submitOrder = async () => {
  localError.value = ''

  if (!customerName.value.trim()) {
    localError.value = 'กรุณากรอกชื่อผู้รับสินค้า'
    return
  }
  if (!customerPhone.value.trim()) {
    localError.value = 'กรุณากรอกเบอร์โทรศัพท์สำหรับจัดส่ง'
    return
  }
  if (!customerAddress.value.trim()) {
    localError.value = 'กรุณาระบุที่อยู่จัดส่งโดยละเอียด เพื่ออำนวยความสะดวกในการนำจ่ายยา'
    return
  }

  isSubmitting.value = true
  let redirectUrl = ''

  try {
    const formattedItems = cart.value.map(item => ({
      product_id: item.id,
      qty: item.qty,
      price: item.price
    }))

    const response = await $fetch<any>('/api/orders', {
      method: 'POST',
      headers: {
        'x-user-role': session?.role || '',
        'x-user-id': session?.id?.toString() || '',
      },
      body: {
        customerId: null, // Set to null to prevent foreign key errors if customers table isn't seeded!
        paymentMethod: paymentMethod.value,
        items: formattedItems,
        total: cartPriceGrandTotal.value,
        shippingFee: shippingFee.value,
        shippingAddress: customerAddress.value.trim() || null,
      }
    })

    if (response?.success && response.orderId) {
      const orderTotal = cartPriceGrandTotal.value

      // Clear localStorage cart
      cart.value = []
      saveCart()

      if (paymentMethod.value === 'COD') {
        redirectUrl = `/order-success?orderId=${response.orderId}&total=${orderTotal}&paymentMethod=COD`
      } else {
        redirectUrl = `/qr-promptpay?orderId=${response.orderId}&total=${orderTotal}`
      }
    } else {
      localError.value = response?.error || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองอีกครั้ง'
    }
  } catch (err: any) {
    console.error('Checkout error:', err)
    const errorMsg = typeof err.data?.error === 'string'
      ? err.data.error
      : (err.data?.message || 'เซิร์ฟเวอร์ฐานข้อมูลขัดข้องชั่วคราว ไม่สามารถทำการสั่งสินค้าได้')
    localError.value = errorMsg
  } finally {
    isSubmitting.value = false
  }

  // Navigate outside of try-catch block to prevent catching Nuxt's internal redirect errors!
  if (redirectUrl) {
    await navigateTo(redirectUrl)
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
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
</style>
