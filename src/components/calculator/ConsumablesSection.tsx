import React from 'react';
import {
  Package,
  Plus,
  Trash2,
  ShieldCheck,
  Droplets,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { GlassCard } from '../common/GlassCard';
import { NumberInput } from '../common/NumberInput';
import { formatCurrency } from '../../utils/formatters';
import { getTranslation } from '../../i18n';

interface ConsumablesSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const ConsumablesSection: React.FC<ConsumablesSectionProps> = ({ isExpanded, onToggle }) => {
  const {
    project,
    updateFoil,
    updateSolder,
    updateChemicals,
    updateReinforcement,
    addCustomConsumable,
    updateCustomConsumable,
    removeCustomConsumable,
  } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);
  const { foil, solder, chemicals, reinforcement, customConsumables } = project.consumables;
  const b = project.breakdown;

  const handleAddCustom = () => {
    addCustomConsumable({
      id: `custom-${Date.now()}`,
      name: 'Özel Montaj Parçası / Taban',
      quantity: 1,
      unitCost: 50,
      unit: 'adet',
    });
  };

  return (
    <GlassCard
      title={t.sections.consumables}
      subtitle={t.sections.consumablesDesc}
      icon={<Package className="w-5 h-5" />}
      glowColor="amber"
      collapsible={true}
      isExpanded={isExpanded}
      onToggle={onToggle}
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            Folyo + Lehim + Kimya
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-xs font-mono font-bold">
            {formatCurrency(b.totalConsumablesCost, activeCurrency)}
          </span>
        </div>
      }
    >
      <div className="space-y-5">
        
        {/* Row 1: Copper Foil & Stained Glass Solder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Copper Foil Card */}
          <div className="rounded-2xl bg-slate-950/50 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                <h4 className="font-bold text-sm text-slate-100">{t.consumables.foilTitle}</h4>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={foil.enabled}
                  onChange={e => updateFoil({ enabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Kullan</span>
              </label>
            </div>

            {foil.enabled && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      {t.consumables.foilType}
                    </label>
                    <select
                      value={foil.foilType}
                      onChange={e => updateFoil({ foilType: e.target.value })}
                      className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Black Backed">Siyah Tabanlı (Black)</option>
                      <option value="Copper Backed">Bakır Tabanlı (Copper)</option>
                      <option value="Silver Backed">Gümüş Tabanlı (Silver)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">
                      {t.consumables.foilWidth}
                    </label>
                    <select
                      value={foil.foilWidth}
                      onChange={e => updateFoil({ foilWidth: e.target.value })}
                      className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="7/32&quot; (5.5mm)">7/32" (5.5mm) - Standart</option>
                      <option value="3/16&quot; (4.8mm)">3/16" (4.8mm) - İnce</option>
                      <option value="1/4&quot; (6.4mm)">1/4" (6.4mm) - Kalın</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <NumberInput
                    label={t.consumables.usedLength}
                    value={foil.lengthMeters}
                    onChange={val => updateFoil({ lengthMeters: val })}
                    min={0}
                    step={0.5}
                    suffix="m"
                  />
                  <NumberInput
                    label={t.consumables.rollPrice}
                    value={foil.rollPrice}
                    onChange={val => updateFoil({ rollPrice: val })}
                    min={0}
                    step={10}
                    prefix={activeCurrency.symbol}
                  />
                  <NumberInput
                    label={t.consumables.rollLength}
                    value={foil.rollLengthMeters}
                    onChange={val => updateFoil({ rollLengthMeters: val })}
                    min={1}
                    step={1}
                    suffix="m"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Folyo Toplamı:</span>
                  <span className="font-bold text-amber-300 font-mono">
                    {formatCurrency(b.foilCost, activeCurrency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Solder Card */}
          <div className="rounded-2xl bg-slate-950/50 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400 shadow-sm shadow-slate-400/50" />
                <h4 className="font-bold text-sm text-slate-100">{t.consumables.solderTitle}</h4>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={solder.enabled}
                  onChange={e => updateSolder({ enabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Kullan</span>
              </label>
            </div>

            {solder.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    {t.consumables.solderRatio}
                  </label>
                  <select
                    value={solder.solderRatio}
                    onChange={e => updateSolder({ solderRatio: e.target.value as any })}
                    className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="60/40">60/40 Kalay-Kurşun (Tiffany Standart Parlak)</option>
                    <option value="50/50">50/50 Kalay-Kurşun (Kurşunlu Vitray)</option>
                    <option value="Lead-Free 99.3/0.7">Kurşunsuz (Lead-Free / Güvenli)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <NumberInput
                    label={t.consumables.usedGrams}
                    value={solder.weightGrams}
                    onChange={val => updateSolder({ weightGrams: val })}
                    min={0}
                    step={10}
                    suffix="gr"
                  />
                  <NumberInput
                    label={t.consumables.spoolPrice}
                    value={solder.spoolPrice}
                    onChange={val => updateSolder({ spoolPrice: val })}
                    min={0}
                    step={25}
                    prefix={activeCurrency.symbol}
                  />
                  <NumberInput
                    label={t.consumables.spoolGrams}
                    value={solder.spoolWeightGrams}
                    onChange={val => updateSolder({ spoolWeightGrams: val })}
                    min={100}
                    step={100}
                    suffix="gr"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Lehim Toplamı:</span>
                  <span className="font-bold text-slate-200 font-mono">
                    {formatCurrency(b.solderCost, activeCurrency)}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Row 2: Chemicals & Hardware Reinforcement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 3. Chemicals Card */}
          <div className="rounded-2xl bg-slate-950/50 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Droplets className="w-4 h-4 text-sky-400" />
              <h4 className="font-bold text-sm text-slate-100">{t.consumables.chemicalsTitle}</h4>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <NumberInput
                label={t.consumables.fluxCost}
                value={chemicals.fluxCost}
                onChange={val => updateChemicals({ fluxCost: val })}
                min={0}
                step={5}
                prefix={activeCurrency.symbol}
              />

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  {t.consumables.patinaType}
                </label>
                <select
                  value={chemicals.patinaType}
                  onChange={e => updateChemicals({ patinaType: e.target.value as any })}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="black">{t.consumables.patinaBlack}</option>
                  <option value="copper">{t.consumables.patinaCopper}</option>
                  <option value="none">{t.consumables.patinaNone}</option>
                </select>
              </div>

              {chemicals.patinaType !== 'none' && (
                <NumberInput
                  label={t.consumables.patinaCost}
                  value={chemicals.patinaCost}
                  onChange={val => updateChemicals({ patinaCost: val })}
                  min={0}
                  step={5}
                  prefix={activeCurrency.symbol}
                />
              )}

              <NumberInput
                label={t.consumables.polishCost}
                value={chemicals.finishingPolishCost}
                onChange={val => updateChemicals({ finishingPolishCost: val })}
                min={0}
                step={5}
                prefix={activeCurrency.symbol}
              />

              <NumberInput
                label={t.consumables.cleaningCost}
                value={chemicals.cleaningSolventCost}
                onChange={val => updateChemicals({ cleaningSolventCost: val })}
                min={0}
                step={5}
                prefix={activeCurrency.symbol}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">Kimyasallar Toplamı:</span>
              <span className="font-bold text-sky-300 font-mono">
                {formatCurrency(b.chemicalsCost, activeCurrency)}
              </span>
            </div>
          </div>

          {/* 4. Came & Hardware Card */}
          <div className="rounded-2xl bg-slate-950/50 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-slate-100">{t.consumables.reinforcementTitle}</h4>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <NumberInput
                label={t.consumables.zincCameMeters}
                value={reinforcement.zincCameMeters}
                onChange={val => updateReinforcement({ zincCameMeters: val })}
                min={0}
                step={0.5}
                suffix="m"
              />
              <NumberInput
                label={t.consumables.zincCamePrice}
                value={reinforcement.zincCamePricePerMeter}
                onChange={val => updateReinforcement({ zincCamePricePerMeter: val })}
                min={0}
                step={5}
                prefix={activeCurrency.symbol}
              />

              <NumberInput
                label={t.consumables.hangingHooks}
                value={reinforcement.hangingHooksCount}
                onChange={val => updateReinforcement({ hangingHooksCount: val })}
                min={0}
                step={1}
                suffix="adet"
              />
              <NumberInput
                label={t.consumables.hookPrice}
                value={reinforcement.hangingHookPrice}
                onChange={val => updateReinforcement({ hangingHookPrice: val })}
                min={0}
                step={5}
                prefix={activeCurrency.symbol}
              />

              <NumberInput
                label={t.consumables.chainMeters}
                value={reinforcement.chainMeters}
                onChange={val => updateReinforcement({ chainMeters: val })}
                min={0}
                step={0.2}
                suffix="m"
              />
              <NumberInput
                label={t.consumables.chainPrice}
                value={reinforcement.chainPricePerMeter}
                onChange={val => updateReinforcement({ chainPricePerMeter: val })}
                min={0}
                step={5}
                prefix={activeCurrency.symbol}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">Donanım Toplamı:</span>
              <span className="font-bold text-emerald-300 font-mono">
                {formatCurrency(b.reinforcementCost, activeCurrency)}
              </span>
            </div>
          </div>

        </div>

        {/* Row 3: Custom Extra Consumables */}
        <div className="rounded-2xl bg-slate-950/50 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-sm text-slate-100">{t.consumables.customTitle}</h4>
            </div>
            <button
              onClick={handleAddCustom}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.consumables.addCustom}</span>
            </button>
          </div>

          {(!customConsumables || customConsumables.length === 0) ? (
            <p className="text-xs text-slate-500 py-2">
              İsteğe bağlı: Ahşap abajur tabanı, cam kabaşonlar, pirinç örümcek kollar veya özel sandık gibi ekstra malzemeler ekleyebilirsiniz.
            </p>
          ) : (
            <div className="space-y-2">
              {customConsumables.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.name}
                      onChange={e => updateCustomConsumable(item.id, { name: e.target.value })}
                      placeholder="Malzeme Adı"
                      className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <NumberInput
                      value={item.quantity}
                      onChange={val => updateCustomConsumable(item.id, { quantity: val })}
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="col-span-3">
                    <NumberInput
                      value={item.unitCost}
                      onChange={val => updateCustomConsumable(item.id, { unitCost: val })}
                      min={0}
                      step={10}
                      prefix={activeCurrency.symbol}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 font-mono">
                      {formatCurrency(item.quantity * item.unitCost, activeCurrency)}
                    </span>
                    <button
                      onClick={() => removeCustomConsumable(item.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </GlassCard>
  );
};
