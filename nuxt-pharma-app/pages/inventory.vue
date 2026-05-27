<template>
  <div class="space-y-6" style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- ─── Page Header ───────────────────────────────────────────── -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5 mb-1">
          <span class="material-symbols-outlined text-teal-500 text-[28px] icon-fill">inventory_2</span>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">คลังสินค้าและเวชภัณฑ์</h2>
        </div>
        <p class="text-xs text-slate-400 dark:text-slate-500 ml-9">
          ตรวจสอบระดับสต็อก จัดการวัตถุดิบและยาเวชภัณฑ์ของร้านขายยา PharmaAI
        </p>
      </div>
      
      <!-- Search Input in Header -->
      <div class="relative w-full md:w-80 shrink-0">
        <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหายา หรือรหัส SKU..."
          class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs font-semibold text-slate-800 dark:text-slate-100 transition-all shadow-sm"
        />
      </div>
    </div>

    <!-- ─── Stats Overview Row ────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-11 h-11 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0">
          <span class="material-symbols-outlined text-[22px] icon-fill">inventory_2</span>
        </div>
        <div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">รายการยาทั้งหมด</p>
          <p class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{{ inventoryItems.length }} <span class="text-xs font-medium text-slate-400">รายการ</span></p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-11 h-11 bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0">
          <span class="material-symbols-outlined text-[22px] icon-fill">dangerous</span>
        </div>
        <div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">สต็อกวิกฤต (≤ 5 ชิ้น)</p>
          <p class="text-2xl font-black text-red-600 dark:text-red-400 mt-0.5">{{ criticalStockCount }} <span class="text-xs font-medium text-slate-400">รายการ</span></p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="w-11 h-11 bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0">
          <span class="material-symbols-outlined text-[22px] icon-fill">warning</span>
        </div>
        <div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">สต็อกต่ำ (6-10 ชิ้น)</p>
          <p class="text-2xl font-black text-orange-500 dark:text-orange-400 mt-0.5">{{ warningStockCount }} <span class="text-xs font-medium text-slate-400">รายการ</span></p>
        </div>
      </div>
    </div>

    <!-- ─── Critical Low Stock Panel ─────────────────────────────── -->
    <section v-if="filteredLowStockAlerts.length > 0" class="space-y-3">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">แจ้งเตือนระดับยาเหลือน้อยวิกฤต</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="alert in filteredLowStockAlerts"
          :key="alert.id"
          class="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <!-- Corner glowing background -->
          <div
            class="absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 pointer-events-none opacity-40 transition-transform group-hover:scale-110 duration-300"
            :class="alert.status === 'critical' ? 'bg-red-50 dark:bg-red-950/20' : 'bg-orange-50 dark:bg-orange-950/20'"
          ></div>

          <div class="relative z-10 flex flex-col justify-between h-full">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[24px]">
                    {{ alert.icon === 'pill' ? 'medication' : 'science' }}
                  </span>
                </div>
                <div>
                  <h4 class="text-xs font-black text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{{ alert.name }}</h4>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium leading-relaxed max-w-[200px] sm:max-w-xs truncate">{{ alert.description }}</p>
                </div>
              </div>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black border"
                :class="alert.status === 'critical'
                  ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30'
                  : 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30'"
              >
                <span class="w-1 h-1 rounded-full" :class="alert.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'"></span>
                {{ alert.status === 'critical' ? 'วิกฤต' : 'เตือน' }}
              </span>
            </div>

            <div class="flex items-end justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/60">
              <div>
                <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">คงเหลือในคลัง</p>
                <p class="text-3xl font-black leading-none mt-1" :class="alert.status === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'">
                  {{ alert.stockLevel }}
                  <span class="text-xs font-medium text-slate-400 dark:text-slate-500 ml-1">{{ alert.unit }}</span>
                </p>
              </div>
              <button
                @click="orderReplenishment(alert)"
                class="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white hover:bg-teal-600 dark:hover:bg-teal-600 text-white dark:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-xl text-[10px] font-black transition-all shadow-sm active:scale-95"
              >
                <span class="material-symbols-outlined text-[14px]">local_shipping</span>
                สั่งยาเพิ่มด่วน
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── All Inventory Table ────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">รายการเวชภัณฑ์ทั้งหมดในคลัง</h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">รายการยาและเวชภัณฑ์ทั้งหมดที่ขึ้นทะเบียนในร้านยา</p>
        </div>
        <span class="text-xs text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
          แสดง {{ filteredInventoryItems.length }} จาก {{ inventoryItems.length }} รายการ
        </span>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">เวชภัณฑ์ยา</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">รหัส SKU</th>
              <th class="px-6 py-3.5 text-left text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">สถานะระดับสต็อก</th>
              <th class="px-6 py-3.5 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">ดำเนินการจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <tr
              v-for="item in filteredInventoryItems"
              :key="item.id"
              class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
            >
              <td class="px-6 py-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
                  <img :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{{ item.name }}</p>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-sm font-medium">{{ item.description }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold">{{ item.sku }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2.5">
                  <span class="text-xs font-black text-slate-800 dark:text-white">{{ item.stockLevel }} ชิ้น</span>
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border"
                    :class="[
                      item.stockLevel === 0 ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30' :
                      item.stockLevel <= 10 ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30' :
                                              'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                    ]"
                  >
                    {{ item.stockLevel === 0 ? 'สต็อกหมด' : item.stockLevel <= 10 ? 'สต็อกต่ำ' : 'สต็อกปกติ' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="orderReplenishment(item)"
                    class="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white hover:bg-teal-600 dark:hover:bg-teal-600 text-white dark:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black transition-all shadow-sm active:scale-95"
                  >
                    <span class="material-symbols-outlined text-[13px]">local_shipping</span>
                    สั่งเติมสต็อก
                  </button>
                  <button
                    @click="editProductDetails(item)"
                    class="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 hover:border-teal-400 dark:hover:border-teal-600 px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-sm"
                  >
                    <span class="material-symbols-outlined text-[13px]">edit</span>
                    ปรับปรุงแก้ไข
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile List View -->
      <div class="md:hidden divide-y divide-slate-50 dark:divide-slate-800/50">
        <div
          v-for="item in filteredInventoryItems"
          :key="item.id"
          class="p-5 space-y-3"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
              <img :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover" />
            </div>
            <div>
              <p class="text-xs font-black text-slate-800 dark:text-white">{{ item.name }}</p>
              <p class="text-[9px] font-mono text-slate-400 mt-0.5">SKU: {{ item.sku }}</p>
            </div>
          </div>

          <div class="flex justify-between items-center text-xs pt-1">
            <span class="text-slate-400 dark:text-slate-500 font-bold">ระดับคงเหลือ</span>
            <div class="flex items-center gap-2">
              <span class="font-black text-slate-800 dark:text-white">{{ item.stockLevel }} ชิ้น</span>
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-bold border"
                :class="[
                  item.stockLevel === 0 ? 'bg-red-50 text-red-600 border-red-200' :
                  item.stockLevel <= 10 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                          'bg-emerald-50 text-emerald-600 border-emerald-200'
                ]"
              >
                {{ item.stockLevel === 0 ? 'สต็อกหมด' : item.stockLevel <= 10 ? 'สต็อกต่ำ' : 'สต็อกปกติ' }}
              </span>
            </div>
          </div>

          <div class="flex gap-2 pt-1">
            <button
              @click="orderReplenishment(item)"
              class="w-1/2 justify-center inline-flex items-center gap-1.5 bg-slate-900 dark:bg-white hover:bg-teal-600 dark:hover:bg-teal-600 text-white dark:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl text-[10px] font-black transition-all shadow-sm active:scale-95"
            >
              <span class="material-symbols-outlined text-[13px]">local_shipping</span>
              สั่งเติมสต็อก
            </button>
            <button
              @click="editProductDetails(item)"
              class="w-1/2 justify-center inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 hover:border-teal-400 dark:hover:border-teal-600 px-3.5 py-2 rounded-xl text-[10px] font-black transition-all shadow-sm active:scale-95"
            >
              <span class="material-symbols-outlined text-[13px]">edit</span>
              ปรับปรุงแก้ไข
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredInventoryItems.length === 0" class="flex flex-col items-center py-16 text-slate-400">
        <span class="material-symbols-outlined text-5xl mb-3 opacity-30">inventory_2</span>
        <p class="text-xs font-bold">ไม่พบรายการสินค้าที่ค้นหา</p>
      </div>
    </section>

    <!-- ─── Beautiful Custom Edit Product Details Modal Overlay ─── -->
    <div
      v-if="selectedProductForEdit"
      class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      @click.self="selectedProductForEdit = null"
    >
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh] animate-slideUp"
      >
        <!-- Modal Header with gradient banner -->
        <div class="p-6 pb-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/20 text-teal-700 dark:text-teal-400 relative flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 bg-white dark:bg-slate-850 rounded-2xl flex items-center justify-center shadow-xs">
            <span class="material-symbols-outlined text-[22px] icon-fill text-teal-600 dark:text-teal-400">edit_note</span>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">แก้ไขข้อมูลเวชภัณฑ์</h3>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">ปรับปรุงและแก้ไขรายละเอียดสินค้าในระบบคลัง</p>
          </div>
          
          <!-- Close Button -->
          <button
            @click="selectedProductForEdit = null"
            class="absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-90"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Modal Body Content (Scrollable) -->
        <div class="p-6 space-y-4 overflow-y-auto flex-grow">
          <!-- SKU Readonly -->
          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">รหัส SKU (ไม่สามารถแก้ไขได้)</label>
            <input 
              :value="selectedProductForEdit.sku"
              type="text"
              readonly
              class="w-full bg-slate-100 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-450 font-mono font-bold outline-none cursor-not-allowed"
            />
          </div>

          <!-- Product Name Input -->
          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ชื่อเวชภัณฑ์</label>
            <input 
              v-model="editForm.name"
              type="text"
              required
              class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-3.5 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-400"
              placeholder="ป้อนชื่อและขนาดความแรงของยา"
            />
          </div>

          <!-- Brand & Category Input Group -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">แบรนด์ / ผู้ผลิต</label>
              <input 
                v-model="editForm.brand"
                type="text"
                class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-3.5 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="ชื่อแบรนด์"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">หมวดหมู่</label>
              <input 
                v-model="editForm.category"
                type="text"
                class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-3.5 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="หมวดหมู่เวชภัณฑ์"
              />
            </div>
          </div>

          <!-- Price & Stock Input Group -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ราคาจำหน่าย (฿)</label>
              <input 
                v-model.number="editForm.price"
                type="number"
                min="0"
                class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-3.5 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="ราคา"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">จำนวนคงเหลือในคลัง ({{ editForm.unit }})</label>
              <input 
                v-model.number="editForm.stockLevel"
                type="number"
                min="0"
                class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-3.5 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="สต็อก"
              />
            </div>
          </div>

          <!-- Description Textarea -->
          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">รายละเอียดและสรรพคุณยา</label>
            <textarea 
              v-model="editForm.description"
              rows="3"
              class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl py-2.5 px-3.5 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-teal-500 transition-all resize-none"
              placeholder="กรอกสรรพคุณการรักษาและข้อมูลเวชภัณฑ์เพิ่มเติม..."
            ></textarea>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 shrink-0">
          <button
            @click="selectedProductForEdit = null"
            class="flex-1 bg-white dark:bg-slate-855 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-355 py-3 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-800 transition-all active:scale-95 shadow-3xs"
          >
            ยกเลิก
          </button>
          
          <button
            @click="submitEditProduct"
            class="flex-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white py-3 px-6 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/20 active:scale-95 hover:-translate-y-0.5"
          >
            <span class="material-symbols-outlined text-[16px] icon-fill">save</span>
            <span>บันทึกการแก้ไข</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Beautiful Custom Replenishment Modal Overlay ─── -->
    <div
      v-if="selectedProductForReplenish"
      class="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      @click.self="selectedProductForReplenish = null"
    >
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-250 flex flex-col animate-slideUp"
      >
        <!-- Modal Header with gradient banner -->
        <div class="p-6 pb-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/20 text-teal-700 dark:text-teal-400 relative flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 bg-white dark:bg-slate-850 rounded-2xl flex items-center justify-center shadow-xs">
            <span class="material-symbols-outlined text-[22px] icon-fill text-teal-600 dark:text-teal-400">local_shipping</span>
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">สั่งซื้อเวชภัณฑ์เติมสต็อก</h3>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">เพิ่มจำนวนสินค้าในระบบคลังโดยตรง</p>
          </div>
          
          <!-- Close Button -->
          <button
            @click="selectedProductForReplenish = null"
            class="absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-90"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-6 space-y-5">
          <!-- Product card summary -->
          <div class="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
              <span class="material-symbols-outlined text-slate-400 text-[26px]">medication</span>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-black text-slate-850 dark:text-slate-200 truncate">{{ selectedProductForReplenish.name }}</h4>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">คงเหลือปัจจุบัน: 
                <span class="text-slate-700 dark:text-slate-300 font-black">{{ selectedProductForReplenish.stockLevel || selectedProductForReplenish.stockLevel === 0 ? selectedProductForReplenish.stockLevel : selectedProductForReplenish.stock || 0 }} ชิ้น</span>
              </p>
            </div>
          </div>

          <!-- Quantity selection and stepper -->
          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ระบุจำนวนที่ต้องการสั่งเติม</label>
            <div class="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl p-2">
              <button
                @click="replenishQty > 10 ? replenishQty -= 10 : null"
                :disabled="replenishQty <= 10"
                class="w-10 h-10 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 text-slate-800 dark:text-slate-205 rounded-xl flex items-center justify-center text-sm font-black transition-all border border-slate-100 dark:border-slate-800 shadow-3xs"
              >
                -10
              </button>
              
              <!-- Input field to enter custom number -->
              <input
                v-model.number="replenishQty"
                type="number"
                min="1"
                class="w-24 text-center bg-transparent border-0 outline-none text-base font-black text-slate-850 dark:text-white"
              />
              
              <button
                @click="replenishQty += 10"
                class="w-10 h-10 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-205 rounded-xl flex items-center justify-center text-sm font-black transition-all border border-slate-100 dark:border-slate-800 shadow-3xs"
              >
                +10
              </button>
            </div>
          </div>

          <!-- Quick presets selectors -->
          <div class="space-y-1.5">
            <span class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">เลือกจำนวนแบบด่วน</span>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="preset in [50, 100, 200, 500]"
                :key="preset"
                @click="replenishQty = preset"
                class="py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 border"
                :class="replenishQty === preset 
                  ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-500/25' 
                  : 'bg-white dark:bg-slate-850 text-slate-650 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'"
              >
                +{{ preset }}
              </button>
            </div>
          </div>

          <!-- Total display -->
          <div class="border-t border-slate-150 dark:border-slate-800 pt-4 flex justify-between items-center text-xs">
            <span class="text-slate-450 dark:text-slate-500 font-bold">สต็อกหลังการสั่งเติม:</span>
            <span class="text-slate-800 dark:text-white font-black text-sm">
              {{ ((selectedProductForReplenish.stockLevel || selectedProductForReplenish.stockLevel === 0 ? selectedProductForReplenish.stockLevel : selectedProductForReplenish.stock || 0) + replenishQty).toLocaleString() }} ชิ้น
            </span>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 shrink-0">
          <button
            @click="selectedProductForReplenish = null"
            class="flex-1 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 py-3 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-800 transition-all active:scale-95 shadow-3xs"
          >
            ยกเลิก
          </button>
          
          <button
            @click="submitReplenishment"
            class="flex-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white py-3 px-6 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/20 active:scale-95 hover:-translate-y-0.5"
          >
            <span class="material-symbols-outlined text-[16px] icon-fill">done</span>
            <span>ยืนยันเติมสต็อก</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'admin' })

