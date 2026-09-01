import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Share,
  PlusSquare,
  Download,
  WifiOff,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useStudio } from '../../context/StudioContext';
import { LOGO_URL } from '../../constants/defaults';
import { getTranslation } from '../../i18n';
import type { BeforeInstallPromptEvent } from '../../types/studio';

const PWA_SEEN_STORAGE_KEY = 'vitralis_pwa_guide_seen_v1';

interface PWAInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstall: () => void;
  isInstallable: boolean;
}

type PlatformTab = 'ios' | 'android' | 'desktop';

export const PWAInstallGuideModal: React.FC<PWAInstallGuideModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
}) => {
  const { defaults } = useStudio();
  const t = getTranslation(defaults.language);

  // Auto detect user OS
  const getInitialPlatform = (): PlatformTab => {
    if (typeof window === 'undefined') return 'desktop';
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    return 'desktop';
  };

  const [activePlatform, setActivePlatform] = useState<PlatformTab>(getInitialPlatform);
  const [dontShowAgain, setDontShowAgain] = useState(true);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(PWA_SEEN_STORAGE_KEY, 'true');
    }
    onClose();
  };

  const handleInstallClick = () => {
    localStorage.setItem(PWA_SEEN_STORAGE_KEY, 'true');
    onInstall();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Vitralis'i Cihazınıza Yükleyin (PWA)"
      maxWidth="xl"
    >
      <div className="space-y-5">
        
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-amber-900/20 border border-indigo-500/30 p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 p-2 border border-indigo-200 dark:border-indigo-500/40 shrink-0 shadow-lg flex items-center justify-center">
              <img src={LOGO_URL} alt="Vitralis Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                  Progressive Web App
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Çevrimdışı Hazır
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                Atölyenizde Kesintisiz ve Hızlı Deneyim
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Vitralis'i ana ekranınıza veya masaüstünüze yükleyerek, internet olmadan da atölye maliyetlerinizi anında hesaplayabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActivePlatform('ios')}
            className={`tactile-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all ${
              activePlatform === 'ios'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span><span className="hidden sm:inline">iPhone / iPad </span>(iOS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('android')}
            className={`tactile-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all ${
              activePlatform === 'android'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('desktop')}
            className={`tactile-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all ${
              activePlatform === 'desktop'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span><span className="hidden sm:inline">Masaüstü </span>(PC/Mac)</span>
          </button>
        </div>

        {/* Step-by-Step Platform Guides */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3.5">
          {activePlatform === 'ios' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Safari tarayıcısında alt çubuktaki <b>Paylaş</b> butonuna dokunun.
                  </p>
                  <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-medium">
                    <Share className="w-3.5 h-3.5" /> Paylaş Simgesi (Kare & Yukarı Ok)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Açılan menüde aşağı kaydırıp <b>"Ana Ekrana Ekle"</b> seçeneğine basın.
                  </p>
                  <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-medium">
                    <PlusSquare className="w-3.5 h-3.5" /> Ana Ekrana Ekle
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Sağ üstteki <b>"Ekle"</b> butonuna basarak kurulumu tamamlayın.
                  </p>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Artık Vitralis telefonunuzda bağımsız bir uygulama olarak tam ekran açılacaktır.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'android' && (
            <div className="space-y-3">
              {isInstallable ? (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-indigo-900 dark:text-indigo-200 block">
                      Otomatik Kurulum Hazır!
                    </span>
                    <span className="text-[11px] text-indigo-700 dark:text-indigo-400">
                      Tek tıkla hemen ana ekranınıza ekleyebilirsiniz.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="tactile-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/30 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Şimdi Yükle</span>
                  </button>
                </div>
              ) : null}

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Chrome / Brave tarayıcısında sağ üstteki <b>Üç Nokta (⋮)</b> menüsüne dokunun.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    <b>"Uygulamayı Yükle"</b> veya <b>"Ana Ekrana Ekle"</b> seçeneğine tıklayın.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'desktop' && (
            <div className="space-y-3">
              {isInstallable ? (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-indigo-900 dark:text-indigo-200 block">
                      Masaüstü Uygulaması Olarak Kurun
                    </span>
                    <span className="text-[11px] text-indigo-700 dark:text-indigo-400">
                      Chrome veya Edge üzerinden bağımsız pencere olarak başlatın.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="tactile-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/30 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Masaüstüne Kur</span>
                  </button>
                </div>
              ) : null}

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Tarayıcınızın adres çubuğunun sağ tarafındaki <b>Yükle (⊕ / Bilgisayar Simgesi)</b> butonuna tıklayın.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    <b>"Yükle"</b> diyerek Vitralis'i macOS Dock veya Windows Başlat menüsüne sabitleyin.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PWA Benefits Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-center">
            <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">Sıfır Gecikme</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Anında açılır</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-center">
            <WifiOff className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">%100 Çevrimdışı</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">İnternetsiz çalışır</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-center">
            <ShieldCheck className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">Gizli & Güvenli</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Veriler cihazınızda</span>
          </div>
        </div>

        {/* Footer Actions & Don't Show Again */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={e => setDontShowAgain(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span>İlk girişte tekrar otomatik gösterme</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isInstallable && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="tactile-btn flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.app.installBtn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="tactile-btn flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
