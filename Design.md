# Orbita AI Design System & Theme Specification

Welcome to the design specifications for **Orbita AI: Neural Workspace**. This document outlines the design philosophy, typography, colors, layout structures, utility styles, and WebGL shader components that define the Orbita AI user experience.

---

## 🌌 Design Philosophy: Futuristic Minimalism
Orbita AI merges the clean layout of high-performance modern developer interfaces (like Arc Browser and iOS) with the striking aesthetics of **Neo-Cyberpunk** and **glassmorphism**. 

Key pillars:
1. **Dynamic Depth**: Multi-layered transparency (`backdrop-filter: blur`) coupled with soft glowing shadows.
2. **Kinetic Transitions**: Fluid micro-animations (`motion/react` / Framer Motion) and smooth theme toggling.
3. **Immersive Focus**: Contrast-driven readability via deep dark backgrounds paired with vibrant neon primaries.

---

## 🔤 Typography & Font Scale
Orbita AI imports fonts from Google Fonts to construct three distinct typographic matrices depending on semantic context.

| Font Token | Font Family | Intended Use Case | Import Definition |
| :--- | :--- | :--- | :--- |
| `--font-sans` | **Inter** | Body text, UI labels, buttons, navigation, and paragraphs | `font-sans` |
| `--font-display` | **Outfit** | High-impact headers, page titles, logo, stats, and primary branding | `font-display` |
| `--font-mono` | **JetBrains Mono** | Code snippets, AI logs, telemetry feedback, terminal readouts, and timestamps | `font-mono` |

### Scale & Hierarchy Guidelines
- **System Logo**: `Outfit` Bold (tracking-tight), `24px` (`text-2xl`)
- **Hero Title**: `Outfit` Extra-Bold, `60px` to `96px` (`text-6xl md:text-8xl`), tracking-tighter, leading-tight
- **Section Headers**: `Outfit` Bold, `30px` to `36px` (`text-3xl md:text-4xl`)
- **Card Titles / Subsection Headers**: `Outfit` Semi-Bold, `20px` to `24px` (`text-xl md:text-2xl`)
- **Body Text**: `Inter` Regular/Medium, `14px` to `16px` (`text-sm / text-base`), leading-relaxed, slightly tight letter-spacing (`-0.011em`)
- **Muted Text**: `Inter` Regular, opacity `40%` (`text-foreground/40`) or `60%` (`text-foreground/60`)
- **Technical/Telemetry Logs**: `JetBrains Mono` Regular/Medium, `12px` to `14px` (`text-xs / text-sm`)

---

