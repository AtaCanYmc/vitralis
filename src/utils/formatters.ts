import type { CurrencyConfig } from '../types/studio';

export function formatCurrency(amount: number, currency: CurrencyConfig): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formattedNumber = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: currency.decimalDigits,
    maximumFractionDigits: currency.decimalDigits,
  }).format(safeAmount);

  if (currency.position === 'before') {
    return `${currency.symbol}${formattedNumber}`;
  }
  return `${formattedNumber} ${currency.symbol}`;
}

export function formatArea(areaSqM: number, unit: 'sqm' | 'sqcm' = 'sqm'): string {
  if (unit === 'sqcm') {
    const sqCm = areaSqM * 10000;
    return `${sqCm.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} cm²`;
  }
  return `${areaSqM.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} m²`;
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg`;
  }
  return `${grams.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} gr`;
}

export function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes} dk`;
  }
  if (minutes === 0) {
    return `${wholeHours} sa`;
  }
  return `${wholeHours} sa ${minutes} dk`;
}

export function formatPercent(value: number): string {
  return `%${Number(value || 0).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`;
}
