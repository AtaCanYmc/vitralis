import React from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Sparkles,
  Circle,
  Square,
  Maximize2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import type { PriceUnit } from '../../types/project';
import { GlassCard } from '../common/GlassCard';
import { NumberInput } from '../common/NumberInput';
import { formatArea, formatCurrency } from '../../utils/formatters';
import { getTranslation } from '../../i18n';

interface GlassSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

const GLASS_TYPES = [
  'Spectrum Opal',
  'Wissmach Cathedral',
  'Spectrum Waterglass',
  'Spectrum Baroque',
  'Oceanside Art Glass',
  'Lambert Antique Clear',
  'Flotal Silver Mirror',
  'Buzlu / Dokulu Cam',
  'Fasetli Cam (Bevel)',
  'Float Düz Şeffaf (2mm/3mm)',
];

export const GlassSection: React.FC<GlassSectionProps> = ({ isExpanded, onToggle }) => {
  const { project, addGlassItem, updateGlassItem, removeGlassItem } = useProject();
  const { activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);

  const handleAddGlass = () => {
    addGlassItem({
      name: `Vitray Camı #${project.glassItems.length + 1}`,
      type: 'Spectrum Opal',
      color: 'Renkli',
      colorHex: '#f59e0b',
      shape: 'rect',
      widthCm: 25,
      heightCm: 20,
      quantity: 1,
      unitPrice: 2800,
      priceUnit: 'sqm',
    });
  };

  return (
    <GlassCard
      title={t.sections.glass}
      subtitle={t.sections.glassDesc}
      icon={<Layers className="w-5 h-5" />}
      glowColor="indigo"
      collapsible={true}
      isExpanded={isExpanded}
      onToggle={onToggle}
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            {project.glassItems.length} Çeşit Cam
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-xs font-mono font-bold">
            {formatCurrency(project.breakdown.totalGlassCost, activeCurrency)}
          </span>
        </div>
      }
      headerAction={
        <button
          onClick={handleAddGlass}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.glass.addGlass}</span>
        </button>
      }
    >
      {/* Glass Items Table / Cards */}
      {project.glassItems.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm font-medium">{t.glass.emptyList}</p>
          <button
            onClick={handleAddGlass}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
          >
            {t.glass.addGlass}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {project.glassItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700/80 p-4 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
                
                {/* 1. Name, Color & Type (Col 4) */}
                <div className="md:col-span-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative group shrink-0">
                      <input
                        type="color"
                        value={item.colorHex || '#f59e0b'}
                        onChange={e => updateGlassItem(item.id, { colorHex: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                        title="Renk Seç"
                      />
                    </div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={e => updateGlassItem(item.id, { name: e.target.value })}
                      placeholder={t.glass.itemName}
                      className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={item.type}
                      onChange={e => updateGlassItem(item.id, { type: e.target.value })}
                      className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-2 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                      {GLASS_TYPES.map(gt => (
                        <option key={gt} value={gt} className="bg-slate-900 text-slate-100">
                          {gt}
                        </option>
                      ))}
                    </select>

                    {/* Shape Selector */}
                    <div className="flex rounded-xl bg-slate-900/80 border border-slate-700/60 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateGlassItem(item.id, { shape: 'rect' })}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${
                          item.shape === 'rect' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Dikdörtgen"
                      >
                        <Square className="w-3 h-3" />
                        <span>Kare</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateGlassItem(item.id, { shape: 'circle' })}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${
                          item.shape === 'circle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Daire"
                      >
                        <Circle className="w-3 h-3" />
                        <span>Daire</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateGlassItem(item.id, { shape: 'custom_area' })}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${
                          item.shape === 'custom_area' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Özel Alan"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>cm²</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Dimensions & Quantity (Col 4) */}
                <div className="md:col-span-4">
                  <div className="grid grid-cols-3 gap-2">
                    {item.shape === 'rect' && (
                      <>
                        <NumberInput
                          label="En (cm)"
                          value={item.widthCm}
                          onChange={val => updateGlassItem(item.id, { widthCm: val })}
                          min={0.1}
                          step={1}
                        />
                        <NumberInput
                          label="Boy (cm)"
                          value={item.heightCm}
                          onChange={val => updateGlassItem(item.id, { heightCm: val })}
                          min={0.1}
                          step={1}
                        />
                      </>
                    )}

                    {item.shape === 'circle' && (
                      <div className="col-span-2">
                        <NumberInput
                          label="Çap (cm)"
                          value={item.diameterCm}
                          onChange={val => updateGlassItem(item.id, { diameterCm: val })}
                          min={0.1}
                          step={1}
                        />
                      </div>
                    )}

                    {item.shape === 'custom_area' && (
                      <div className="col-span-2">
                        <NumberInput
                          label="Özel Alan (cm²)"
                          value={item.customAreaSqCm}
                          onChange={val => updateGlassItem(item.id, { customAreaSqCm: val })}
                          min={0.1}
                          step={10}
                        />
                      </div>
                    )}

                    <NumberInput
                      label={t.glass.quantity}
                      value={item.quantity}
                      onChange={val => updateGlassItem(item.id, { quantity: val })}
                      min={1}
                      step={1}
                    />
                  </div>
                </div>

                {/* 3. Unit Price & Subtotal (Col 4) */}
                <div className="md:col-span-4 flex items-end justify-between gap-3">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <NumberInput
                      label={t.glass.unitPrice}
                      value={item.unitPrice}
                      onChange={val => updateGlassItem(item.id, { unitPrice: val })}
                      min={0}
                      step={50}
                      prefix={activeCurrency.symbol}
                    />

                    <div>
                      <label className="text-xs font-semibold text-slate-300 mb-1 block">
                        Birim
                      </label>
                      <select
                        value={item.priceUnit}
                        onChange={e => updateGlassItem(item.id, { priceUnit: e.target.value as PriceUnit })}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="sqm">/ m²</option>
                        <option value="sqcm">/ cm²</option>
                        <option value="sheet">/ Plaka</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated Subtotal & Delete */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatArea(item.calculatedAreaSqM)}
                    </span>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      {formatCurrency(item.calculatedCost, activeCurrency)}
                    </span>
                    <button
                      onClick={() => removeGlassItem(item.id)}
                      className="mt-1 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}

          {/* Glass Totals Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-xs text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Toplam Cam Alanı: <b className="text-white">{formatArea(project.breakdown.totalGlassAreaSqM)}</b></span>
              <span>({(project.breakdown.totalGlassAreaSqM * 10000).toLocaleString('tr-TR')} cm²)</span>
            </div>

            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-slate-400 font-normal text-xs">{t.glass.totalCost}:</span>
              <span className="text-amber-400 text-base font-mono">
                {formatCurrency(project.breakdown.totalGlassCost, activeCurrency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
