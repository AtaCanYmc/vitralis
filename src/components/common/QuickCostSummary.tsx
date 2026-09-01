/* Hallmark · component: quick-cost-summary · genre: editorial/atelier · theme: cobalt-atelier · macrostructure: 05-workbench
 * states: default · hover · focus-visible · active
 */

import React from 'react';
import {
  Clock,
  Layers,
  Zap,
  PlusCircle,
  FileCheck,
  Coins,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { formatCurrency, formatHours, formatPercent } from '../../utils/formatters';
import { getTranslation } from '../../i18n';

export const QuickCostSummary: React.FC = () => {
  const { project, createNewProject, setActiveTab } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);
  const b = project.breakdown;

  return (
    <div className="relative rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 md:p-6 shadow-xs dark:shadow-xl overflow-hidden transition-colors duration-200">
      {/* Subtle craftsman hairline accent line at top */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500/80 via-indigo-500/80 to-emerald-500/80" />

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 sm:gap-6">
        
        {/* Main Final Selling Price Ledger Block */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/80 pb-4 lg:pb-0 lg:pr-8 shrink-0">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-amber-500 shrink-0 shadow-xs dark:shadow-inner">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.summary.finalPrice}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                +{formatPercent(project.marginRisk.targetProfitMarginPercentage)} Kar
              </span>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 font-mono truncate">
              {formatCurrency(b.finalSellingPrice, activeCurrency)}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 flex items-center gap-2 font-mono flex-wrap">
              <span>Temel: <b className="text-slate-800 dark:text-slate-200">{formatCurrency(b.rawBaseCost, activeCurrency)}</b></span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>Net Kar: <b className="text-emerald-600 dark:text-emerald-400">+{formatCurrency(b.profitAmount, activeCurrency)}</b></span>
            </div>
          </div>
        </div>

        {/* Breakdown Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          
          {/* Glass & Consumables */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span className="text-[11px] font-medium">{t.summary.materialCost}</span>
              <Layers className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {formatCurrency(b.totalGlassCost + b.totalConsumablesCost, activeCurrency)}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Cam + Sarf Malzeme
            </div>
          </div>

          {/* Labor */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span className="text-[11px] font-medium">{t.summary.laborCost}</span>
              <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-300 mt-1 font-mono">
              {formatCurrency(b.totalLaborCost, activeCurrency)}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Toplam: {formatHours(b.totalLaborHours)}
            </div>
          </div>

          {/* Equipment & Power */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span className="text-[11px] font-medium">{t.summary.overheadCost}</span>
              <Zap className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {formatCurrency(b.totalEquipmentDepreciationCost + b.totalElectricityCost + b.wasteAmount, activeCurrency)}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Amortisman + Elektrik + Fire
            </div>
          </div>

          {/* Hourly Studio Yield */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span className="text-[11px] font-medium">{t.summary.hourlyYield}</span>
              <Coins className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {formatCurrency(b.effectiveHourlyYield, activeCurrency)}/sa
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Parça: {formatCurrency(b.costPerGlassPiece, activeCurrency)}
            </div>
          </div>

        </div>

        {/* Quick View Actions */}
        <div className="flex sm:flex-col justify-end gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('quote')}
            className="tactile-btn flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/30"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Teklif Çıktısı</span>
          </button>
          
          <button
            onClick={() => createNewProject()}
            className="tactile-btn flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            title={t.summary.newProject}
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.summary.newProject}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
