import React from 'react';
import {
  Wrench,
  Plus,
  Trash2,
  Cpu,
  Zap,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { GlassCard } from '../common/GlassCard';
import { NumberInput } from '../common/NumberInput';
import { formatCurrency } from '../../utils/formatters';
import { getTranslation } from '../../i18n';

interface EquipmentSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({ isExpanded, onToggle }) => {
  const {
    project,
    updateEquipmentItem,
    addEquipmentItem,
    removeEquipmentItem,
  } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);
  const b = project.breakdown;

  const handleAddEquipment = () => {
    addEquipmentItem({
      id: `eq-${Date.now()}`,
      name: 'Özel Atölye Ekipmanı',
      category: 'tool',
      purchasePrice: 1500,
      lifespanHours: 2000,
      isElectrical: false,
      powerWatts: 0,
      usageHours: 1.0,
      enabled: true,
    });
  };

  return (
    <GlassCard
      title={t.sections.equipment}
      subtitle={t.sections.equipmentDesc}
      icon={<Wrench className="w-5 h-5" />}
      glowColor="sky"
      collapsible={true}
      isExpanded={isExpanded}
      onToggle={onToggle}
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-xs font-semibold">
            {project.equipment.filter(e => e.enabled).length} Cihaz
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-sky-300 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
            {formatCurrency(b.totalEquipmentDepreciationCost, activeCurrency)}
          </span>
        </div>
      }
      headerAction={
        <button
          onClick={handleAddEquipment}
          className="tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.equipment.addEquipment}</span>
        </button>
      }
    >
      <div className="space-y-4">
        
        {/* Equipment Items Grid */}
        <div className="space-y-3">
          {project.equipment.map(item => {
            const hourlyRate = item.lifespanHours > 0 ? item.purchasePrice / item.lifespanHours : 0;
            const itemTotal = hourlyRate * (item.usageHours || 0);

            return (
              <div
                key={item.id}
                className={`rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border p-3.5 transition-all ${
                  item.enabled
                    ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    : 'border-slate-200 dark:border-slate-900 opacity-60'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  
                  {/* Item Name & Status (Col 4) */}
                  <div className="md:col-span-4 flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={e => updateEquipmentItem(item.id, { enabled: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateEquipmentItem(item.id, { name: e.target.value })}
                        disabled={!item.enabled}
                        className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-sky-500"
                      />
                      <div className="flex items-center gap-2 mt-1">
                        {item.isElectrical && (
                          <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-0.5 font-mono">
                            <Zap className="w-3 h-3" /> {item.powerWatts}W
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {t.equipment.hourlyWear}: <b className="text-slate-800 dark:text-slate-300">{formatCurrency(hourlyRate, activeCurrency)}/sa</b>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Purchase & Lifespan Inputs (Col 4) */}
                  <div className="md:col-span-4 grid grid-cols-2 gap-2">
                    <NumberInput
                      label={t.equipment.purchasePrice}
                      value={item.purchasePrice}
                      onChange={val => updateEquipmentItem(item.id, { purchasePrice: val })}
                      min={0}
                      step={50}
                      prefix={activeCurrency.symbol}
                      disabled={!item.enabled}
                    />
                    <NumberInput
                      label={t.equipment.lifespanHours}
                      value={item.lifespanHours}
                      onChange={val => updateEquipmentItem(item.id, { lifespanHours: val })}
                      min={10}
                      step={100}
                      suffix="sa"
                      disabled={!item.enabled}
                    />
                  </div>

                  {/* Usage Hours & Calculated Depreciation (Col 4) */}
                  <div className="md:col-span-4 flex items-end justify-between gap-3">
                    <div className="flex-1">
                      <NumberInput
                        label={t.equipment.usageHours}
                        value={item.usageHours}
                        onChange={val => updateEquipmentItem(item.id, { usageHours: val })}
                        min={0}
                        step={0.25}
                        suffix="sa"
                        disabled={!item.enabled}
                      />
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t.equipment.itemDepreciation}</span>
                      <span className="text-sm font-bold text-sky-700 dark:text-sky-400 font-mono">
                        {item.enabled ? formatCurrency(itemTotal, activeCurrency) : '-'}
                      </span>
                      <button
                        onClick={() => removeEquipmentItem(item.id)}
                        className="tactile-btn mt-1 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors ml-auto block"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Equipment Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-500/20">
          <div className="flex items-center gap-2 text-xs text-sky-900 dark:text-sky-300">
            <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Ekipman Yıpranma Formülü: <b className="text-slate-900 dark:text-white font-mono">(Bedel ÷ Ömür) × Çalışma Saati</b></span>
          </div>

          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-normal text-xs">{t.equipment.totalDepreciation}:</span>
            <span className="text-sky-700 dark:text-sky-400 text-base font-mono font-bold">
              {formatCurrency(b.totalEquipmentDepreciationCost, activeCurrency)}
            </span>
          </div>
        </div>

      </div>
    </GlassCard>
  );
};
