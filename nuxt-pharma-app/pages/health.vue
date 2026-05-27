<template>
  <NuxtLayout :name="layoutName">
    <div>
      <!-- Header Section -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary dark:text-emerald-400 text-3xl">medical_information</span>
            โปรไฟล์สุขภาพของฉัน
          </h2>
          <p class="text-xs text-slate-500 mt-1">ข้อมูลทางการแพทย์และบันทึกประวัติการแพ้ยาที่เชื่อมโยงกับ AI เภสัชกร</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Premium edit button -->
          <button 
            @click="toggleEdit"
            class="flex items-center gap-2 px-4 py-2.5 bg-primary dark:bg-emerald-600 hover:bg-primary-container dark:hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-sm hover:shadow active:scale-98 transition-all text-xs"
          >
            <span class="material-symbols-outlined text-[16px] icon-fill">
              {{ isEditing ? 'close' : 'edit_note' }}
            </span>
            <span>{{ isEditing ? 'ยกเลิกการแก้ไข' : 'แก้ไขข้อมูลสุขภาพ' }}</span>
          </button>

          <div class="hidden md:flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-2.5 max-w-xs shadow-2xs">
            <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <span class="material-symbols-outlined icon-fill text-[16px]">verified_user</span>
            </div>
            <div>
              <h3 class="text-[10px] font-black text-slate-855 dark:text-white leading-none">ยืนยันตัวตนแล้ว</h3>
              <p class="text-[9px] text-slate-400 mt-0.5">เชื่อมต่อ Supabase Live</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Scenario B: EDIT PROFILE FORM MODE (Split-screen Form Grid) -->
      <form v-if="isEditing" @submit.prevent="saveProfile" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left Column (lg:col-span-7 xl:col-span-8): Personal & Health Records -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-5">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary dark:text-emerald-400">person</span>
              ประวัติส่วนตัวและโรคประจำตัว
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Name Input -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ชื่อ-นามสกุลจริง</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">person</span>
                  <input 
                    v-model="editFullName"
                    type="text"
                    required
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                    placeholder="กรอกชื่อและนามสกุล"
                  />
                </div>
              </div>

              <!-- Phone Input -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">เบอร์โทรศัพท์ติดต่อ</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">phone</span>
                  <input 
                    v-model="editPhone"
                    type="tel"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>
              </div>

              <!-- Age Input -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">อายุ (ปี)</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">cake</span>
                  <input 
                    v-model="editAge"
                    type="number"
                    min="1"
                    max="120"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                    placeholder="เช่น 35"
                  />
                </div>
              </div>

              <!-- Gender Selector -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">เพศ</label>
                <div class="flex gap-2">
                  <button
                    v-for="g in genderOptions"
                    :key="g.value"
                    type="button"
                    @click="editGender = g.value"
                    class="flex-1 py-3 rounded-xl text-[10px] font-bold transition-all border flex items-center justify-center gap-1"
                    :class="editGender === g.value
                      ? 'bg-primary/10 dark:bg-emerald-950/40 border-primary/40 dark:border-emerald-500/40 text-primary dark:text-emerald-400'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'"
                  >
                    <span class="material-symbols-outlined text-[13px]">{{ g.icon }}</span>
                    {{ g.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-4 pt-2">
              <!-- Congenital Diseases -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">โรคประจำตัว (คั่นด้วยเครื่องหมายจุลภาค `,` เช่น เบาหวาน, ความดันสูง)</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">clinical_notes</span>
                  <input 
                    v-model="editCongenitalDiseases"
                    type="text"
                    placeholder="ป้อนโรคประจำตัวของคุณ"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              <!-- Drug Allergies -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ประวัติการแพ้ยา (คั่นด้วยเครื่องหมายจุลภาค `,` เช่น พาราเซตามอล, เพนิซิลลิน)</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">vaccines</span>
                  <input 
                    v-model="editDrugAllergies"
                    type="text"
                    placeholder="ป้อนรายการแพ้ยาในระบบ"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-3 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scenario B Right Column: Vital Inputs, Med Planner & Actions -->
        <div class="lg:col-span-5 xl:col-span-4 space-y-6">
          
          <!-- Vital Inputs Card -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-4">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary dark:text-emerald-400">monitoring</span>
              ข้อมูลสรีระทางการแพทย์
            </h3>

            <div class="grid grid-cols-2 gap-4">
              <!-- Weight -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">น้ำหนัก (กก.)</label>
                <input 
                  v-model="editWeight"
                  type="text"
                  placeholder="เช่น 58"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                />
              </div>

              <!-- Height -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ส่วนสูง (ซม.)</label>
                <input 
                  v-model="editHeight"
                  type="text"
                  placeholder="เช่น 165"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                />
              </div>

              <!-- BP -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ความดันโลหิต</label>
                <input 
                  v-model="editBloodPressure"
                  type="text"
                  placeholder="120/80"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                />
              </div>

              <!-- Heart Rate -->
              <div class="space-y-1.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">ชีพจร (ครั้ง/นาที)</label>
                <input 
                  v-model="editHeartRate"
                  type="text"
                  placeholder="เช่น 72"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          <!-- Medications List Card -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-4">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary dark:text-emerald-400">pill</span>
              แผนการทานยารักษาโรค
            </h3>
            
            <div class="space-y-3">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">ป้อนรายชื่อยาแต่ละตัวแยกตามบรรทัด คั่นด้วยเครื่องหมาย `•`</label>
              <textarea 
                v-model="editMedications"
                rows="4"
                placeholder="ตัวอย่าง: Atorvastatin 20mg • ทานวันละ 1 เม็ด • 6 เดือน • ทานก่อนนอน"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-primary dark:focus:ring-emerald-500 transition-all placeholder-slate-400 resize-none font-mono"
              ></textarea>
            </div>
            
            <!-- Error Banner -->
            <div v-if="saveError" class="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 p-3.5 rounded-xl text-[11px] leading-relaxed flex items-start gap-2">
              <span class="material-symbols-outlined text-[15px] text-red-500 shrink-0">error</span>
              <span>{{ saveError }}</span>
            </div>

            <!-- Submit triggers -->
            <div class="flex items-center gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-850">
              <button 
                type="submit"
                :disabled="isSaving"
                class="flex-grow bg-primary dark:bg-emerald-600 hover:bg-primary-container dark:hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-3.5 px-4 rounded-2xl shadow-sm hover:shadow text-xs transition-all flex items-center justify-center gap-2"
              >
                <template v-if="isSaving">
                  <svg class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>กำลังบันทึก...</span>
                </template>
                <template v-else>
                  <span class="material-symbols-outlined text-[18px] icon-fill">save</span>
                  <span>บันทึกข้อมูล</span>
                </template>
              </button>

              <button 
                type="button"
                @click="toggleEdit"
                class="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-400 py-3.5 px-4 rounded-2xl text-xs transition-all shrink-0"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </form>

      <!-- Scenario A: READ ONLY DASHBOARD MODE (Balanced Split-screen Layout) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left Column (lg:col-span-7 xl:col-span-8): Vitals & Prescriptions Timeline -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          
          <!-- Vital Indicators Bento Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <!-- Metric 1: Blood Pressure -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-3xs relative overflow-hidden group">
              <div class="absolute -right-4 -top-4 w-14 h-14 bg-red-500/5 rounded-full pointer-events-none transition-transform group-hover:scale-120 duration-300"></div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">ความดันโลหิต</span>
                <span class="material-symbols-outlined text-red-500 text-[18px] icon-fill">favorite</span>
              </div>
              <div class="mb-2">
                <span class="text-2xl font-black text-slate-850 dark:text-white leading-none">{{ displayBloodPressure }}</span>
                <span class="text-[10px] text-slate-400 font-bold ml-1">mmHg</span>
              </div>
              <span class="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 border border-emerald-250/20 rounded-full text-[9px] font-bold">ปกติ</span>
            </div>

            <!-- Metric 2: Heart Rate -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-3xs relative overflow-hidden group">
              <div class="absolute -right-4 -top-4 w-14 h-14 bg-primary/5 rounded-full pointer-events-none transition-transform group-hover:scale-120 duration-300"></div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">ชีพจร</span>
                <span class="material-symbols-outlined text-primary dark:text-emerald-400 text-[18px]">pulse_meter</span>
              </div>
              <div class="mb-2">
                <span class="text-2xl font-black text-slate-850 dark:text-white leading-none">{{ displayHeartRate }}</span>
                <span class="text-[10px] text-slate-400 font-bold ml-1">ครั้ง/นาที</span>
              </div>
              <span class="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 border border-emerald-250/20 rounded-full text-[9px] font-bold">ปกติ</span>
            </div>

            <!-- Metric 3: BMI Calculation -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-3xs relative overflow-hidden group">
              <div class="absolute -right-4 -top-4 w-14 h-14 bg-blue-500/5 rounded-full pointer-events-none transition-transform group-hover:scale-120 duration-300"></div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">ดัชนีมวลกาย BMI</span>
                <span class="material-symbols-outlined text-blue-500 text-[18px]">monitoring</span>
              </div>
              <div class="mb-2">
                <span class="text-2xl font-black text-slate-850 dark:text-white leading-none">{{ bmiValue }}</span>
                <span class="block text-[8px] text-slate-400 mt-1 font-bold">สัดส่วน: {{ displayHeight }}ซม. | {{ displayWeight }}กก.</span>
              </div>
              <span class="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 border border-emerald-250/20 rounded-full text-[9px] font-bold">{{ bmiLabel }}</span>
            </div>

          </div>

          <!-- Active Prescriptions and Medicines History Timeline -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-3xs p-5 lg:p-6 space-y-5">
            <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary dark:text-emerald-400 text-[22px] icon-fill">medication</span>
                <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  ยาประจำตัว & แผนการทานยา
                </h3>
              </div>
              <NuxtLink to="/chat" class="text-xs text-primary dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold">
                ปรึกษาเภสัชกร AI 
                <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
              </NuxtLink>
            </div>

            <div v-if="activeMedicines.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
              <div 
                v-for="pill in activeMedicines" 
                :key="pill.name" 
                class="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div class="flex items-start gap-4">
                  <div class="w-11 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-primary dark:text-emerald-400 text-[20px] icon-fill">prescriptions</span>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-slate-800 dark:text-slate-250 leading-snug">{{ pill.name }}</h4>
                    <p class="text-[10px] text-slate-400 mt-0.5 font-semibold">{{ pill.dosage }} • ทานต่อเนื่อง {{ pill.duration }}</p>
                    <span class="inline-flex items-center gap-1.5 text-[9px] font-bold bg-primary/5 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-primary/10 mt-1.5">
                      <span class="material-symbols-outlined text-[11px] icon-fill">schedule</span>
                      {{ pill.timing }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-3 py-1 rounded-xl">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span class="text-[10px] font-bold text-slate-450">อยู่ระหว่างรักษา</span>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-10 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <span class="material-symbols-outlined text-[32px] text-slate-300 dark:text-slate-700">medical_services</span>
              <p class="text-xs text-slate-400 mt-2">ยังไม่มีประวัติแผนจัดเตรียมยาประจำตัว หรือการจัดชุดจ่ายยาระดับคลังลงทะเบียนไว้ในระบบ</p>
            </div>
          </div>

        </div>

        <!-- Right Column (lg:col-span-5 xl:col-span-4): Personal Profile & Health Warnings -->
        <div class="lg:col-span-5 xl:col-span-4 space-y-6">
          
          <!-- 1. Personal Identity Profile Card -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xs space-y-5">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary dark:text-emerald-400">badge</span>
              ข้อมูลส่วนบุคคล
            </h3>
            
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full overflow-hidden bg-primary/10 dark:bg-emerald-950/40 flex-shrink-0 border-2 border-primary/50 dark:border-emerald-500/50 shadow-sm flex items-center justify-center">
                <span class="material-symbols-outlined text-primary dark:text-emerald-400 text-3xl">person</span>
              </div>
              <div>
                <h4 class="text-xs font-black text-slate-850 dark:text-white leading-tight">
                  {{ session?.fullName || 'ผู้ใช้งาน' }}
                </h4>
                <span class="inline-block bg-primary/5 dark:bg-emerald-950/40 text-primary dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider border border-primary/10 dark:border-emerald-500/10 mt-1">
                  {{ session?.role === 'pharmacist' ? 'เภสัชกร' : 'ผู้ป่วย' }}
                </span>
              </div>
            </div>

            <div class="space-y-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-850">
              <!-- Age + Gender side-by-side -->
              <div class="flex gap-2">
                <div class="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl px-3 py-2.5">
                  <span class="material-symbols-outlined text-slate-400 text-[15px]">cake</span>
                  <div>
                    <p class="text-[9px] text-slate-400 uppercase tracking-wider font-bold">อายุ</p>
                    <p class="font-black text-slate-850 dark:text-white">
                      {{ session?.age ? session.age + ' ปี' : 'ไม่ระบุ' }}
                    </p>
                  </div>
                </div>
                <div class="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl px-3 py-2.5">
                  <span class="material-symbols-outlined text-slate-400 text-[15px]">{{ genderIcon(session?.gender) }}</span>
                  <div>
                    <p class="text-[9px] text-slate-400 uppercase tracking-wider font-bold">เพศ</p>
                    <p class="font-black text-slate-850 dark:text-white">{{ genderLabel(session?.gender) }}</p>
                  </div>
                </div>
              </div>

              <div class="flex justify-between text-slate-500">
                <span>เบอร์โทรศัพท์</span>
                <span class="font-bold text-slate-850 dark:text-slate-200">{{ session?.phone || 'ไม่ระบุ' }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>อีเมลระบบ</span>
                <span class="font-bold text-slate-855 dark:text-slate-200">{{ session?.email }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>การเชื่อมโยงข้อมูล</span>
                <span class="text-emerald-500 font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] icon-fill">cloud_done</span>
                  เสถียร (Live DB)
                </span>
              </div>
            </div>
          </div>

          <!-- 2. Drug Allergies & Safety Guardrails Card -->
          <div class="bg-red-500/5 dark:bg-red-950/10 border border-red-500/20 rounded-3xl p-5 lg:p-6 shadow-xs space-y-4">
            <h3 class="text-sm font-black text-red-650 dark:text-red-400 border-b border-red-500/15 pb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] icon-fill text-red-500">warning_amber</span>
              ข้อควรระวังและแพ้ยา
            </h3>

            <p class="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed">
              ระบบปัญญาประดิษฐ์ AI เภสัชกรประมวลผลข้อมูลโรคประจำตัวและบล็อกสั่งซื้อยากลุ่มแพ้ เพื่อความปลอดภัยของคุณโดยอัตโนมัติ
            </p>

            <div class="space-y-4 pt-2">
              <!-- Congenital Diseases Tags -->
              <div class="space-y-1.5">
                <span class="block text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest leading-none">โรคประจำตัว</span>
                <div v-if="congenitalDiseasesList.length > 0" class="flex flex-wrap gap-1.5">
                  <span 
                    v-for="disease in congenitalDiseasesList" 
                    :key="disease"
                    class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 rounded-full text-[10px] font-bold"
                  >
                    {{ disease }}
                  </span>
                </div>
                <p v-else class="text-[10px] text-slate-400 italic">ไม่มีบันทึกข้อมูลโรคประจำตัว</p>
              </div>

              <!-- Drug Allergies Tags -->
              <div class="space-y-1.5">
                <span class="block text-[9px] font-bold text-red-500/80 uppercase tracking-widest leading-none">ประวัติแพ้ยา</span>
                <div v-if="drugAllergiesList.length > 0" class="flex flex-wrap gap-1.5">
                  <span 
                    v-for="allergy in drugAllergiesList" 
                    :key="allergy"
                    class="px-2.5 py-0.5 bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/20 rounded-full text-[10px] font-bold flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    {{ allergy }}
                  </span>
                </div>
                <p v-else class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[13px] icon-fill">check_circle</span>
                  <span>ไม่พบประวัติการแพ้ยา</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false,
})

const { getSession, setSession } = useAuth()
const session = ref(getSession())

if (!session.value && process.client) {
  await navigateTo('/')
}

const layoutName = computed(() => session.value?.role === 'pharmacist' ? 'admin' : 'user')

// Read-only state refs synced to active logged-in session properties
const congenitalDiseases = computed(() => session.value?.congenitalDiseases || '')
const drugAllergies = computed(() => session.value?.drugAllergies || '')
const displayWeight = computed(() => session.value?.weight || '0')
const displayHeight = computed(() => session.value?.height || '0')
const displayBloodPressure = computed(() => session.value?.bloodPressure || '--/--')
const displayHeartRate = computed(() => session.value?.heartRate || '--')
const medications = computed(() => session.value?.medications || '')

// Compute lists
const congenitalDiseasesList = computed(() => {
  const s = congenitalDiseases.value.trim()
  if (!s) return []
  return s.split(',').map(item => item.trim()).filter(item => item.length > 0)
})

const drugAllergiesList = computed(() => {
  const s = drugAllergies.value.trim()
  if (!s) return []
  return s.split(',').map(item => item.trim()).filter(item => item.length > 0)
})

const bmiValue = computed(() => {
  const w = parseFloat(displayWeight.value)
  const h = parseFloat(displayHeight.value)
  if (isNaN(w) || isNaN(h) || h <= 0) return '0.0'
  const bmi = w / Math.pow(h / 100, 2)
  return bmi.toFixed(1)
})

const bmiLabel = computed(() => {
  const bmi = parseFloat(bmiValue.value)
  if (bmi <= 0) return 'ไม่มีข้อมูล'
  if (bmi < 18.5) return 'น้ำหนักน้อย'
  if (bmi >= 18.5 && bmi < 23) return 'สมส่วน'
  if (bmi >= 23 && bmi < 25) return 'น้ำหนักเกิน'
  if (bmi >= 25 && bmi < 30) return 'อ้วน'
  return 'อ้วนมาก'
})

const activeMedicines = computed(() => {
  const raw = medications.value.trim()
  if (!raw) return []
  return raw.split('\n').map(line => {
    const parts = line.split('•').map(p => p.trim())
    return {
      name: parts[0] || 'จัดส่งเวชภัณฑ์ด่วน',
      dosage: parts[1] || 'ทานตามฉลากกำกับ',
      duration: parts[2] || 'จนกว่าจะดีขึ้น',
      timing: parts[3] || 'หลังอาหารทันที',
    }
  }).filter(pill => pill.name.length > 0)
})

// Editing states
const isEditing = ref(false)
const isSaving = ref(false)
const saveError = ref('')

const editFullName = ref('')
const editPhone = ref('')
const editAge = ref<string | number>('')
const editGender = ref('')
const editCongenitalDiseases = ref('')
const editDrugAllergies = ref('')
const editWeight = ref('')
const editHeight = ref('')
const editBloodPressure = ref('')
const editHeartRate = ref('')
const editMedications = ref('')

const genderOptions = [
  { value: 'male', label: 'ชาย', icon: 'man' },
  { value: 'female', label: 'หญิง', icon: 'woman' },
  { value: 'other', label: 'ไม่ระบุ', icon: 'person' },
]

const genderLabel = (g?: string | null) => {
  const map: Record<string, string> = { male: 'ชาย', female: 'หญิง', other: 'ไม่ระบุ' }
  return g ? (map[g] || g) : 'ไม่ระบุ'
}

const genderIcon = (g?: string | null) => {
  const map: Record<string, string> = { male: 'man', female: 'woman', other: 'person' }
  return g ? (map[g] || 'person') : 'person'
}

const toggleEdit = () => {
  if (!isEditing.value) {
    // Fill values from computed read-only state refs
    editFullName.value = session.value?.fullName || ''
    editPhone.value = session.value?.phone || ''
    editAge.value = session.value?.age || ''
    editGender.value = session.value?.gender || ''
    editCongenitalDiseases.value = congenitalDiseases.value
    editDrugAllergies.value = drugAllergies.value
    editWeight.value = displayWeight.value
    editHeight.value = displayHeight.value
    editBloodPressure.value = displayBloodPressure.value
    editHeartRate.value = displayHeartRate.value
    editMedications.value = medications.value
  }
  isEditing.value = !isEditing.value
  saveError.value = ''
}

const saveProfile = async () => {
  saveError.value = ''
  if (!editFullName.value.trim()) {
    saveError.value = 'กรุณากรอกชื่อและนามสกุลจริงของคุณ'
    return
  }

  isSaving.value = true

  try {
    const response = await $fetch<any>('/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        'x-user-role': session.value?.role || 'patient',
        'x-user-id': session.value?.id?.toString() || '',
      },
      body: {
        fullName: editFullName.value,
        phone: editPhone.value,
        age: editAge.value !== '' ? parseInt(String(editAge.value), 10) : null,
        gender: editGender.value || null,
        congenitalDiseases: editCongenitalDiseases.value,
        drugAllergies: editDrugAllergies.value,
        weight: editWeight.value,
        height: editHeight.value,
        bloodPressure: editBloodPressure.value,
        heartRate: editHeartRate.value,
        medications: editMedications.value,
      }
    })

    if (response?.success && response.user) {
      // Sync local state composable session with returned database values
      setSession(response.user)
      session.value = response.user
      
      // Close forms
      isEditing.value = false
    } else {
      saveError.value = response?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองอีกครั้ง'
    }
  } catch (err: any) {
    console.error('Save profile error:', err)
    saveError.value = err.data?.error || 'ไม่สามารถสื่อสารกับระบบฐานข้อมูล Supabase ได้'
  } finally {
    isSaving.value = false
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
