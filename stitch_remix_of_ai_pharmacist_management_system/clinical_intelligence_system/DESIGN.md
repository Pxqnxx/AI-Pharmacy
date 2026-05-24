---
name: Clinical Intelligence System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#3d4947'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#595c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#727577'
  on-tertiary-container: '#fbfdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered for a high-stakes medical environment where clarity, speed of cognition, and trust are paramount. The platform serves two distinct yet overlapping personas: the pharmacist managing complex inventory and the patient seeking reliable AI-driven medical guidance.

The style is **Corporate / Modern** with a strong emphasis on **Minimalism**. By utilizing a high-utility layout with generous white space, the system reduces cognitive load during critical tasks. The emotional response is one of professional calm and technical precision—evoking the feeling of a sterile, well-organized modern pharmacy. 

Key visual drivers:
- **Clinical Precision:** Sharp typography and systematic alignment.
- **Approachable Technology:** Softened by significant corner radii to prevent the UI from feeling cold or intimidating.
- **Reliability:** A blue-teal foundation that signals institutional stability and medical authority.

## Colors

The palette is anchored in "Trustworthy Teal" to represent the intersection of health and technology. "Medical Blue" is reserved for primary actions and navigational cues, ensuring a high-contrast path for the user's eye.

- **Primary (Teal):** Used for branding, active states in the AI chat, and pharmaceutical categories.
- **Secondary (Blue):** Used for critical functional actions like "Confirm Prescription" or "Submit Order."
- **Neutrals:** A range of Slate grays (derived from #1E293B) provide hierarchical depth for text and borders, while the "Soft Gray" (#F8FAFC) acts as the primary background to reduce eye strain.
- **Semantic Colors:** "Safety Red" and "Success Green" are used strictly for status-driven feedback, ensuring they remain high-signal and unpolluted by decorative use.

## Typography

This design system utilizes **Inter** for all roles to leverage its exceptional legibility in data-dense environments. The typeface's tall x-height ensures that drug names and dosage instructions remain clear even at smaller scales.

- **Headlines:** Use Semi-Bold (600) weights with slight negative letter spacing to create a grounded, authoritative presence.
- **Body:** Regular (400) weight is the standard for patient communications and drug descriptions to maximize readability.
- **Labels:** Medium (500) and Semi-Bold (600) weights are used for data headers in the pharmacy management dashboard, ensuring they are distinguishable from the data values they represent.

## Layout & Spacing

The system employs a **Fluid Grid** model based on an 8px square rhythm. This ensures consistent alignment across the complex data tables of the management suite and the simpler, linear flow of the AI chat interface.

- **Desktop:** 12-column grid with 24px gutters. Content is housed in "Surfaces" that typically span 3, 4, 6, or 12 columns.
- **Mobile:** Single column with 16px side margins. 
- **Density:** The "Pharmacy Management" view utilizes a "Compact" spacing mode (8px/12px) for inventory lists, while the "Patient Consultation" view uses "Spacious" padding (24px/32px) to feel more inviting and less overwhelming.

## Elevation & Depth

This design system uses **Tonal Layers** and **Ambient Shadows** to define the z-axis. The goal is to make the interface feel structured and reliable without being visually heavy.

- **Level 0 (Base):** Soft Gray (#F8FAFC) background.
- **Level 1 (Cards/Widgets):** White (#FFFFFF) surfaces with a subtle 'sm' shadow (0px 1px 2px rgba(0,0,0,0.05)).
- **Level 2 (Modals/Overlays):** White (#FFFFFF) surfaces with a 'md' shadow (0px 4px 6px rgba(0,0,0,0.07)) to draw focus during critical tasks like "Add New Medication."
- **Contrast Outlines:** All input fields and secondary containers use a 1px border in a light Slate (#E2E8F0) to ensure definition against the white background without relying on heavy shadows.

## Shapes

The shape language is defined by a "2xl" corner radius philosophy. By using **Rounded** (0.5rem base) settings and scaling up to 1rem (rounded-lg) for cards and 1.5rem (rounded-xl) for larger dashboard widgets, the UI achieves a "soft-medical" aesthetic. 

- **Interactive Elements:** Buttons and input fields use a consistent 0.5rem radius.
- **Chat Bubbles:** Utilize 1rem radius on three corners, with the tail corner remaining sharper to indicate the speaker.
- **Status Pills:** Fully rounded (pill-shaped) to differentiate them from interactive buttons.

## Components

### Interactive Chat Bubbles
AI responses are styled in the Primary Teal with white text, positioned on the left. User messages are styled in Soft Gray with Neutral text, positioned on the right. 

### Medicine Product Cards
Must include a 1:1 aspect ratio image placeholder with a light gray fill, the drug name in `headline-md`, and dosage/stock status in `label-md`. The "Add to Order" button should be docked at the bottom.

### KPI Widgets
Used in the admin dashboard. These feature a large numerical value in `headline-lg` and a trend indicator (using Success Green or Safety Red) below it. Backgrounds are always White with Level 1 elevation.

### Input Fields
Clean, 1px bordered boxes with 0.5rem roundedness. Focus states must use a 2px Medical Blue (#2563EB) ring with a subtle outer glow.

### Status Indicators
Small, pill-shaped badges.
- **In Stock:** Success Green background (10% opacity) with dark green text.
- **Low Stock:** Warning Orange background (10% opacity) with dark orange text.
- **Critical/Expired:** Safety Red background (10% opacity) with dark red text.