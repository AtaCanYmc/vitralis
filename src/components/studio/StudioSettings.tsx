import React, { useState } from 'react';
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { GlassCard } from '../common/GlassCard';
import { NumberInput } from '../common/NumberInput';
import { CURRENCIES } from '../../constants/defaults';
import type { CurrencyCode } from '../../types/studio';
import { getTranslation } from '../../i18n';

export const StudioSettings: React.FC = () => {
  const { profile, defaults, updateProfile, updateDefaults, setCurrency, resetToFactoryDefaults, activeCurrency } = useStudio();
  const t = getTranslation(defaults.language);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Studio Information Card */}
      <GlassCard
        title={t.studio.studioInfo}
        subtitle="Tekliflerde ve dökümanlarda yer alacak kurumsal atölye bilgileriniz"
        icon={<Building className="w-5 h-5" />}
        glowColor="indigo"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.studioName}</label>
            <input
              type="text"
              value={profile.studioName}
              onChange={e => updateProfile({ studioName: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.artisanName}</label>
            <input
              type="text"
              value={profile.artisanName}
              onChange={e => updateProfile({ artisanName: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.phone}</label>
            <input
              type="text"
              value={profile.phone}
              onChange={e => updateProfile({ phone: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.email}</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => updateProfile({ email: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.website}</label>
            <input
              type="text"
              value={profile.website}
              onChange={e => updateProfile({ website: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.taxNumber}</label>
            <input
              type="text"
              value={profile.taxNumber || ''}
              onChange={e => updateProfile({ taxNumber: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.address}</label>
            <input
              type="text"
              value={profile.address}
              onChange={e => updateProfile({ address: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.quoteNotes}</label>
            <textarea
              rows={2}
              value={profile.quoteHeaderNotes}
              onChange={e => updateProfile({ quoteHeaderNotes: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.termsConditions}</label>
            <textarea
              rows={3}
              value={profile.quoteTermsConditions}
              onChange={e => updateProfile({ quoteTermsConditions: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.careInstructions}</label>
            <textarea
              rows={3}
              value={profile.careInstructions}
              onChange={e => updateProfile({ careInstructions: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </GlassCard>

      {/* 2. Default Rates & Material Prices Card */}
      <GlassCard
        title={t.studio.defaultsTitle}
        subtitle="Yeni açılan projelerin başlangıç fiyatlarını ve atölye standartlarını belirleyin"
        icon={<Sliders className="w-5 h-5" />}
        glowColor="amber"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">{t.studio.currency}</label>
            <select
              value={defaults.currency}
              onChange={e => setCurrency(e.target.value as CurrencyCode)}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              {Object.values(CURRENCIES).map(c => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <NumberInput
            label={t.studio.defaultHourlyRate}
            value={defaults.hourlyRate}
            onChange={val => updateDefaults({ hourlyRate: val })}
            min={0}
            step={25}
            prefix={activeCurrency.symbol}
          />

          <NumberInput
            label={t.studio.defaultElectricityRate}
            value={defaults.electricityKwhRate}
            onChange={val => updateDefaults({ electricityKwhRate: val })}
            min={0}
            step={0.1}
            prefix={activeCurrency.symbol}
          />

          <NumberInput
            label={t.studio.defaultWasteRate}
            value={defaults.defaultWasteRiskPercentage}
            onChange={val => updateDefaults({ defaultWasteRiskPercentage: val })}
            min={0}
            max={50}
            step={1}
            suffix="%"
          />

          <NumberInput
            label={t.studio.defaultProfitRate}
            value={defaults.defaultProfitMarginPercentage}
            onChange={val => updateDefaults({ defaultProfitMarginPercentage: val })}
            min={0}
            max={200}
            step={5}
            suffix="%"
          />

          <NumberInput
            label={t.studio.defaultVatRate}
            value={defaults.defaultVatPercentage}
            onChange={val => updateDefaults({ defaultVatPercentage: val })}
            min={0}
            max={50}
            step={1}
            suffix="%"
          />

          <NumberInput
            label={t.studio.defaultFoilPrice}
            value={defaults.defaultFoilPrice}
            onChange={val => updateDefaults({ defaultFoilPrice: val })}
            min={0}
            step={10}
            prefix={activeCurrency.symbol}
          />

          <NumberInput
            label={t.studio.defaultSolderPrice}
            value={defaults.defaultSolderPrice}
            onChange={val => updateDefaults({ defaultSolderPrice: val })}
            min={0}
            step={25}
            prefix={activeCurrency.symbol}
          />

          <NumberInput
            label="Varsayılan Çinko Profil Fiyatı (Metre)"
            value={defaults.defaultZincCamePricePerMeter}
            onChange={val => updateDefaults({ defaultZincCamePricePerMeter: val })}
            min={0}
            step={5}
            prefix={activeCurrency.symbol}
          />

        </div>
      </GlassCard>

      {/* Save & Reset Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <button
          onClick={() => {
            if (confirm('Tüm atölye ayarları varsayılan fabrika değerlerine dönecektir. Onaylıyor musunuz?')) {
              resetToFactoryDefaults();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.studio.resetDefaults}</span>
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
            savedSuccess
              ? 'bg-emerald-500 text-white shadow-emerald-950/50'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50 active:scale-95'
          }`}
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.studio.savedSuccess}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{t.studio.saveChanges}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
