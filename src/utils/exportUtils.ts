import type { VitralisProject } from '../types/project';
import type { CurrencyConfig, StudioProfile } from '../types/studio';
import { formatCurrency, formatHours } from './formatters';

/**
 * Generates formatted text summary suitable for WhatsApp, Telegram, or Email quotes
 */
export function generateClientQuoteText(
  project: VitralisProject,
  profile: StudioProfile,
  currency: CurrencyConfig,
  lang: 'tr' | 'en' = 'tr'
): string {
  const isTr = lang === 'tr';
  const meta = project.metadata;
  const b = project.breakdown;

  if (isTr) {
    return `✨ *${profile.studioName || 'Vitralis Atölye'} - FİYAT TEKLİFİ* ✨
-------------------------------------
📁 *Proje:* ${meta.title || 'Özel Cam Vitray Eseri'}
👤 *Müşteri:* ${meta.clientName || 'Sayın Müşteri'}
📐 *Ölçüler:* ${meta.dimensions.widthCm}x${meta.dimensions.heightCm} cm ${meta.dimensions.depthCm ? `x${meta.dimensions.depthCm} cm` : ''}
🧩 *Parça Sayısı:* ${meta.pieceCount} adet el kesimi cam
🛠️ *Teknik:* ${meta.projectType === 'tiffany' ? 'Orijinal Tiffany Bakır Folyo' : 'Kurşunlu Vitray (Lead Came)'}

📊 *Fiyat Özeti:*
• Cam & Sarf Malzeme Toplamı: ${formatCurrency(b.totalGlassCost + b.totalConsumablesCost, currency)}
• Usta İşçilik Payı (${formatHours(b.totalLaborHours)}): ${formatCurrency(b.totalLaborCost, currency)}
• Atölye & Enerji Giderleri: ${formatCurrency(b.totalEquipmentDepreciationCost + b.totalElectricityCost + b.wasteAmount, currency)}
${b.discountAmount > 0 ? `• İndirim (${b.discountAmount > 0 ? formatCurrency(b.discountAmount, currency) : ''}): -${formatCurrency(b.discountAmount, currency)}\n` : ''}${b.taxAmount > 0 ? `• KDV (%${project.marginRisk.vatTaxPercentage}): ${formatCurrency(b.taxAmount, currency)}\n` : ''}
🏷️ *TOPLAM TEKLİF BEDELİ:* *${formatCurrency(b.finalSellingPrice, currency)}*
-------------------------------------
ℹ️ *Notlar & Koşullar:*
${profile.quoteTermsConditions || 'Teklif 30 gün süreyle geçerlidir.'}

📞 İletişim: ${profile.phone || ''} | ${profile.email || ''}
🌐 ${profile.website || ''}`;
  } else {
    return `✨ *${profile.studioName || 'Vitralis Studio'} - QUOTATION* ✨
-------------------------------------
📁 *Project:* ${meta.title || 'Custom Stained Glass Artwork'}
👤 *Client:* ${meta.clientName || 'Valued Client'}
📐 *Dimensions:* ${meta.dimensions.widthCm}x${meta.dimensions.heightCm} cm ${meta.dimensions.depthCm ? `x${meta.dimensions.depthCm} cm` : ''}
🧩 *Piece Count:* ${meta.pieceCount} hand-cut glass pieces
🛠️ *Technique:* ${meta.projectType === 'tiffany' ? 'Original Tiffany Copper Foil' : 'Traditional Lead Came'}

📊 *Price Breakdown:*
• Glass & Consumables: ${formatCurrency(b.totalGlassCost + b.totalConsumablesCost, currency)}
• Artisan Labor (${formatHours(b.totalLaborHours)}): ${formatCurrency(b.totalLaborCost, currency)}
• Studio & Energy Overheads: ${formatCurrency(b.totalEquipmentDepreciationCost + b.totalElectricityCost + b.wasteAmount, currency)}
${b.discountAmount > 0 ? `• Discount: -${formatCurrency(b.discountAmount, currency)}\n` : ''}${b.taxAmount > 0 ? `• Tax / VAT (${project.marginRisk.vatTaxPercentage}%): ${formatCurrency(b.taxAmount, currency)}\n` : ''}
🏷️ *FINAL QUOTE AMOUNT:* *${formatCurrency(b.finalSellingPrice, currency)}*
-------------------------------------
ℹ️ *Terms & Notes:*
${profile.quoteTermsConditions || 'Quotation valid for 30 days.'}

📞 Contact: ${profile.phone || ''} | ${profile.email || ''}
🌐 ${profile.website || ''}`;
  }
}

/**
 * Triggers JSON file download for project backup
 */
export function exportProjectToJson(project: VitralisProject): void {
  const fileName = `Vitralis_${(project.metadata.title || 'Project').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers browser print dialog for quotation sheet
 */
export function printQuotationSheet(): void {
  window.print();
}
