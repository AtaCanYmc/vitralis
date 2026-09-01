# Vitralis — Stained Glass & Tiffany Studio Cost Calculator (PWA)

<p align="center">
  <img src="public/pwa-512x512.svg" alt="Vitralis Logo" width="128" height="128" />
</p>

<p align="center">
  <strong>Comprehensive Cost Accounting, Quotation Generator, and Progressive Web App (PWA) for Stained Glass Artisans and Tiffany Technique Workshops.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PWA-Offline_Ready-5A0FC8?logo=pwa&logoColor=white" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## 💎 Overview

**Vitralis** is a modern, high-precision Cost Calculation and Quotation Progressive Web App crafted specifically for stained glass artists, Tiffany lamp makers, and architectural lead came workshops. 

Stained glass creation involves complex material layers, volatile consumables, high equipment wear (diamond diamond grinder bits, glass cutters, soldering irons), significant electrical consumption, and labor-intensive artistic stages. Vitralis automates all calculations with mathematically rigorous formulas, visual analytics, studio profile persistence (`LocalStorage`), and print-ready quotation sheets with zero external dependencies or server requirements.

---

## ✨ Key Features

1. **🎨 Dynamic Multi-Glass Manager:**
   - Add unlimited glass types (Spectrum Opal, Wissmach Cathedral, Waterglass, Baroque, Oceanside, Lambert Antique, Mirror, Bevels, Float).
   - Multi-shape geometry: Rectangles ($W \times H$), Circles/Ovals ($\varnothing$), and Custom surface areas ($\text{cm}^2$ or $\text{m}^2$).
   - Real-time surface area aggregation and cost valuation per $\text{m}^2$, $\text{cm}^2$, or whole sheet.

