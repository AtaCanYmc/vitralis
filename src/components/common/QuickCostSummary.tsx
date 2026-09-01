import React from 'react';
import {
  Clock,
  Layers,
  Zap,
  Tag,
  PlusCircle,
  FileCheck,
  Coins,
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
    <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-indigo-500/30 p-5 md:p-6 shadow-2xl shadow-black/40 overflow-hidden">
      {/* Decorative stained glass background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-500/10 via-amber-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        
        {/* Main Final Selling Price Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-5 lg:pb-0 lg:pr-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-[2px] shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Tag className="w-7 h-7" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t.summary.finalPrice}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                +{formatPercent(project.marginRisk.targetProfitMarginPercentage)} Kar
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white tracking-tight mt-0.5 font-mono">
              {formatCurrency(b.finalSellingPrice, activeCurrency)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span>{t.summary.rawBaseCost}: <b className="text-slate-200">{formatCurrency(b.rawBaseCost, activeCurrency)}</b></span>
              <span>•</span>
              <span>Net Kar: <b className="text-emerald-400">+{formatCurrency(b.profitAmount, activeCurrency)}</b></span>
            </div>
          </div>
        </div>

        {/* Breakdown Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 flex-1">
          
          {/* Glass & Consumables */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t.summary.materialCost}</span>
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-100 mt-1 font-mono">
              {formatCurrency(b.totalGlassCost + b.totalConsumablesCost, activeCurrency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Cam: {formatCurrency(b.totalGlassCost, activeCurrency)} | Sarf: {formatCurrency(b.totalConsumablesCost, activeCurrency)}
            </div>
          </div>

          {/* Labor */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t.summary.laborCost}</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-amber-300 mt-1 font-mono">
              {formatCurrency(b.totalLaborCost, activeCurrency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Toplam: {formatHours(b.totalLaborHours)}
            </div>
          </div>

          {/* Equipment & Power */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t.summary.overheadCost}</span>
              <Zap className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-100 mt-1 font-mono">
              {formatCurrency(b.totalEquipmentDepreciationCost + b.totalElectricityCost + b.wasteAmount, activeCurrency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Amortisman + Elektrik + Fire
            </div>
          </div>

          {/* Hourly Studio Yield */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>{t.summary.hourlyYield}</span>
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 font-mono">
              {formatCurrency(b.effectiveHourlyYield, activeCurrency)}/sa
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Parça Başı: {formatCurrency(b.costPerGlassPiece, activeCurrency)}
            </div>
          </div>

        </div>

        {/* Quick View Actions */}
        <div className="flex sm:flex-col justify-end gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('quote')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-950/50 transition-all active:scale-95"
          >
            <FileCheck className="w-4 h-4" />
            <span>Teklifi Aç</span>
          </button>
          
          <button
            onClick={() => createNewProject()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-all"
            title={t.summary.newProject}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.summary.newProject}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