const { getSession } = useAuth()
const session = ref<ReturnType<typeof getSession> | null>(null)
const inventoryResult = ref<any>({ lowStockAlerts: [], inventoryItems: [] })
const isLoading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')

const getAuthHeaders = () => ({
  'x-user-role': session.value?.role || '',
  'x-user-id': session.value?.id?.toString() || '',
})

const fetchInventoryData = async () => {
  if (!process.client) return
  session.value = getSession()
  if (!session.value) { isLoading.value = false; return }
  try {
    const response = await $fetch<any>('/api/inventory', { method: 'GET', headers: getAuthHeaders() })
    if (response?.success) inventoryResult.value = response
    else errorMessage.value = response?.error || 'ไม่สามารถโหลดข้อมูลคลังสินค้าได้'
  } catch (error: any) {
    errorMessage.value = error.message || 'เกิดข้อผิดพลาด'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchInventoryData)

const lowStockAlerts = computed(() => inventoryResult.value?.lowStockAlerts || [])
const inventoryItems = computed(() => inventoryResult.value?.inventoryItems || [])

// Stats Counts
const criticalStockCount = computed(() => inventoryItems.value.filter((i: any) => i.stockLevel <= 5).length)
const warningStockCount = computed(() => inventoryItems.value.filter((i: any) => i.stockLevel > 5 && i.stockLevel <= 10).length)

// Filters
const filteredLowStockAlerts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return lowStockAlerts.value
  return lowStockAlerts.value.filter((a: any) => a.name.toLowerCase().includes(q))
})

const filteredInventoryItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return inventoryItems.value
  return inventoryItems.value.filter((i: any) =>
    i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
  )
})

// Actions
const selectedProductForReplenish = ref<any | null>(null)
const replenishQty = ref(100)

const orderReplenishment = (item: any) => {
  selectedProductForReplenish.value = item
  replenishQty.value = 100
}

const submitReplenishment = async () => {
  if (!selectedProductForReplenish.value) return
  const item = selectedProductForReplenish.value
  const qty = replenishQty.value
  if (isNaN(qty) || qty <= 0) {
    alert("กรุณากรอกจำนวนที่ถูกต้อง (มากกว่า 0)")
    return
  }

  try {
    const response = await $fetch<any>('/api/products', {
      method: 'PATCH',
      body: {
        productId: item.id,
        stockToAdd: qty
      }
    })
    if (response?.success) {
      alert(`สั่งซื้อและเติมสต็อกยา "${item.name}" จำนวน +${qty} ชิ้น เข้าสู่คลังสินค้าสำเร็จ!`)
      selectedProductForReplenish.value = null
      await fetchInventoryData()
    } else {
      alert(response?.error || 'ไม่สามารถเติมสินค้าได้')
    }
  } catch (err: any) {
    alert(err.message || 'เกิดข้อผิดพลาด')
  }
}

