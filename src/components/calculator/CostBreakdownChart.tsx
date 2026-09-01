import React from 'react';
import {
  PieChart as PieIcon,
  TrendingUp,
  Layers,
  Coins,
  Award,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { getTranslation } from '../../i18n';

interface CostBreakdownChartProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ isExpanded, onToggle }) => {
  const { project } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);
  const b = project.breakdown;

  const segments = [
    {
      name: 'Cam Malzemesi',
      amount: b.totalGlassCost,
      color: '#6366f1',
      bgClass: 'bg-indigo-500',
      textClass: 'text-indigo-400',
    },
    {
      name: 'Sarf Malzeme (Folyo/Lehim/Kimya)',
      amount: b.totalConsumablesCost,
      color: '#06b6d4',
      bgClass: 'bg-cyan-500',
      textClass: 'text-cyan-400',
    },
    {
      name: 'Usta İşçiliği',
      amount: b.totalLaborCost,
      color: '#f59e0b',
      bgClass: 'bg-amber-500',
      textClass: 'text-amber-400',
    },
    {
      name: 'Ekipman Amortismanı',
      amount: b.totalEquipmentDepreciationCost,
      color: '#38bdf8',
      bgClass: 'bg-sky-400',
      textClass: 'text-sky-400',
    },
    {
      name: 'Elektrik & Enerji',
      amount: b.totalElectricityCost,
      color: '#f43f5e',
      bgClass: 'bg-rose-500',
      textClass: 'text-rose-400',
    },
    {
      name: 'Fire & Risk Payı',
      amount: b.wasteAmount,
      color: '#a855f7',
      bgClass: 'bg-purple-500',
      textClass: 'text-purple-400',
    },
    {
      name: 'Hedef Net Kar',
      amount: b.profitAmount,
      color: '#10b981',
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-400',
    },
  ];

  const totalAmount = b.finalSellingPrice || 1;

  let cumulativePercent = 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  return (
    <GlassCard
      title={t.sections.visualBreakdown}
      subtitle="Projenin maliyet dağılımı ve atölye performans göstergeleri"
      icon={<PieIcon className="w-5 h-5" />}
      glowColor="purple"
      collapsible={true}
      isExpanded={isExpanded}
      onToggle={onToggle}
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
            %{b.grossMarginPercentage} Brüt Marj
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-purple-300 border border-slate-700 text-xs font-mono font-bold">
            {formatCurrency(b.effectiveHourlyYield, activeCurrency)}/sa
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: SVG Donut Chart (Col 5) */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
          <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#1e293b"
                strokeWidth="20"
              />
              {segments.map((seg, idx) => {
                const segPercent = (seg.amount / totalAmount) * 100;
                if (segPercent <= 0) return null;

                const strokeDasharray = `${(segPercent * circumference) / 100} ${circumference}`;
                const strokeDashoffset = -((cumulativePercent * circumference) / 100);
                cumulativePercent += segPercent;

                return (
                  <circle
                    key={idx}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 hover:opacity-80"
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Kar Oranı</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {formatPercent(b.profitRatio)}
              </span>
              <span className="text-[9px] text-slate-500">Satış İçinde</span>
            </div>
          </div>

          {/* Quick Segment Legend */}
          <div className="space-y-1.5 w-full text-xs">
            {segments.map((seg, idx) => {
              const pct = (seg.amount / totalAmount) * 100;
              return (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className={`w-2.5 h-2.5 rounded-full ${seg.bgClass} shrink-0`} />
                    <span className="text-slate-300 truncate text-[11px]">{seg.name}</span>
                  </div>
                  <span className="font-mono text-slate-200 font-semibold shrink-0 text-[11px]">
                    %{pct.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Key Performance Indicators (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Proportional Cost Breakdown Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Maliyet & Kar Paylaşımı</span>
              <span className="text-emerald-400">Toplam: {formatCurrency(b.finalSellingPrice, activeCurrency)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex">
              <div
                style={{ width: `${b.materialCostRatio}%` }}
                className="bg-indigo-500 h-full transition-all"
                title={`Malzeme: %${b.materialCostRatio}`}
              />
              <div
                style={{ width: `${b.laborCostRatio}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`İşçilik: %${b.laborCostRatio}`}
              />
              <div
                style={{ width: `${b.overheadCostRatio}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Giderler & Fire: %${b.overheadCostRatio}`}
              />
              <div
                style={{ width: `${b.profitRatio}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Kar: %${b.profitRatio}`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-indigo-500" /> Malzeme (%{b.materialCostRatio})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-amber-500" /> İşçilik (%{b.laborCostRatio})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-rose-500" /> Gider & Fire (%{b.overheadCostRatio})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-emerald-500" /> Net Kar (%{b.profitRatio})
              </span>
            </div>
          </div>

          {/* 4 Performance Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2">
            
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Brüt Kar Marjı</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                {formatPercent(b.grossMarginPercentage)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                (Kar Tutarı ÷ Satış Fiyatı)
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Saatlik Atölye Getirisi</span>
                <Coins className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-amber-300 font-mono mt-1">
                {formatCurrency(b.effectiveHourlyYield, activeCurrency)}/sa
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                (İşçilik + Kar Payı ÷ Saat)
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Parça Başı Maliyet</span>
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-lg font-bold text-indigo-300 font-mono mt-1">
                {formatCurrency(b.costPerGlassPiece, activeCurrency)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {project.metadata.pieceCount} cam parçası bazında
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>m² Başı Fiyat</span>
                <Award className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-lg font-bold text-sky-300 font-mono mt-1">
                {formatCurrency(b.costPerSqM, activeCurrency)}/m²
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Mimari & Vitray Panel Birim Değeri
              </div>
            </div>

          </div>

        </div>

      </div>
    </GlassCard>
  );
};
