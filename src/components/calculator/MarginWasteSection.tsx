import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Receipt,
  Gift,
  Coins,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { GlassCard } from '../common/GlassCard';
import { NumberInput } from '../common/NumberInput';
import { CustomSelect } from '../common/CustomSelect';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { getTranslation } from '../../i18n';

import type { WasteCalculationMode } from '../../types/project';

interface MarginWasteSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const MarginWasteSection: React.FC<MarginWasteSectionProps> = ({ isExpanded, onToggle }) => {
  const { project, updateMarginRisk } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);
  const { marginRisk } = project;
  const b = project.breakdown;

  return (
    <GlassCard
      title={t.sections.margin}
      subtitle={t.sections.marginDesc}
      icon={<TrendingUp className="w-5 h-5" />}
      glowColor="emerald"
      collapsible={true}
      isExpanded={isExpanded}
      onToggle={onToggle}
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            +{formatPercent(marginRisk.targetProfitMarginPercentage)} Kar
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
            +{formatCurrency(b.profitAmount, activeCurrency)}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Sliders & Percentage Config Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Waste & Glass Breakage Margin */}
          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">{t.margin.wasteRiskTitle}</h4>
              </div>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                {formatPercent(marginRisk.wasteRiskPercentage)}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">{t.margin.wasteRiskHelp}</p>

            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={marginRisk.wasteRiskPercentage}
              onChange={e => updateMarginRisk({ wasteRiskPercentage: parseFloat(e.target.value) || 0 })}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-3">
              <div className="w-48">
                <CustomSelect<WasteCalculationMode>
                  label={t.margin.wasteMode}
                  value={marginRisk.wasteCalculationMode}
                  onChange={val => updateMarginRisk({ wasteCalculationMode: val })}
                  options={[
                    { value: 'glass_and_consumables', label: t.margin.modeMaterialsOnly },
                    { value: 'entire_base_cost', label: t.margin.modeEntireCost },
                  ]}
                  size="xs"
                />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t.margin.wasteAmount}</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                  +{formatCurrency(b.wasteAmount, activeCurrency)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Target Profit Margin */}
          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">{t.margin.profitMarginTitle}</h4>
              </div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatPercent(marginRisk.targetProfitMarginPercentage)}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">{t.margin.profitMarginHelp}</p>

            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={marginRisk.targetProfitMarginPercentage}
              onChange={e => updateMarginRisk({ targetProfitMarginPercentage: parseFloat(e.target.value) || 0 })}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[30, 45, 60, 80].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => updateMarginRisk({ targetProfitMarginPercentage: pct })}
                    className={`tactile-btn px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                      marginRisk.targetProfitMarginPercentage === pct
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    %{pct}
                  </button>
                ))}
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t.margin.profitAmount}</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +{formatCurrency(b.profitAmount, activeCurrency)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Discount & VAT / Tax */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">{t.margin.discountTitle}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Özel müşteri / atölye indirimi</span>
              </div>
            </div>
            <div className="w-24">
              <NumberInput
                value={marginRisk.discountPercentage}
                onChange={val => updateMarginRisk({ discountPercentage: val })}
                min={0}
                max={50}
                step={5}
                suffix="%"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">{t.margin.vatTitle}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Resmi faturalı teklifler için</span>
              </div>
            </div>
            <div className="w-24">
              <NumberInput
                value={marginRisk.vatTaxPercentage}
                onChange={val => updateMarginRisk({ vatTaxPercentage: val })}
                min={0}
                max={30}
                step={1}
                suffix="%"
              />
            </div>
          </div>
        </div>

        {/* Flow Summary Calculation Card */}
        <div className="rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Adım Adım Fiyatlandırma Akışı
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">1. Temel Maliyet</span>
              <span className="font-bold text-slate-900 dark:text-slate-200 font-mono mt-0.5 block">
                {formatCurrency(b.rawBaseCost, activeCurrency)}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 block">+ Fire (%{marginRisk.wasteRiskPercentage})</span>
              <span className="font-bold text-amber-600 dark:text-amber-300 font-mono mt-0.5 block">
                +{formatCurrency(b.wasteAmount, activeCurrency)}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">+ Kar (%{marginRisk.targetProfitMarginPercentage})</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-300 font-mono mt-0.5 block">
                +{formatCurrency(b.profitAmount, activeCurrency)}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-purple-600 dark:text-purple-400 block">
                {b.discountAmount > 0 ? `- İndirim (%${marginRisk.discountPercentage})` : 'İndirim'}
              </span>
              <span className="font-bold text-purple-600 dark:text-purple-300 font-mono mt-0.5 block">
                {b.discountAmount > 0 ? `-${formatCurrency(b.discountAmount, activeCurrency)}` : '0'}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-teal-600 dark:text-teal-400 block">
                {b.taxAmount > 0 ? `+ KDV (%${marginRisk.vatTaxPercentage})` : 'KDV'}
              </span>
              <span className="font-bold text-teal-600 dark:text-teal-300 font-mono mt-0.5 block">
                {b.taxAmount > 0 ? `+${formatCurrency(b.taxAmount, activeCurrency)}` : '0'}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/60 dark:to-purple-900/60 border border-indigo-200 dark:border-indigo-500/40 shadow-sm">
              <span className="text-[10px] text-indigo-700 dark:text-amber-300 font-bold block">Nihai Satış</span>
              <span className="font-black text-indigo-900 dark:text-amber-300 font-mono mt-0.5 block text-sm">
                {formatCurrency(b.finalSellingPrice, activeCurrency)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </GlassCard>
  );
};
