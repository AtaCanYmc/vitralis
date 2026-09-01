import type {
  ConsumablesConfig,
  CostBreakdown,
  ElectricityConfig,
  EquipmentItem,
  GlassItem,
  LaborConfig,
  MarginRiskConfig,
  VitralisProject,
} from '../types/project';

/**
 * Calculates the surface area in square meters for a single glass item.
 */
export function calculateGlassItemAreaSqM(item: GlassItem): number {
  let areaSqCm: number;

  if (item.shape === 'rect') {
    areaSqCm = (Number(item.widthCm) || 0) * (Number(item.heightCm) || 0);
  } else if (item.shape === 'circle') {
    const radius = (Number(item.diameterCm) || 0) / 2;
    areaSqCm = Math.PI * radius * radius;
  } else {
    areaSqCm = Number(item.customAreaSqCm) || 0;
  }

  const totalAreaSqCm = areaSqCm * (Number(item.quantity) || 1);
  return totalAreaSqCm / 10000; // convert cm² to m²
}

/**
 * Calculates the cost for a single glass item based on its dimensions and unit price.
 */
export function calculateGlassItemCost(item: GlassItem): { areaSqM: number; cost: number } {
  const areaSqM = calculateGlassItemAreaSqM(item);
  const areaSqCm = areaSqM * 10000;
  const quantity = Number(item.quantity) || 1;
  const unitPrice = Number(item.unitPrice) || 0;

  let cost = 0;

  if (item.priceUnit === 'sqm') {
    cost = areaSqM * unitPrice;
  } else if (item.priceUnit === 'sqcm') {
    cost = areaSqCm * unitPrice;
  } else if (item.priceUnit === 'sheet') {
    if (item.sheetWidthCm && item.sheetHeightCm && item.sheetPrice) {
      const sheetAreaSqCm = item.sheetWidthCm * item.sheetHeightCm;
      const fractionOfSheet = areaSqCm / (sheetAreaSqCm || 1);
      cost = fractionOfSheet * item.sheetPrice;
    } else {
      cost = quantity * unitPrice;
    }
  }

  return {
    areaSqM: Number(areaSqM.toFixed(4)),
    cost: Number(cost.toFixed(2)),
  };
}

/**
 * Full Cost Breakdown Calculation Engine for Vitralis
 */