## 🎨 Color System & Theme Matrix
The interface runs a responsive dual-theme system (Dark/Light). Tailored color values are registered as CSS custom properties in [src/index.css](file:///c:/Users/ossamamehmood/.gemini/antigravity/scratch/Orbita-AI/src/index.css) and exposed through Tailwind CSS 4.0's `@theme` config.

### 🌑 Dark Mode (Default Matrix)
Dark mode is calibrated for low-light environments, using deep space-void black tones mixed with hyper-vibrant neon glows.

| Custom Property | Standard Hex / Alpha Value | Purpose |
| :--- | :--- | :--- |
| `--background` | `#020205` | Primary workspace canvas (deep space void) |
| `--foreground` | `#ffffff` | Pure white text & icons |
| `--primary` | `#02FEDC` | **Neon Teal** - Focal points, main buttons, primary links |
| `--primary-rgb` | `2, 254, 220` | RGB coordinates for opacity-based teal colors |
| `--primary-foreground` | `#000000` | High-contrast black text on top of primary teal elements |
| `--secondary` | `#5A5CFF` | **Electric Violet/Indigo** - Secondary UI elements, secondary action backdrops |
| `--secondary-rgb` | `90, 92, 255` | RGB coordinates for violet opacity overrides |
| `--secondary-foreground`| `#ffffff` | Text on secondary backdrops |
| `--accent` | `#F502FD` | **Vivid Pink/Magenta** - Accents, warning/success alternates, highlights |
| `--accent-rgb` | `245, 2, 253` | RGB coordinates for accent pink |
| `--muted` | `rgba(255, 255, 255, 0.05)` | Backgrounds for secondary inputs or buttons |
| `--muted-foreground` | `rgba(255, 255, 255, 0.4)` | Dimmed descriptions, labels, and helper text |
| `--card` | `rgba(255, 255, 255, 0.02)` | Semi-translucent panels |
| `--popover` | `#020205` | Menus and dropdown background |
| `--border` | `rgba(255, 255, 255, 0.08)` | Delicate separator lines |
| `--input` | `rgba(255, 255, 255, 0.05)` | Field inputs |
| `--ring` | `#02FEDC` | Active state outline glow (Neon Teal) |

### ☀️ Light Mode (`.light`)
When toggled to light mode, the primary and secondary roles adapt to guarantee readability.

| Custom Property | Standard Hex / RGB Value | Purpose |
| :--- | :--- | :--- |
| `--background` | `#ffffff` | White backdrop |
| `--foreground` | `#020617` | Slate-950 high-contrast text |
| `--primary` | `#5A5CFF` | **Electric Violet/Indigo** (Primary role for readability) |
| `--secondary` | `#02FEDC` | **Neon Teal/Cyan** (Assigned to secondary role) |
| `--accent` | `#F502FD` | **Vivid Pink/Magenta** (Accent role) |
| `--muted` | `#f8fafc` | Light gray Slate-50 panels |
| `--muted-foreground` | `#64748b` | Gray Slate-500 labels |
| `--card` | `#ffffff` | Solid white container panels |
| `--popover` | `#ffffff` | Dropdowns and select lists |
| `--border` | `#e2e8f0` | Clean Slate-200 separators |
| `--input` | `#f1f5f9` | Inputs (Slate-100) |
| `--ring` | `#5A5CFF` | Active ring highlights (Electric Violet) |

---

## 🔮 Material Shading & Glassmorphism
Orbita AI features custom UI materials configured in CSS. These classes should be used to build layers of visual depth.

### 1. Standard Glass (`.glass`)
Translucent overlay panel with high-frequency blurring and light saturation.
- **Dark Mode**: Translucent white (`rgba(255, 255, 255, 0.02)`) background, `16px` blur, `180%` saturation, and thin border (`rgba(255,255,255,0.08)`).
- **Light Mode**: High-opacity white (`rgba(255, 255, 255, 0.7)`), `16px` blur, thin light border.

### 2. Glossy Glass (`.glass-glossy`)
Highly reflective, glossy surface featuring a subtle top-down lighting sheen.
- Includes a linear gradient header reflection: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`.
- An inset top-edge highlight mimics a glass edge: `inset 0 0.5px 0px rgba(255,255,255,0.2)`.
- Enhanced blur size: `24px` blur.

### 3. Dark Glass (`.glass-dark`)
Deeper backdrop opacity for high contrast overlays.
- Uses `rgba(0, 0, 0, 0.5)` background with `20px` blur. Best for system dialogs, notifications, and context menu backdrops.

### 4. Rich Saturation Blue Glass (`.glass-blue-glossy`)
Dreamy blue-tinted container material.
- Features `32px` blur and `180%` saturation to allow glowing nodes behind it to blend smoothly.

### 5. Mobile & Widget Material (`.ios-glass`, `.ios-card`)
Inspired by the core components of iOS.
- `.ios-glass`: `rgba(20, 20, 25, 0.6)` base backing, `30px` blur, `200%` saturation.
- `.ios-card`: Large border radius (`32px` / `2rem`), subtle `rgba(255,255,255,0.07)` border, and `40px` backdrop blur.

---

## ⚡ Gradient & Glow Utilities
Add dynamic energy using our futuristic cyberpunk gradient configurations:

### Futuristic Gradient (`.futuristic-gradient`)
The core gradient of the Orbita AI brand. 
- **Colors**: Diagonal flow from Neon Teal (`#02FEDC`) ➔ Electric Violet (`#5A5CFF`) ➔ Vivid Pink (`#F502FD`) at a `135deg` angle.
- **Sheen Overlay**: A pseudo-element `::after` applies a vertical white-to-transparent gloss layer to simulate a curved glassy surface.

### Text Gradient (`.text-gradient`)
Clips the futuristic gradient directly to text nodes:
- Uses `-webkit-background-clip: text` and transparent fill color.
- Interactive variants: `.hover-text-gradient:hover` and `.group:hover .group-hover:text-gradient` seamlessly apply the gradient on hover events.

### Shadow Glow Utilities
Add dimensional luminescence around key panels and buttons:
- `.glow-primary`: Teal glow (`box-shadow: 0 0 20px rgba(2, 254, 220, 0.2)`).
- `.glow-primary-strong`: Strong teal highlight (`box-shadow: 0 0 40px rgba(2, 254, 220, 0.4)`).
- `.glow-gradient`: Triple-layer holographic glow combining Teal, Violet, and Pink shadows.
- `.glow-gradient-sm`: Subtle hover glow for secondary elements.
- **Status Indicators**:
  - `.glow-blue-sm` (Information / Pending)
  - `.glow-orange-sm` (Warning / Priority)
  - `.glow-red-sm` (Alert / Delayed)

---

## 🟢 Kinetic WebGL Interactive Element: The Orb (`Orb.tsx`)
The centerpiece of Orbita AI is the dynamic, hardware-accelerated **Orb**, powered by the lightweight WebGL library `ogl`.

### Physics & Behavior
- **Simplex Noise (`snoise3`)**: The outer edge of the Orb is driven by 3D simplex noise to create organic, fluid liquid waves.
- **Hover Responsiveness**: As the cursor enters the Orb, the `.orb-container` registers coordinates. An interactive ripple is calculated, adding physical distortion (`hoverIntensity = 0.2`) and triggering rotational speed increments (`rotationSpeed = 0.3`).
- **Hue Rotation**: The WebGL fragment shader accepts a custom `hue` uniform, allowing components to color-shift the orb dynamically (e.g., violet, pink, or emerald) using standard HSL/RGB conversion logic.
- **Background Contrast Protection**: The shader automatically detects the luminance of the CSS variable `--background`. If the background is light, the shader increases target opacity and fades the internal dark layers, ensuring the Orb remains visible and stunning against both white and black themes.

---

## ⚙️ Layout Grid & Spacing Protocol
To keep the layout clean, the application utilizes a specific container system:
- **Global Spacing**: Main layouts use `--radius: 1.5rem` (`24px`) for panels.
- **Navbar**: Fixed header height, glass backing, and thin borders (`border-b border-white/5` or `border-black/5`).
- **Container Boundaries**: Centered grids using `max-w-7xl` (`1280px`) with padding `px-6` (`24px`).
- **Cards**: Designed using `.glass` or `.glass-glossy` with padded interiors (`p-8` / `32px` on desktop, `p-6` / `24px` on mobile) and rounded corners (`rounded-3xl` / `24px`).

---

## 🛠️ Usage Guidelines for Components

When developing or modifying components in Orbita AI:
1. **Buttons**: Use standard variant controls (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`). To highlight critical features (like onboarding or upgrade paths), wrap the button with `.futuristic-gradient`.
2. **Icons**: Use the custom SVG target utility class `.svg-stroke-gradient` to inject the futuristic gradient directly into Lucide SVGs.
3. **Borders**: Do not use generic solid gray borders. Always rely on `border-border` (`rgba(255, 255, 255, 0.08)` in dark mode) to preserve the glassmorphic aesthetics.
4. **Theme Transitions**: When adding a page container, ensure `transition: background-color 0.4s ease, color 0.4s ease` is applied to avoid jarring transitions when the user toggles dark/light mode.
