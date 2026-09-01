/* Hallmark · component: printable-quote · genre: editorial/atelier · theme: cobalt-atelier
 * pre-emit critique: P5 H5 E5 S5 R5 V5
 * states: default · hover · focus-visible · active · print
 */

import React, { useState } from 'react';
import {
  Printer,
  Copy,
  CheckCircle2,
  FileDown,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { formatArea, formatCurrency, formatHours } from '../../utils/formatters';
import { exportProjectToJson, generateClientQuoteText, printQuotationSheet } from '../../utils/exportUtils';
import { getTranslation } from '../../i18n';

export const PrintableQuote: React.FC = () => {
  const { project, updateMetadata } = useProject();
  const { profile, activeCurrency, defaults } = useStudio();
  const t = getTranslation(defaults.language);

  const [copied, setCopied] = useState(false);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(true);

  const meta = project.metadata;
  const b = project.breakdown;

  const handleCopy = () => {
    const text = generateClientQuoteText(project, profile, activeCurrency, defaults.language);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Controls (Hidden on Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100">{t.quote.title}</h3>
            <p className="text-[11px] text-slate-400 font-normal">{t.quote.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle breakdown mode */}
          <button
            type="button"
            onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
            className="tactile-btn px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            {showDetailedBreakdown ? 'Özet Görünüm' : 'Detaylı Kalemler'}
          </button>

          {/* Copy WhatsApp text */}
          <button
            onClick={handleCopy}
            className={`tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{copied ? t.quote.copiedSuccess : t.quote.copyTextBtn}</span>
          </button>

          {/* JSON Export */}
          <button
            onClick={() => exportProjectToJson(project)}
            className="tactile-btn p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="JSON İndir"
          >
            <FileDown className="w-4 h-4" />
          </button>

          {/* Print / Save PDF */}
          <button
            onClick={printQuotationSheet}
            className="tactile-btn flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.quote.printBtn}</span>
          </button>
        </div>
      </div>

      {/* Printable Quotation Document Sheet */}
      <div className="printable-document bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-7">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
              <img src="/favicon.svg" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {profile.studioName || 'Vitralis Cam Vitray Atölyesi'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {profile.artisanName || 'Vitray Sanatçısı'} • Sanatsal Vitray Teklif & Üretim Formu
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="text-left sm:text-right text-xs text-slate-600 dark:text-slate-400 space-y-1">
            {profile.phone && <p className="flex items-center sm:justify-end gap-1"><Phone className="w-3 h-3 text-indigo-500" /> {profile.phone}</p>}
            {profile.email && <p className="flex items-center sm:justify-end gap-1"><Mail className="w-3 h-3 text-indigo-500" /> {profile.email}</p>}
            {profile.address && <p className="flex items-center sm:justify-end gap-1"><MapPin className="w-3 h-3 text-indigo-500" /> {profile.address}</p>}
            {profile.taxNumber && <p className="text-[11px] text-slate-400 font-mono">Vergi No: {profile.taxNumber}</p>}
          </div>
        </div>

        {/* Project & Client Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          
          {/* Client Details */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {t.quote.clientInfo}
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Müşteri / Kurum:</span>
                <input
                  type="text"
                  value={meta.clientName}
                  onChange={e => updateMetadata({ clientName: e.target.value })}
                  placeholder="Müşteri Adı Soyadı"
                  className="bg-transparent font-bold text-slate-900 dark:text-slate-100 border-b border-dashed border-slate-400 focus:outline-none flex-1"
                />
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span>İletişim:</span>
                <input
                  type="text"
                  value={meta.clientPhone || ''}
                  onChange={e => updateMetadata({ clientPhone: e.target.value })}
                  placeholder="Telefon / E-posta"
                  className="bg-transparent border-b border-dashed border-slate-400 focus:outline-none flex-1"
                />
              </div>
            </div>
          </div>

          {/* Project Specs */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {t.quote.projectInfo}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">{t.quote.quoteDate}:</span>
                <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
                  {new Date(meta.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Ölçüler:</span>
                <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
                  {meta.dimensions.widthCm} × {meta.dimensions.heightCm} cm
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Parça Sayısı:</span>
                <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
                  {meta.pieceCount} Adet El Kesimi Cam
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Teknik:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {meta.projectType === 'tiffany' ? 'Orijinal Tiffany Bakır Folyo' : 'Kurşunlu Vitray'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Header Notes / Quote Description */}
        {profile.quoteHeaderNotes && (
          <p className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-indigo-500 pl-3 py-1">
            "{profile.quoteHeaderNotes}"
          </p>
        )}

        {/* Detailed or Summary Cost Table */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.quote.costSummaryTable}
          </h4>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3 font-semibold">Kalem / Açıklama</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Ölçü / Miktar</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {showDetailedBreakdown ? (
                  <>
                    {/* Glass list */}
                    {project.glassItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</span>
                          <span className="text-[11px] text-slate-500 block">{item.type} ({item.color})</span>
                        </td>
                        <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">
                          {formatArea(item.calculatedAreaSqM)} ({item.quantity} adet)
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(item.calculatedCost, activeCurrency)}
                        </td>
                      </tr>
                    ))}

                    {/* Consumables */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-2 px-3">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">Sarf Malzemeleri (Folyo, Lehim 60/40, Flux, Patina)</span>
                        <span className="text-[11px] text-slate-500 block">
                          {project.consumables.foil.lengthMeters}m Bakır Folyo, {project.consumables.solder.weightGrams}g Lehim, Yüzey Kimyasalları
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">1 Paket Set</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(b.totalConsumablesCost, activeCurrency)}
                      </td>
                    </tr>

                    {/* Labor */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-2 px-3">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">Usta İşçiliği & Sanatsal Üretim</span>
                        <span className="text-[11px] text-slate-500 block">
                          Tasarım, cam kesim, taşlama, folyolama, lehimleme, cila & montaj
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">
                        {formatHours(b.totalLaborHours)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(b.totalLaborCost, activeCurrency)}
                      </td>
                    </tr>

                    {/* Studio Overhead & Risk */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-2 px-3">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">Atölye Giderleri, Ekipman & Fire Payı</span>
                        <span className="text-[11px] text-slate-500 block">
                          Elmas uçlar, havya/taşlama aşınması, enerji ve kırılma sigortası
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-400">-</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(b.totalEquipmentDepreciationCost + b.totalElectricityCost + b.wasteAmount, activeCurrency)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {/* Summary row */}
                    <tr>
                      <td className="py-3 px-3 font-semibold">
                        Özel Tasarım Cam Vitray Eseri Üretimi
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">1 Adet</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(b.subtotalSellingPrice, activeCurrency)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation Summary */}
          <div className="pt-3 flex justify-end">
            <div className="w-72 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Ara Toplam:</span>
                <span className="font-mono font-semibold">{formatCurrency(b.subtotalSellingPrice, activeCurrency)}</span>
              </div>

              {b.discountAmount > 0 && (
                <div className="flex justify-between text-purple-600 dark:text-purple-400">
                  <span>Özel İndirim (%{project.marginRisk.discountPercentage}):</span>
                  <span className="font-mono font-semibold">-{formatCurrency(b.discountAmount, activeCurrency)}</span>
                </div>
              )}

              {b.taxAmount > 0 && (
                <div className="flex justify-between text-teal-600 dark:text-teal-400">
                  <span>KDV (%{project.marginRisk.vatTaxPercentage}):</span>
                  <span className="font-mono font-semibold">+{formatCurrency(b.taxAmount, activeCurrency)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-300 dark:border-slate-800 flex justify-between items-center text-base font-bold text-slate-900 dark:text-amber-400">
                <span>{t.quote.totalPayable}:</span>
                <span className="font-mono text-lg font-extrabold">{formatCurrency(b.finalSellingPrice, activeCurrency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stained Glass Care & Maintenance Instructions */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>{t.studio.careInstructions}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {profile.careInstructions}
          </p>
        </div>

        {/* Terms, Conditions & Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              {t.studio.termsConditions}
            </span>
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
              {profile.quoteTermsConditions}
            </p>
          </div>

          <div className="flex flex-col justify-end items-center sm:items-end text-center sm:text-right pt-6 sm:pt-0">
            <div className="w-48 border-b border-slate-400 dark:border-slate-600 pb-1 mb-1">
              <span className="text-[10px] text-slate-400 italic">Yetkili İmza / Kaşe</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">{profile.artisanName || 'Vitray Sanatçısı'}</span>
            <span className="text-[11px] text-slate-500">{profile.studioName}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
