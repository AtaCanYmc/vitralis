import React from 'react';
import {
  Zap,
  Plus,
  Trash2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { GlassCard } from '../common/GlassCard';
import { NumberInput } from '../common/NumberInput';
import { formatCurrency } from '../../utils/formatters';
import { getTranslation } from '../../i18n';

interface ElectricitySectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const ElectricitySection: React.FC<ElectricitySectionProps> = ({ isExpanded, onToggle }) => {
  const {
    project,
    updateElectricityConfig,
    addCustomElectricalDevice,
    updateCustomElectricalDevice,
    removeCustomElectricalDevice,
  } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);
  const { electricity, equipment } = project;
  const b = project.breakdown;

  const electricalEquipment = equipment.filter(e => e.enabled && e.isElectrical);

  const handleAddCustomDevice = () => {
    addCustomElectricalDevice({
      id: `elec-${Date.now()}`,
      name: 'Özel Elektrikli Cihaz (Örn: Isıtıcı / Ultrasonik)',
      powerWatts: 500,
      usageHours: 1.0,
      enabled: true,
    });
  };

  return (
    <GlassCard
      title={t.sections.electricity}
      subtitle={t.sections.electricityDesc}
      icon={<Zap className="w-5 h-5" />}
      glowColor="amber"
      collapsible={true}
      isExpanded={isExpanded}
      onToggle={onToggle}
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold">
            {b.totalElectricityKwh} kWh
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-300 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
            {formatCurrency(b.totalElectricityCost, activeCurrency)}
          </span>
        </div>
      }
      headerAction={
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">{t.electricity.kwhRate}:</span>
          <div className="w-28">
            <NumberInput
              value={electricity.unitRatePerKwh}
              onChange={val => updateElectricityConfig({ unitRatePerKwh: val })}
              min={0}
              step={0.1}
              prefix={activeCurrency.symbol}
            />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        
        {/* Electrical Devices Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {electricalEquipment.map(item => {
            const kwh = (item.powerWatts * (item.usageHours || 0)) / 1000;
            const cost = kwh * electricity.unitRatePerKwh;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">{item.name}</span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5 inline-block">
                      {item.powerWatts} Watt • {item.usageHours} sa
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">{kwh.toFixed(3)} kWh</span>
                  <span className="font-bold text-slate-900 dark:text-amber-400">
                    {formatCurrency(cost, activeCurrency)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Custom Electrical Devices */}
          {electricity.customElectricalEquipment?.map(device => {
            const kwh = (device.powerWatts * (device.usageHours || 0)) / 1000;
            const cost = kwh * electricity.unitRatePerKwh;

            return (
              <div
                key={device.id}
                className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={device.name}
                      onChange={e => updateCustomElectricalDevice(device.id, { name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-slate-100 font-semibold"
                    />
                    <button
                      onClick={() => removeCustomElectricalDevice(device.id)}
                      className="tactile-btn p-1 text-slate-400 hover:text-rose-500 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput
                      label="Watt"
                      value={device.powerWatts}
                      onChange={val => updateCustomElectricalDevice(device.id, { powerWatts: val })}
                      min={0}
                      step={50}
                    />
                    <NumberInput
                      label="Saat"
                      value={device.usageHours}
                      onChange={val => updateCustomElectricalDevice(device.id, { usageHours: val })}
                      min={0}
                      step={0.5}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">{kwh.toFixed(3)} kWh</span>
                  <span className="font-bold text-slate-900 dark:text-amber-400">
                    {formatCurrency(cost, activeCurrency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Custom Electrical Device Button */}
        <button
          onClick={handleAddCustomDevice}
          className="tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-amber-500" />
          <span>Ekstra Elektrikli Cihaz Ekle</span>
        </button>

        {/* Electricity Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300">
            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>
              Toplam Enerji: <b className="text-slate-900 dark:text-white font-mono">{b.totalElectricityKwh} kWh</b> (kWh Başı: {formatCurrency(electricity.unitRatePerKwh, activeCurrency)})
            </span>
          </div>

          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-normal text-xs">{t.electricity.totalCost}:</span>
            <span className="text-amber-700 dark:text-amber-400 text-base font-mono font-bold">
              {formatCurrency(b.totalElectricityCost, activeCurrency)}
            </span>
          </div>
        </div>

      </div>
    </GlassCard>
  );
};