const selectedProductForEdit = ref<any | null>(null)
const editForm = ref({
  name: '',
  brand: '',
  description: '',
  price: 0,
  stockLevel: 0,
  category: '',
  unit: '',
})

const editProductDetails = (item: any) => {
  selectedProductForEdit.value = item
  editForm.value = {
    name: item.name || '',
    brand: item.brand || '',
    description: item.description || '',
    price: item.price || 0,
    stockLevel: item.stockLevel || 0,
    category: item.category || '',
    unit: item.unit || 'ชิ้น',
  }
}

const submitEditProduct = async () => {
  if (!selectedProductForEdit.value) return
  const item = selectedProductForEdit.value

  if (!editForm.value.name.trim()) {
    alert("กรุณากรอกชื่อเวชภัณฑ์")
    return
  }

  try {
    const response = await $fetch<any>('/api/products', {
      method: 'PATCH',
      body: {
        productId: item.id,
        name: editForm.value.name.trim(),
        brand: editForm.value.brand.trim(),
        description: editForm.value.description.trim(),
        price: Number(editForm.value.price),
        stock: Number(editForm.value.stockLevel),
        category: editForm.value.category.trim(),
      }
    })
    if (response?.success) {
      alert(`อัปเดตรายละเอียดเวชภัณฑ์ "${editForm.value.name}" สำเร็จ!`)
      selectedProductForEdit.value = null
      await fetchInventoryData()
    } else {
      alert(response?.error || 'ไม่สามารถแก้ไขข้อมูลได้')
    }
  } catch (err: any) {
    alert(err.message || 'เกิดข้อผิดพลาด')
  }
}
</script>
