import type { EquipmentItem } from './project';

export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'CHF';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimalDigits: number;
  position: 'before' | 'after';
}

export interface StudioProfile {
  studioName: string;
  artisanName: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  taxNumber?: string;
  quoteHeaderNotes: string;
  quoteTermsConditions: string;
  careInstructions: string;
  logoBase64?: string;
}

export interface StudioDefaults {
  currency: CurrencyCode;
  language: 'tr' | 'en';
  theme: 'dark' | 'light';
  hourlyRate: number;
  electricityKwhRate: number;
  defaultWasteRiskPercentage: number;
  defaultProfitMarginPercentage: number;
  defaultVatPercentage: number;
  // Standard prices
  defaultFoilPrice: number; // e.g. 280 TL / $14 per 33m roll
  defaultFoilLengthMeters: number; // 33
  defaultSolderPrice: number; // e.g. 850 TL / $28 per 500g spool
  defaultSolderSpoolGrams: number; // 500
  defaultZincCamePricePerMeter: number;
  defaultHangingHookPrice: number;
  defaultChainPricePerMeter: number;
  defaultFluxCost: number;
  defaultPatinaCost: number;
  defaultPolishCost: number;
  // Default workshop equipment list
  defaultEquipment: EquipmentItem[];
}

export interface StudioContextState {
  profile: StudioProfile;
  defaults: StudioDefaults;
  activeCurrency: CurrencyConfig;
  updateProfile: (profile: Partial<StudioProfile>) => void;
  updateDefaults: (defaults: Partial<StudioDefaults>) => void;
  setLanguage: (lang: 'tr' | 'en') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCurrency: (currency: CurrencyCode) => void;
  resetToFactoryDefaults: () => void;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

