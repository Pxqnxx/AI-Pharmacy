# Nuxt PharmaAI Dashboard

A modern Nuxt 4 application for PharmaAI - Pharmacy Management Dashboard

## Project Structure

```
nuxt-pharma-app/
├── pages/                  # Nuxt pages (auto-routed)
│   ├── dashboard.vue       # Admin dashboard with KPI cards
│   ├── chat.vue           # Pharmacist AI chat interface
│   ├── orders.vue         # Order history and tracking
│   ├── inventory.vue      # Medicine inventory management
│   ├── qr-promptpay.vue   # QR payment and checkout
│   └── health.vue         # User health profile
├── components/            # Reusable Vue components
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared interfaces and types
├── mock-data/            # Mock data for development
│   ├── dashboard.ts      # Dashboard KPI and chart data
│   ├── chat.ts          # Chat messages and navigation
│   └── orders.ts        # Orders data
├── public/               # Static assets
├── assets/              # Styles and images
├── tailwind.config.ts   # Tailwind CSS configuration
├── nuxt.config.ts       # Nuxt configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project dependencies
└── app.vue             # Root application layout
```

## Features

✅ **TypeScript with Composition API** - Full type safety and reactive components
✅ **Tailwind CSS** - All original classes preserved exactly
✅ **Mock Data Management** - Separated from components for scalability
✅ **Responsive Design** - Mobile-first Material Design 3 approach
✅ **Dark Mode Support** - Via Tailwind's dark mode class
✅ **Material Symbols** - Professional icon system

## Setup

### Prerequisites

- **Bun** v1.0+ - Fast JavaScript runtime
- **Node.js** 18+ (for compatibility)

### Installation

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Navigate to project
cd nuxt-pharma-app

# Install dependencies with Bun
bun install
```

### Development

```bash
# Start development server
bun run dev

# Open in browser
# Navigate to http://localhost:3000
```

### Production Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## Available Pages

### 1. **Dashboard** (`/dashboard`)
- Admin dashboard view for pharmacist
- KPI cards (Revenue, Orders, Active Consultations)
- Top-selling medicines bar chart
- Navigation drawer with menu items

### 2. **Chat** (`/chat`)
- AI pharmacist chatbot interface
- Message history display
- Real-time message input with auto-resize
- Mobile-optimized bottom navigation

### 3. **Orders** (`/orders`)
- Order history with status tracking
- Filter tabs (All, Processing, Completed, Cancelled)
- Order cards with action buttons
- Support contact section

### 4. **Inventory** (`/inventory`)
- Medicine stock management
- Low stock alerts
- Search and filter functionality
- *(To be implemented)*

### 5. **QR & Checkout** (`/qr-promptpay`)
- Payment integration
- QR code generation
- PromptPay payment support
- *(To be implemented)*

### 6. **Health Profile** (`/health`)
- User health information
- Medical history
- Consultation notes
- *(To be implemented)*

## Code Patterns

### Component with Composition API

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MyType } from '~/types'

const data = ref<MyType>({...})

const computed Value = computed(() => {
  return data.value.something
})
</script>
```

### TypeScript Types

All data structures are defined in `types/index.ts` for type safety:

```typescript
export interface KPICard {
  id: string
  label: string
  value: string | number
  icon: string
  // ... other properties
}
```

### Mock Data Organization

Mock data is separated into module files under `mock-data/` folder:

```typescript
// mock-data/dashboard.ts
export const dashboardData: DashboardData = {
  kpis: [...],
  topMedicines: [...],
  // ...
}
```

## Styling

### Tailwind Configuration

Custom colors, spacing, and font sizes configured in `tailwind.config.ts`:

- **Colors**: Material Design 3 color palette
- **Spacing**: Custom spacing scale (xs, sm, md, lg, xl, gutter, etc.)
- **Typography**: Custom font sizes and families (label-md, headline-lg, body-md, etc.)
- **Radius**: Rounded corners (DEFAULT, lg, xl, full)

### Important Notes

⚠️ **All Tailwind classes are preserved exactly as in the original design** - No modifications to maintain design fidelity

## TypeScript Setup

- **Strict mode enabled** for maximum type safety
- **Path aliases** configured:
  - `~/*` maps to project root
  - `@/*` maps to project root

## Dark Mode

Dark mode is supported via Tailwind's `dark:` prefix:

```html
<div class="bg-surface dark:bg-inverse-surface">
  Light mode surfaces with dark mode support
</div>
```

## Material Icons

Uses Google Material Symbols Outlined font. Include in templates:

```html
<span class="material-symbols-outlined">icon_name</span>
```

## Development Best Practices

1. **Type Safety** - Always define types in `types/index.ts`
2. **Data Separation** - Keep mock data in `mock-data/` folder
3. **Component Reusability** - Extract repeated elements to `components/`
4. **Responsive Design** - Test on mobile, tablet, desktop breakpoints
5. **Accessibility** - Use semantic HTML and proper ARIA attributes

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Dark mode support for compatible devices

## License

MIT

## Support

For issues or questions, contact the development team.

---

**Last Updated**: 2026-05-24
**Nuxt Version**: 4.x
**TypeScript**: 5.3+
**Tailwind CSS**: 3.x
