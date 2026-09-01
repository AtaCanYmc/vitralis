import { describe, it, expect } from 'vitest';
import {
  calculateGlassItemAreaSqM,
  calculateGlassItemCost,
  calculateProjectCostBreakdown,
  ArtisanEstimators,
} from './calculations';
import type {
  GlassItem,
  ConsumablesConfig,
  LaborConfig,
  EquipmentItem,
  ElectricityConfig,
  MarginRiskConfig,
} from '../types/project';

describe('Vitralis Calculation Engine', () => {
  it('calculates rectangular glass area and cost accurately', () => {
    const item: GlassItem = {
      id: 'test-rect',
      name: 'Rect Glass',
      type: 'Spectrum Opal',
      color: 'Amber',
      shape: 'rect',
      widthCm: 50,
      heightCm: 40,
      diameterCm: 0,
      customAreaSqCm: 0,
      quantity: 2,
      unitPrice: 2000,
      priceUnit: 'sqm',
      calculatedAreaSqM: 0,
      calculatedCost: 0,
    };

    // 50cm * 40cm = 2000cm² * 2 = 4000cm² = 0.4 m²
    const area = calculateGlassItemAreaSqM(item);
    expect(area).toBeCloseTo(0.4, 4);

    const { cost } = calculateGlassItemCost(item);
    // 0.4 m² * 2000 = 800
    expect(cost).toBe(800);
  });

  it('calculates circular glass area and cost accurately', () => {
    const item: GlassItem = {
      id: 'test-circle',
      name: 'Circle Medallion',
      type: 'Wissmach Cathedral',
      color: 'Cobalt',
      shape: 'circle',
      widthCm: 0,
      heightCm: 0,
      diameterCm: 20, // radius = 10cm, area = π * 100 ≈ 314.159 cm² = 0.0314159 m²
      customAreaSqCm: 0,
      quantity: 1,
      unitPrice: 3000,
      priceUnit: 'sqm',
      calculatedAreaSqM: 0,
      calculatedCost: 0,
    };

    const area = calculateGlassItemAreaSqM(item);
    expect(area).toBeCloseTo(0.0314, 3);

    const { cost } = calculateGlassItemCost(item);
    // 0.0314159 * 3000 ≈ 94.25
    expect(cost).toBeCloseTo(94.25, 1);
  });

  it('calculates full project cost, waste, profit margin, discount, and VAT correctly', () => {
    const glassItems: GlassItem[] = [
      {
        id: 'g1',
        name: 'Opal Glass',
        type: 'Spectrum Opal',
        color: 'White',
        shape: 'rect',
        widthCm: 20,
        heightCm: 25,
        diameterCm: 0,
        customAreaSqCm: 0,
        quantity: 1,
        unitPrice: 2000, // area = 500 cm² = 0.05 m² -> cost = 100
        priceUnit: 'sqm',
        calculatedAreaSqM: 0.05,
        calculatedCost: 100,
      },
    ];

    const consumables: ConsumablesConfig = {
      foil: {
        enabled: true,
        foilType: 'Black Backed',
        foilWidth: '7/32"',
        lengthMeters: 33,
        rollPrice: 300,
        rollLengthMeters: 33, // exactly 1 roll = 300
      },
      solder: {
        enabled: true,
        solderRatio: '60/40',
        weightGrams: 500,
        spoolPrice: 500,
        spoolWeightGrams: 500, // exactly 1 spool = 500
      },
      chemicals: {
        fluxCost: 50,
        patinaType: 'black',
        patinaCost: 50,
        finishingPolishCost: 20,
        cleaningSolventCost: 10, // chemicals = 130
      },
      reinforcement: {
        zincCameMeters: 2,
        zincCamePricePerMeter: 50, // 100
        brassRodsCost: 20,
        hangingHooksCount: 2,
        hangingHookPrice: 15, // 30
        chainMeters: 1,
        chainPricePerMeter: 50, // 50 -> reinforcement = 200
      },
      customConsumables: [
        { id: 'c1', name: 'Custom Base', quantity: 1, unitCost: 70, unit: 'pcs' }, // 70
      ],
    };
    // Total Consumables = 300 + 500 + 130 + 200 + 70 = 1200

    const labor: LaborConfig = {
      hourlyRate: 200,
      stages: [
        { id: 'design', name: 'Design', hours: 2 },
        { id: 'cutting', name: 'Cutting', hours: 3 },
      ], // total hours = 5 -> labor cost = 1000
    };

    const equipment: EquipmentItem[] = [
      {
        id: 'eq1',
        name: 'Grinder',
        category: 'machine',
        purchasePrice: 2000,
        lifespanHours: 1000, // 2 per hour
        isElectrical: true,
        powerWatts: 200,
        usageHours: 10, // depreciation = 20
        enabled: true,
      },
    ];

    const electricity: ElectricityConfig = {
      unitRatePerKwh: 5, // 200W * 10h = 2 kWh * 5 = 10
      customElectricalEquipment: [],
    };

    // Raw Base Cost = Glass (100) + Consumables (1200) + Labor (1000) + Depr (20) + Elec (10) = 2330

    const marginRisk: MarginRiskConfig = {
      wasteRiskPercentage: 10, // On materials (100 + 1200 = 1300 * 10% = 130)
      wasteCalculationMode: 'glass_and_consumables',
      targetProfitMarginPercentage: 50, // 50% on costWithWaste (2330 + 130 = 2460) -> profit = 1230
      vatTaxPercentage: 20,
      discountPercentage: 0,
    };

    const breakdown = calculateProjectCostBreakdown(
      glassItems,
      consumables,
      labor,
      equipment,
      electricity,
      marginRisk,
      10 // 10 pieces
    );

    expect(breakdown.totalGlassCost).toBe(100);
    expect(breakdown.totalConsumablesCost).toBe(1200);
    expect(breakdown.totalLaborCost).toBe(1000);
    expect(breakdown.totalEquipmentDepreciationCost).toBe(20);
    expect(breakdown.totalElectricityCost).toBe(10);
    expect(breakdown.rawBaseCost).toBe(2330);
    expect(breakdown.wasteAmount).toBe(130);
    expect(breakdown.costWithWaste).toBe(2460);
    expect(breakdown.profitAmount).toBe(1230);
    expect(breakdown.subtotalSellingPrice).toBe(3690);
    // 3690 * 1.20 VAT = 4428
    expect(breakdown.finalSellingPrice).toBe(4428);
    expect(breakdown.costPerGlassPiece).toBe(442.8);
  });

  it('estimates solder and foil with artisan rules of thumb', () => {
    const solder = ArtisanEstimators.estimateSolderFromFoil(10, 'rounded');
    expect(solder).toBe(185); // 10 * 18.5 ≈ 185g

    const foil = ArtisanEstimators.estimateFoilFromPieces(20, 25);
    expect(foil).toBeGreaterThan(0);
  });
});
