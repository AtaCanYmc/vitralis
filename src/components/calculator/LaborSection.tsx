import React from 'react';
import {
  Clock,
  Palette,
  Scissors,
  Flame,
  Shield,
  PackageCheck,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { GlassCard } from '../common/GlassCard';
import { NumberInput } from '../common/NumberInput';
import { formatCurrency, formatHours } from '../../utils/formatters';
import { getTranslation } from '../../i18n';
import type { LaborStageId } from '../../types/project';

interface LaborSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const LaborSection: React.FC<LaborSectionProps> = ({ isExpanded, onToggle }) => {
  const { project, updateLaborConfig, updateLaborStageHours } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);
  const { labor } = project;
  const b = project.breakdown;

  const stageIcons: Record<LaborStageId, React.ReactNode> = {
    design: <Palette className="w-4 h-4 text-purple-400" />,
    cutting: <Scissors className="w-4 h-4 text-rose-400" />,
    grinding: <RotateCw className="w-4 h-4 text-amber-400" />,
    foiling: <Flame className="w-4 h-4 text-orange-400" />,
    soldering: <Flame className="w-4 h-4 text-sky-400" />,
    finishing: <Sparkles className="w-4 h-4 text-emerald-400" />,
    framing: <Shield className="w-4 h-4 text-indigo-400" />,
    packaging: <PackageCheck className="w-4 h-4 text-teal-400" />,
  };

  return (
    <GlassCard
      title={t.sections.labor}
      subtitle={t.sections.laborDesc}
      icon={<Clock className="w-5 h-5" />}
      glowColor="amber"
      collapsible={true}
      isExpanded={isExpanded}
      onToggle={onToggle}
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            {formatHours(b.totalLaborHours)}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-xs font-mono font-bold">
            {formatCurrency(b.totalLaborCost, activeCurrency)}
          </span>
        </div>
      }
      headerAction={
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Saat Ücreti:</span>
          <div className="w-28">
            <NumberInput
              value={labor.hourlyRate}
              onChange={val => updateLaborConfig({ hourlyRate: val })}
              min={0}
              step={25}
              prefix={activeCurrency.symbol}
            />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        
        {/* Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {labor.stages.map(stage => (
            <div
              key={stage.id}
              className="rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 p-3.5 flex flex-col justify-between transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {stageIcons[stage.id] || <Clock className="w-4 h-4 text-slate-400" />}
                  </div>
                  <span className="text-xs font-bold text-slate-200 line-clamp-1" title={stage.name}>
                    {stage.name}
                  </span>
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={stage.hours}
                    onChange={val => updateLaborStageHours(stage.id, val)}
                    min={0}
                    step={0.25}
                    suffix="sa"
                  />
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-amber-400 font-mono block">
                    {formatCurrency(stage.hours * labor.hourlyRate, activeCurrency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Labor Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20">
          <div className="flex items-center gap-3 text-xs text-amber-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>
              Toplam İşçilik: <b className="text-white">{formatHours(b.totalLaborHours)}</b>
            </span>
            <span>(Saatlik: {formatCurrency(labor.hourlyRate, activeCurrency)})</span>
          </div>

          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-slate-400 font-normal text-xs">{t.labor.totalLaborCost}:</span>
            <span className="text-amber-400 text-base font-mono">
              {formatCurrency(b.totalLaborCost, activeCurrency)}
            </span>
          </div>
        </div>

      </div>
    </GlassCard>
  );
};
