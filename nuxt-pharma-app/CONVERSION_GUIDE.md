# PharmaAI Nuxt 4 Conversion Guide

## Overview

This document provides a complete guide for the converted Nuxt 4 application from HTML + Tailwind to a modern TypeScript Composition API project.

## What Was Converted

### Original Files
- **11 HTML + PNG Components** from `stitch_remix_of_ai_pharmacist_management_system/` folder
- **Tailwind CSS** - All classes preserved exactly as original
- **Material Design 3** - Complete color system and typography

### Converted Components
1. ✅ **dashboard.vue** - Admin dashboard with KPI cards and bar charts
2. ✅ **chat.vue** - AI pharmacist chat interface with message history
3. ✅ **orders.vue** - Order history with filtering and status tracking
4. 📋 **inventory.vue** - Placeholder (skeleton page)
5. 📋 **qr-promptpay.vue** - Placeholder (skeleton page)
6. 📋 **health.vue** - Placeholder (skeleton page)
7. 📋 **settings.vue** - Placeholder (skeleton page)

## Technology Stack

```
Framework:     Nuxt 4
Language:      TypeScript 5.3+
Styling:       Tailwind CSS 3.x
Runtime:       Bun 1.0+
Package Mgr:   Bun
State:         Vue 3 Composition API (Ref, Computed)
Icons:         Google Material Symbols Outlined
```

## Project Structure Explained

```
nuxt-pharma-app/
│
├── pages/                          # Nuxt auto-routed pages
│   ├── index.vue                  # Home/welcome page
│   ├── dashboard.vue              # 📊 Admin dashboard
│   ├── chat.vue                   # 💬 AI chat interface
│   ├── orders.vue                 # 📦 Order history
│   ├── inventory.vue              # 📦 Stock management (skeleton)
│   ├── qr-promptpay.vue          # 💳 Payment (skeleton)
│   ├── health.vue                # 🏥 Health profile (skeleton)
│   └── settings.vue              # ⚙️ Settings (skeleton)
│
├── mock-data/                      # Separated test data
│   ├── dashboard.ts               # KPI cards, charts, nav
│   ├── chat.ts                    # Messages, nav items
│   └── orders.ts                  # Order list, filters
│
├── types/                          # TypeScript definitions
│   └── index.ts                   # All shared interfaces
│
├── components/                     # Reusable components
│   └── (Empty - ready for extraction)
│
├── assets/                         # Static resources
│   └── css/
│       └── tailwind.css           # Global styles
│
├── public/                         # Static files
│
├── nuxt.config.ts                 # Nuxt config
├── tailwind.config.ts             # Tailwind customization
├── tsconfig.json                  # TypeScript settings
├── package.json                   # Dependencies
├── app.vue                        # Root component
├── README.md                      # User guide
└── CONVERSION_GUIDE.md            # This file
```

## Key Conversions

### HTML to Vue Component

**Original HTML:**
```html
<div class="font-headline-md text-headline-md text-on-background">
  45,200 <span class="text-lg text-on-surface-variant">THB</span>
</div>
```

**Converted to Vue:**
```vue
<div class="font-headline-md text-headline-md text-on-background">
  {{ kpi.value }}
  <span v-if="kpi.unit" class="text-lg font-normal text-on-surface-variant">
    {{ kpi.unit }}
  </span>
</div>
```

### Data Structure

**Original:** Hardcoded in HTML
```html
<h3>45,200 THB</h3>
<span>+12% vs last week</span>
```

**Converted:** Type-safe mock data
```typescript
// types/index.ts
export interface KPICard {
  id: string
  label: string
  value: string | number
  unit?: string
  trend?: { percentage: number; direction: 'up' | 'down' }
}

// mock-data/dashboard.ts
export const dashboardData = {
  kpis: [{
    id: 'revenue',
    label: 'รายได้รวม',
    value: '45,200',
    unit: 'THB',
    trend: { percentage: 12, direction: 'up' }
  }]
}
```

### Composition API Usage

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'

// State
const activeTab = ref('all')

// Computed
const filteredOrders = computed(() => {
  return orders.value.filter(o => o.status === activeTab.value)
})

// Methods
const handleTabChange = (tab: string) => {
  activeTab.value = tab
}
</script>
```

## Installation & Setup

### Step 1: Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "$(irm bun.sh/install.ps1)"

# Verify installation
bun --version
```

