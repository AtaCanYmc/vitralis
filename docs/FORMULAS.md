# 📐 Vitralis Calculation Formulas & Artisan Benchmarks

This document provides a detailed breakdown of the mathematical engine, atelier formulas, and heuristic benchmarks implemented in **Vitralis**.

---

## 1. Glass Surface Area & Material Cost

### Rectangular Glass Pieces
$$\text{Area}_{\text{m}^2} = \left(\frac{\text{Width}_{\text{cm}} \times \text{Height}_{\text{cm}}}{10{,}000}\right) \times \text{Qty}$$

### Circular Glass Pieces
$$\text{Area}_{\text{m}^2} = \left(\frac{\pi \times (D_{\text{cm}} / 2)^2}{10{,}000}\right) \times \text{Qty}$$

### Unit Price Normalization
* **Per $\text{m}^2$**: $\text{Cost} = \text{Area}_{\text{m}^2} \times \text{Price}_{\text{m}^2}$
* **Per $\text{cm}^2$**: $\text{Cost} = (\text{Area}_{\text{m}^2} \times 10{,}000) \times \text{Price}_{\text{cm}^2}$
* **Per Sheet**: $\text{Cost} = \text{Qty} \times \text{Price}_{\text{sheet}}$

---

## 2. Consumables (Solder, Copper Foil, Patina, Chemicals)

### Copper Foil (Bakır Folyo)
$$\text{Cost}_{\text{foil}} = \left(\frac{\text{Length}_{\text{m}}}{\text{RollLength}_{\text{m}}}\right) \times \text{RollPrice}$$

### Stained Glass Solder (Vitray Lehimi: 60/40 & 50/50)
* **Average Solder Consumption per Line**: $18\text{g} - 22\text{g} \text{ per meter of solder seam}$.
$$\text{Cost}_{\text{solder}} = \left(\frac{\text{Weight}_{\text{g}}}{500\text{g}}\right) \times \text{BarPrice}_{500\text{g}}$$

### Patina & Flux (Patina & Lehim Sıvısı)
$$\text{Cost}_{\text{liquid}} = \left(\frac{\text{Volume}_{\text{ml}}}{\text{BottleVolume}_{\text{ml}}}\right) \times \text{BottlePrice}$$

---

## 3. Workshop Labor (8 Artisan Stages)

Labor cost is calculated based on active studio hourly rate and recorded stage durations:
$$\text{Total Labor Cost} = \text{Hourly Rate} \times \sum_{i=1}^{8} \text{Stage Hours}_i$$

### 8 Dedicated Artisan Stages:
1. **Design & Pattern Drafting (Tasarım & Çizim / Şablon)**
2. **Glass Cutting (Cam Kesimi)**
3. **Grinding & Edge Truing (Rodaj / Taşlama)**
4. **Copper Foiling (Bakır Folyolama)**
5. **Soldering (Lehimleme: Ön/Arka/Kenar)**
6. **Cleaning & Neutralization (Yıkama & Nötralizasyon)**
7. **Patina & Polishing (Patina & Parlatma/Vaks)**
8. **Framing, Reinforcement & Assembly (Montaj / Çerçeveleme)**

---

## 4. Equipment Depreciation (Amortisman)

For each studio machine (Glass Grinder, Soldering Iron, Ring Saw, Fume Extractor, Polishing Wheel):
$$\text{Hourly Depreciation} = \frac{\text{Purchase Price}}{\text{Lifespan Hours}}$$
$$\text{Project Equipment Cost} = \sum (\text{Hourly Depreciation}_k \times \text{Usage Hours}_k)$$

---

## 5. Studio Electricity (Enerji Tüketimi)

$$\text{Electricity Cost} = \left(\frac{\text{Power}_{\text{Watts}} \times \text{Hours}}{1{,}000}\right) \times \text{Unit Rate}_{\text{kWh}}$$

---

## 6. Financial Waterfall & Final Selling Price

```
[Raw Base Cost] = Glass + Consumables + Labor + Equipment + Electricity
       │
       ▼
[Cost with Waste] = Raw Base Cost × (1 + Waste Rate)
       │
       ▼
[Pre-Discount Price] = Cost with Waste × (1 + Margin Rate) + Packaging & Shipping
       │
       ▼
[Net Subtotal] = Pre-Discount Price × (1 - Discount Rate)
       │
       ▼
[Final Selling Price] = Net Subtotal × (1 + VAT Rate)
```

---

## 7. Studio Hourly Yield Benchmark (Saatlik Getiri)

The real financial return per artisan hour after subtracting raw materials, energy, and wear:
$$\text{Effective Hourly Yield} = \frac{\text{Final Price} - (\text{Glass} + \text{Consumables} + \text{Overhead} + \text{Waste})}{\text{Total Labor Hours}}$$
