export type GlassShape = 'rect' | 'circle' | 'custom_area';
export type PriceUnit = 'sqm' | 'sqcm' | 'sheet';

export interface GlassItem {
  id: string;
  name: string;
  type: string; // e.g., 'Spectrum Opal', 'Wissmach Cathedral', 'Translucent', 'Mirror', 'Baroque', 'Textured', 'Waterglass'
  color: string;
  colorHex?: string;
  shape: GlassShape;
  widthCm: number;
  heightCm: number;
  diameterCm: number;
  customAreaSqCm: number;
  quantity: number;
  unitPrice: number; // price in active currency
  priceUnit: PriceUnit;
  sheetWidthCm?: number;
  sheetHeightCm?: number;
  sheetPrice?: number;
  calculatedAreaSqM: number;
  calculatedCost: number;
  notes?: string;
}

export interface CustomConsumable {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  unit: string; // 'pcs', 'meters', 'grams', 'set'
}

export interface ConsumablesConfig {
  // Copper Foil
  foil: {
    enabled: boolean;
    foilType: string; // 'Black Backed', 'Copper Backed', 'Silver Backed'
    foilWidth: string; // '7/32" (5.5mm)', '3/16" (4.8mm)', '1/4" (6.4mm)', '7/32" Heavy Duty'
    lengthMeters: number;
    rollPrice: number;
    rollLengthMeters: number; // default: 33m
  };
  // Solder (60/40, 50/50, Lead-free)
  solder: {
    enabled: boolean;
    solderRatio: '60/40' | '50/50' | 'Lead-Free 99.3/0.7';
    weightGrams: number;
    spoolPrice: number;
    spoolWeightGrams: number; // default: 500g or 1000g
  };
  // Chemicals
  chemicals: {
    fluxCost: number; // Gel or liquid flux cost share
    patinaType: 'black' | 'copper' | 'none';
    patinaCost: number;
    finishingPolishCost: number; // Carnauba wax / polish
    cleaningSolventCost: number; // Alcohol / detergent / neutralizer
  };
  // Hardware & Reinforcement
  reinforcement: {
    zincCameMeters: number;
    zincCamePricePerMeter: number;
    brassRodsCost: number;
    hangingHooksCount: number;
    hangingHookPrice: number;
    chainMeters: number;
    chainPricePerMeter: number;
  };
  // Custom user items
  customConsumables: CustomConsumable[];
}

export type LaborStageId = 
  | 'design' 
  | 'cutting' 
  | 'grinding' 
  | 'foiling' 
  | 'soldering' 
  | 'finishing' 
  | 'framing' 
  | 'packaging';

export interface LaborStage {
  id: LaborStageId;
  name: string;
  hours: number;
  description?: string;
}

export interface LaborConfig {
  hourlyRate: number;
  stages: LaborStage[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'tool' | 'machine' | 'safety' | 'consumable_tool';
  purchasePrice: number;
  lifespanHours: number; // total expected usable hours (e.g. 2000 hours)
  isElectrical: boolean;
  powerWatts: number; // wattage for electricity calculation
  usageHours: number; // hours used on this project
  enabled: boolean;
  hourlyDepreciation?: number;
}

export interface ElectricityConfig {
  unitRatePerKwh: number; // e.g. 3.25 TRY or 0.28 USD
  customElectricalEquipment: Array<{
    id: string;
    name: string;
    powerWatts: number;
    usageHours: number;
    enabled: boolean;
  }>;
}

export interface MarginRiskConfig {
  wasteRiskPercentage: number; // default: 10%
  wasteCalculationMode: 'glass_and_consumables' | 'entire_base_cost';
  targetProfitMarginPercentage: number; // default: 40%
  vatTaxPercentage: number; // default: 0% or 20%
  discountPercentage: number; // default: 0%
}

export type ProjectStatus = 'draft' | 'quoted' | 'approved' | 'in_progress' | 'completed';
export type ProjectTechnique = 'tiffany' | 'lead_came' | 'mosaic' | 'fused_accent' | 'copper_foil_3d';

export interface ProjectMetadata {
  id: string;
  title: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  projectType: ProjectTechnique;
  dimensions: {
    widthCm: number;
    heightCm: number;
    depthCm?: number;
  };
  pieceCount: number;
  difficulty: 'beginner' | 'intermediate' | 'expert' | 'masterpiece';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  status: ProjectStatus;
  quoteValidUntil?: string;
}

export interface CostBreakdown {
  // Glass
  totalGlassAreaSqM: number;
  totalGlassCost: number;

  // Consumables
  foilCost: number;
  solderCost: number;
  chemicalsCost: number;
  reinforcementCost: number;
  customConsumablesCost: number;
  totalConsumablesCost: number;

  // Labor
  totalLaborHours: number;
  totalLaborCost: number;

  // Equipment Depreciation
  totalEquipmentDepreciationCost: number;

  // Electricity
  totalElectricityKwh: number;
  totalElectricityCost: number;

  // Subtotals & Final Price
  rawBaseCost: number; // Glass + Consumables + Labor + Depreciation + Electricity
  wasteAmount: number;
  costWithWaste: number;
  profitAmount: number;
  subtotalSellingPrice: number; // costWithWaste + profitAmount
  discountAmount: number;
  priceAfterDiscount: number;
  taxAmount: number;
  finalSellingPrice: number;

  // Artisan Studio Analytics
  grossMarginPercentage: number;
  effectiveHourlyYield: number; // (Profit + Labor) / TotalLaborHours
  costPerGlassPiece: number; // finalSellingPrice / pieceCount
  costPerSqM: number; // finalSellingPrice / totalGlassAreaSqM
  materialCostRatio: number; // (Glass + Consumables) / finalSellingPrice * 100
  laborCostRatio: number; // Labor / finalSellingPrice * 100
  overheadCostRatio: number; // (Depr + Elec + Waste) / finalSellingPrice * 100
  profitRatio: number; // Profit / finalSellingPrice * 100
}

export interface VitralisProject {
  metadata: ProjectMetadata;
  glassItems: GlassItem[];
  consumables: ConsumablesConfig;
  labor: LaborConfig;
  equipment: EquipmentItem[];
  electricity: ElectricityConfig;
  marginRisk: MarginRiskConfig;
  breakdown: CostBreakdown;
}