export function calculateProjectCostBreakdown(
  glassItems: GlassItem[],
  consumables: ConsumablesConfig,
  labor: LaborConfig,
  equipment: EquipmentItem[],
  electricity: ElectricityConfig,
  marginRisk: MarginRiskConfig,
  pieceCount: number = 1
): CostBreakdown {
  // 1. Glass Costs
  let totalGlassAreaSqM = 0;
  let totalGlassCost = 0;

  glassItems.forEach(item => {
    const { areaSqM, cost } = calculateGlassItemCost(item);
    totalGlassAreaSqM += areaSqM;
    totalGlassCost += cost;
  });

  // 2. Consumables Costs
  // Copper Foil
  let foilCost = 0;
  if (consumables.foil.enabled && consumables.foil.rollLengthMeters > 0) {
    foilCost = (consumables.foil.lengthMeters / consumables.foil.rollLengthMeters) * consumables.foil.rollPrice;
  }

  // Solder
  let solderCost = 0;
  if (consumables.solder.enabled && consumables.solder.spoolWeightGrams > 0) {
    solderCost = (consumables.solder.weightGrams / consumables.solder.spoolWeightGrams) * consumables.solder.spoolPrice;
  }

  // Chemicals
  const chemicalsCost =
    (consumables.chemicals.fluxCost || 0) +
    (consumables.chemicals.patinaType !== 'none' ? consumables.chemicals.patinaCost || 0 : 0) +
    (consumables.chemicals.finishingPolishCost || 0) +
    (consumables.chemicals.cleaningSolventCost || 0);

  // Reinforcement & Hardware
  const reinforcementCost =
    (consumables.reinforcement.zincCameMeters || 0) * (consumables.reinforcement.zincCamePricePerMeter || 0) +
    (consumables.reinforcement.brassRodsCost || 0) +
    (consumables.reinforcement.hangingHooksCount || 0) * (consumables.reinforcement.hangingHookPrice || 0) +
    (consumables.reinforcement.chainMeters || 0) * (consumables.reinforcement.chainPricePerMeter || 0);

  // Custom Consumables
  let customConsumablesCost = 0;
  if (consumables.customConsumables && consumables.customConsumables.length > 0) {
    customConsumablesCost = consumables.customConsumables.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0),
      0
    );
  }

  const totalConsumablesCost = foilCost + solderCost + chemicalsCost + reinforcementCost + customConsumablesCost;

  // 3. Labor Costs
  const totalLaborHours = labor.stages.reduce((sum, stage) => sum + (Number(stage.hours) || 0), 0);
  const totalLaborCost = totalLaborHours * (Number(labor.hourlyRate) || 0);

  // 4. Equipment Depreciation Costs
  let totalEquipmentDepreciationCost = 0;
  equipment.forEach(item => {
    if (item.enabled && item.lifespanHours > 0) {
      const hourlyDepreciation = item.purchasePrice / item.lifespanHours;
      const usage = Number(item.usageHours) || 0;
      totalEquipmentDepreciationCost += hourlyDepreciation * usage;
    }
  });

  // 5. Electricity Costs
  let totalElectricityKwh = 0;

  // From standard electrical equipment
  equipment.forEach(item => {
    if (item.enabled && item.isElectrical && item.powerWatts > 0) {
      const kwh = (item.powerWatts * (Number(item.usageHours) || 0)) / 1000;
      totalElectricityKwh += kwh;
    }
  });

  // From custom electrical devices
  if (electricity.customElectricalEquipment && electricity.customElectricalEquipment.length > 0) {
    electricity.customElectricalEquipment.forEach(item => {
      if (item.enabled && item.powerWatts > 0) {
        const kwh = (item.powerWatts * (Number(item.usageHours) || 0)) / 1000;
        totalElectricityKwh += kwh;
      }
    });
  }

  const totalElectricityCost = totalElectricityKwh * (Number(electricity.unitRatePerKwh) || 0);

  // 6. Raw Base Cost
  const rawBaseCost =
    totalGlassCost + totalConsumablesCost + totalLaborCost + totalEquipmentDepreciationCost + totalElectricityCost;

  // 7. Waste & Risk Calculation
  const wasteRiskRate = (Number(marginRisk.wasteRiskPercentage) || 0) / 100;
  const wasteBasis =
    marginRisk.wasteCalculationMode === 'glass_and_consumables'
      ? totalGlassCost + totalConsumablesCost
      : rawBaseCost;

  const wasteAmount = wasteBasis * wasteRiskRate;
  const costWithWaste = rawBaseCost + wasteAmount;

  // 8. Profit Margin & Selling Price
  const profitMarginRate = (Number(marginRisk.targetProfitMarginPercentage) || 0) / 100;
  const profitAmount = costWithWaste * profitMarginRate;
  const subtotalSellingPrice = costWithWaste + profitAmount;

  // 9. Discount & VAT
  const discountRate = (Number(marginRisk.discountPercentage) || 0) / 100;
  const discountAmount = subtotalSellingPrice * discountRate;
  const priceAfterDiscount = Math.max(0, subtotalSellingPrice - discountAmount);

  const vatRate = (Number(marginRisk.vatTaxPercentage) || 0) / 100;
  const taxAmount = priceAfterDiscount * vatRate;
  const finalSellingPrice = priceAfterDiscount + taxAmount;

  // 10. Studio Metrics & Analytics
  const grossMarginPercentage =
    priceAfterDiscount > 0 ? (profitAmount / priceAfterDiscount) * 100 : 0;
  const effectiveHourlyYield =
    totalLaborHours > 0 ? (profitAmount + totalLaborCost) / totalLaborHours : 0;
  const costPerGlassPiece = pieceCount > 0 ? finalSellingPrice / pieceCount : finalSellingPrice;
  const costPerSqM = totalGlassAreaSqM > 0 ? finalSellingPrice / totalGlassAreaSqM : 0;

  const baseForRatios = finalSellingPrice || 1;
  const materialCostRatio = ((totalGlassCost + totalConsumablesCost) / baseForRatios) * 100;
  const laborCostRatio = (totalLaborCost / baseForRatios) * 100;
  const overheadCostRatio =
    ((totalEquipmentDepreciationCost + totalElectricityCost + wasteAmount) / baseForRatios) * 100;
  const profitRatio = (profitAmount / baseForRatios) * 100;

  return {
    totalGlassAreaSqM: Number(totalGlassAreaSqM.toFixed(4)),
    totalGlassCost: Number(totalGlassCost.toFixed(2)),
    foilCost: Number(foilCost.toFixed(2)),
    solderCost: Number(solderCost.toFixed(2)),
    chemicalsCost: Number(chemicalsCost.toFixed(2)),
    reinforcementCost: Number(reinforcementCost.toFixed(2)),
    customConsumablesCost: Number(customConsumablesCost.toFixed(2)),
    totalConsumablesCost: Number(totalConsumablesCost.toFixed(2)),
    totalLaborHours: Number(totalLaborHours.toFixed(2)),
    totalLaborCost: Number(totalLaborCost.toFixed(2)),
    totalEquipmentDepreciationCost: Number(totalEquipmentDepreciationCost.toFixed(2)),
    totalElectricityKwh: Number(totalElectricityKwh.toFixed(3)),
    totalElectricityCost: Number(totalElectricityCost.toFixed(2)),
    rawBaseCost: Number(rawBaseCost.toFixed(2)),
    wasteAmount: Number(wasteAmount.toFixed(2)),
    costWithWaste: Number(costWithWaste.toFixed(2)),
    profitAmount: Number(profitAmount.toFixed(2)),
    subtotalSellingPrice: Number(subtotalSellingPrice.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    priceAfterDiscount: Number(priceAfterDiscount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    finalSellingPrice: Number(finalSellingPrice.toFixed(2)),
    grossMarginPercentage: Number(grossMarginPercentage.toFixed(1)),
    effectiveHourlyYield: Number(effectiveHourlyYield.toFixed(2)),
    costPerGlassPiece: Number(costPerGlassPiece.toFixed(2)),
    costPerSqM: Number(costPerSqM.toFixed(2)),
    materialCostRatio: Number(materialCostRatio.toFixed(1)),
    laborCostRatio: Number(laborCostRatio.toFixed(1)),
    overheadCostRatio: Number(overheadCostRatio.toFixed(1)),
    profitRatio: Number(profitRatio.toFixed(1)),
  };
}

/**
 * Re-calculates and returns a fully updated VitralisProject object
 */
export function recalculateEntireProject(project: VitralisProject): VitralisProject {
  const updatedGlassItems = project.glassItems.map(item => {
    const { areaSqM, cost } = calculateGlassItemCost(item);
    return {
      ...item,
      calculatedAreaSqM: areaSqM,
      calculatedCost: cost,
    };
  });

  const breakdown = calculateProjectCostBreakdown(
    updatedGlassItems,
    project.consumables,
    project.labor,
    project.equipment,
    project.electricity,
    project.marginRisk,
    project.metadata.pieceCount
  );

  return {
    ...project,
    glassItems: updatedGlassItems,
    breakdown,
  };
}

/**
 * Quick Estimators for Stained Glass Artisans
 */
export const ArtisanEstimators = {
  estimateSolderFromFoil: (foilMeters: number, beadProfile: 'flat' | 'rounded' | 'high_dome' = 'rounded'): number => {
    const multiplier = beadProfile === 'flat' ? 14 : beadProfile === 'high_dome' ? 24 : 18.5;
    return Number((foilMeters * multiplier).toFixed(0));
  },

  estimateFoilFromPieces: (pieceCount: number, avgPerimeterCm: number = 22): number => {
    const totalLengthCm = (pieceCount * avgPerimeterCm) / 1.75;
    return Number((totalLengthCm / 100).toFixed(1));
  },
};