2. **🧵 Comprehensive Consumables Accounting:**
   - **Copper Foil:** Types (Black / Copper / Silver Backed), widths (7/32", 3/16", 1/4"), linear meters used, roll pricing.
   - **Solder:** Alloys (60/40, 50/50, Lead-free), grams used, spool price & weight.
   - **Chemicals:** Liquid/gel flux, Black/Copper chemical patina, carnauba polish/wax, neutralizing solvents.
   - **Hardware & Reinforcement:** Zinc Came profile, brass support rods, copper hanging rings, chains, custom items (wooden lamp bases, glass gems/cabochons).

3. **⚙️ Tool & Machine Depreciation (Wear & Tear):**
   - Proportional hourly wear calculation: $\text{Depreciation} = \left(\frac{\text{Purchase Price}}{\text{Lifespan Hours}}\right) \times \text{Project Hours}$.
   - Pre-configured for Glass Grinders (Kristall 2000S), Soldering Irons (Hakko FX-601), Diamond Cutters (Toyo TC-17), Pliers sets, Diamond Grinder bits, and LED Light Pads.

4. **⚡ Electricity & Energy Metering:**
   - Automatic wattage aggregation: $\text{kWh} = \sum \frac{\text{Watts} \times \text{Hours}}{1000}$.
   - Precise energy billing based on local kWh rates.

5. **⏳ 8-Stage Artisan Labor Breakdown:**
   - Design, cartoon drawing & pattern cutting.
   - Glass scoring & pliers breaking.
   - Diamond edge grinding & piece fitting.
   - Copper foiling & burnishing.
   - Front & back soldering, edge beading & ring mounting.
   - Patina application, neutralizing wash & carnauba waxing.
   - Zinc framing & structural reinforcement.
   - Custom shockproof packaging.

6. **🛡️ Waste & Breakage Risk Margin:**
   - Glass breakage insurance rate (%) to cover thermal shock, cut fractures, and scrap loss.
   - Configurable calculation mode (apply to materials only or entire base cost).

7. **📈 Target Profit Margin & Commercial Analytics:**
   - Target profit markup (%) with gross margin calculation.
   - Effective studio hourly yield ($\text{Rate}/\text{hour}$).
   - Cost-per-piece and cost-per-$\text{m}^2$ metrics.
   - Client discount and VAT/Sales Tax toggles.

8. **📄 Professional Quotation Generator & Export:**
   - Formal client-ready quote sheets with studio branding, customer details, itemized specs, and authentic stained glass care instructions.
   - Browser print layout (`@media print`) and PDF export.
   - Quick one-click formatted summary copy for WhatsApp, Telegram, or Email.
   - JSON export and import for project backup and sharing.

9. **📱 Progressive Web App (PWA) & Offline Support:**
   - Installable on iOS, Android, macOS, Windows, and Linux ("Add to Home Screen").
   - 100% functional offline in workshop environments with Workbox asset precaching.

10. **🌐 Dual Language & Multi-Currency:**
    - Full Turkish (Türkçe) and English (EN) localization.
    - Currencies supported: ₺ (TRY), $ (USD), € (EUR), £ (GBP), CA$ (CAD), A$ (AUD), CHF.

---

## 📐 Mathematical Formulation & Cost Logic

$$\text{Total Glass Cost} = \sum_{i} \left( \text{Area}_i \times \text{UnitPrice}_i \right)$$

$$\text{Consumables Cost} = \text{Foil} + \text{Solder} + \text{Chemicals} + \text{Hardware} + \text{Custom Items}$$

$$\text{Labor Cost} = \left(\sum \text{Stage Hours}\right) \times \text{Hourly Rate}$$

$$\text{Equipment Depreciation} = \sum \left(\frac{\text{Tool Purchase Price}}{\text{Expected Lifespan Hours}} \times \text{Usage Hours}\right)$$

$$\text{Electricity Cost} = \left(\sum \frac{\text{Power (Watts)} \times \text{Usage Hours}}{1000}\right) \times \text{Rate per kWh}$$

$$\text{Raw Base Cost} = \text{Glass} + \text{Consumables} + \text{Labor} + \text{Equipment} + \text{Electricity}$$

$$\text{Cost With Waste} = \text{Raw Base Cost} + \left(\text{Materials Cost} \times \text{Waste\%}\right)$$

$$\text{Final Selling Price} = \left(\text{Cost With Waste} \times (1 + \text{Profit Margin\%}) - \text{Discount}\right) \times (1 + \text{Tax\%})$$

$$\text{Effective Hourly Yield} = \frac{\text{Profit Amount} + \text{Labor Cost}}{\text{Total Labor Hours}}$$

---

## 🛠️ Tech Stack

- **Framework:** React 19 (Hooks, Context API)
- **Language:** TypeScript 6.0
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 with custom Glassmorphism and Jewel Tone Gradients
- **PWA Engine:** `vite-plugin-pwa` with Workbox SW precaching
- **Icons:** `lucide-react`
- **Testing:** `vitest` unit test suite
- **Storage:** Schema-versioned `LocalStorage` persistence

---

## 📂 Project Architecture

```
vitralis/
├── public/
│   ├── favicon.svg             # Vector brand icon
│   ├── pwa-192x192.svg         # PWA icon 192x192
│   └── pwa-512x512.svg         # PWA icon 512x512
├── src/
│   ├── types/
│   │   ├── project.ts          # Stained glass project data structures
│   │   └── studio.ts           # Studio profile, currency, and defaults
│   ├── constants/
│   │   ├── defaults.ts         # Initial rates, equipment lists, currencies
│   │   └── templates.ts        # Pre-built stained glass project presets
│   ├── context/
│   │   ├── StudioContext.tsx   # Studio settings, theme, and language provider
│   │   └── ProjectContext.tsx  # Calculation engine, mutations, and project manager
│   ├── utils/
│   │   ├── calculations.ts     # Pure mathematical cost calculation engine
│   │   ├── calculations.test.ts # Vitest automated test suite
│   │   ├── formatters.ts       # Currency, dimension, and time formatting
│   │   └── exportUtils.ts      # JSON export/import and WhatsApp quote copy
│   ├── i18n/
│   │   ├── tr.ts               # Turkish translations
│   │   ├── en.ts               # English translations
│   │   └── index.ts            # Translation entrypoint
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx           # App header with language/currency/PWA
│   │   │   ├── TabNavigation.tsx    # Segmented navigation bar
│   │   │   ├── QuickCostSummary.tsx # Real-time sticky metrics bar
│   │   │   ├── GlassCard.tsx        # Glassmorphic container with glow borders
│   │   │   ├── NumberInput.tsx      # Numeric input with prefix/suffix units
│   │   │   └── Modal.tsx            # Accessible modal wrapper
│   │   ├── calculator/
│   │   │   ├── GlassSection.tsx        # Multi-glass table and area calculators
│   │   │   ├── ConsumablesSection.tsx  # Foil, solder, came, chemicals
│   │   │   ├── LaborSection.tsx        # 8-stage artisan labor manager
│   │   │   ├── EquipmentSection.tsx    # Tool wear & depreciation list
│   │   │   ├── ElectricitySection.tsx  # Wattage and energy metering
│   │   │   ├── MarginWasteSection.tsx  # Waste risk, profit markup & taxes
│   │   │   └── CostBreakdownChart.tsx  # SVG donut chart & performance KPIs
│   │   ├── projects/
│   │   │   ├── ProjectManager.tsx      # Saved projects list, search & export
│   │   │   └── TemplateSelector.tsx    # Preset project starter templates
│   │   ├── quote/
│   │   │   └── PrintableQuote.tsx      # Formal print/PDF quotation document
│   │   ├── studio/
│   │   │   └── StudioSettings.tsx      # Workshop profile & default rate settings
│   │   ├── tools/
│   │   │   └── ArtisanToolsModal.tsx   # Solder estimator, circle area calculator
│   │   └── pwa/
│   │       └── PWAInstallBanner.tsx    # Install banner & offline status indicator
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm / yarn

### Installation

1. **Clone or navigate to the repository:**
   ```bash
   git clone https://github.com/your-username/vitralis.git
   cd vitralis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run Unit Tests:**
   ```bash
   npm test
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```
   The output files will be in `dist/`, including service worker and precached assets ready for static hosting on Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

---

## 💡 Artisan Rule-of-Thumb Guidelines Included

- **Foil to Solder Ratio:** For standard Tiffany copper foil (7/32" width), beaded front and back with 60/40 alloy, artisans typically consume approximately **15g to 22g of solder per linear meter of foil**.
- **Average Piece Perimeter:** In floral and decorative Tiffany panels, the average piece perimeter typically ranges between **18cm and 26cm**. Total required linear foil can be approximated as: $\text{Foil (m)} \approx \frac{\text{Piece Count} \times \text{Avg Perimeter (cm)}}{175}$.
- **Glass Waste Factor:** Stained glass cutting scrap and accidental thermal breakage averages between **10% and 15%** for experienced artisans, and **20% to 25%** for intricate curved or deep concave cuts.

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