### Step 2: Clone/Navigate to Project

```bash
cd /Users/pattama/Documents/AI\ Pharmacy\ \&\ Symptom\ Checker\ Dashboard/nuxt-pharma-app
```

### Step 3: Install Dependencies

```bash
# Using Bun (faster than npm)
bun install

# Or if you prefer npm
npm install
```

### Step 4: Start Development Server

```bash
# With Bun
bun run dev

# With npm
npm run dev
```

**Output:**
```
➜ Local:    http://localhost:3000/
➜ Ready in: 450ms
```

### Step 5: Open in Browser

Navigate to: **http://localhost:3000**

## Available Scripts

```bash
# Development
bun run dev

# Production build
bun run build

# Preview production build
bun run preview

# Type checking (if configured)
# bun run type-check
```

## Working with Components

### Creating a New Page

```typescript
// pages/my-page.vue
<template>
  <div class="bg-background text-on-background min-h-screen">
    <h1 class="font-headline-lg text-headline-lg">My Page</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MyType } from '~/types'

definePageMeta({
  layout: 'default',
})

const data = ref<MyType>({})
</script>
```

### Adding Mock Data

```typescript
// mock-data/my-page.ts
import type { MyType } from '~/types'

export const myPageData: MyType = {
  // ... data structure
}
```

### Using in Component

```typescript
<script setup lang="ts">
import { myPageData } from '~/mock-data/my-page'
</script>
```

## Tailwind Customization

### Adding Custom Colors

Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      'my-color': '#000000',
    }
  }
}
```

### Adding Custom Spacing

```typescript
spacing: {
  'my-spacing': '100px',
}
```

### Using Custom Values in Components

```html
<div class="bg-my-color p-my-spacing">
  Content
</div>
```

## TypeScript Tips

### Type All Component Props

```typescript
interface Props {
  title: string
  count: number
  isActive?: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false
})
```

### Type References

```typescript
const inputRef = ref<HTMLInputElement | null>(null)
const itemsRef = ref<InstanceType<typeof MyComponent>[]>([])
```

### Type Events

```typescript
const emit = defineEmits<{
  update: [value: string]
  delete: [id: string]
}>()
```

## Debugging

### Browser DevTools

1. Open DevTools (F12 or Cmd+Opt+I)
2. Go to **Vue** tab
3. Inspect components and state

### Console Logging

```typescript
import { watch } from 'vue'

watch(activeTab, (newVal) => {
  console.log('Tab changed to:', newVal)
})
```

## Performance Tips

### Code Splitting (Automatic)
Nuxt automatically code-splits each page.

### Lazy Components

```typescript
<template>
  <Suspense>
    <HeavyComponent />
  </Suspense>
</template>

<script setup>
const HeavyComponent = defineAsyncComponent(
  () => import('~/components/Heavy.vue')
)
</script>
```

### Image Optimization

Use `<NuxtImg>` component:
```vue
<NuxtImg src="/image.jpg" alt="description" />
```

## Common Issues

### Issue: Port 3000 Already in Use
```bash
# Use different port
bun run dev -- -p 3001
```

### Issue: TypeScript Errors
```bash
# Clear .nuxt cache
rm -rf .nuxt

# Reinstall
bun install
bun run dev
```

### Issue: Tailwind Classes Not Applied
1. Check path in `tailwind.config.ts` matches your files
2. Clear .nuxt: `rm -rf .nuxt`
3. Restart dev server

## Next Steps

### Implementing Remaining Pages

1. **Inventory** - Create product list with filtering
2. **QR/Payment** - Integrate QR generation library
3. **Health** - Display user medical info
4. **Settings** - User preferences and profile

### Enhanced Features

1. **API Integration** - Replace mock data with actual API calls
2. **Authentication** - Add user login/logout
3. **State Management** - Consider Pinia for complex state
4. **Testing** - Add Vitest for unit tests
5. **Deployment** - Deploy to Vercel or Netlify

## Resources

- [Nuxt 4 Documentation](https://nuxt.com)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Bun Documentation](https://bun.sh)

## Support

For issues or questions, refer to:
1. Official documentation links above
2. Component comments in the codebase
3. TypeScript error messages (very helpful!)

---

**Conversion Date**: 2026-05-24
**Status**: ✅ Complete for Dashboard, Chat, and Orders
**Next**: Expand remaining skeleton pages with actual content
