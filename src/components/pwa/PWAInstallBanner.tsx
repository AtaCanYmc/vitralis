import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Smartphone } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { getTranslation } from '../../i18n';
import type { BeforeInstallPromptEvent } from '../../types/studio';

interface PWAInstallBannerProps {
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstall: () => void;
  onOpenGuide: () => void;
  isInstallable: boolean;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  onInstall,
  onOpenGuide,
  isInstallable,
}) => {
  const { defaults } = useStudio();
  const t = getTranslation(defaults.language);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
        <WifiOff className="w-4 h-4" />
        <span>{t.app.offlineReady} - Tüm vitray hesaplamalarınız ve projeleriniz internetsiz çalışır.</span>
      </div>
    );
  }

  if (!isInstallable || dismissed) return null;

  return (
    <div className="no-print fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-indigo-200 dark:border-indigo-500/40 rounded-2xl p-4 shadow-xl dark:shadow-indigo-950/60 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/40 p-1 shrink-0 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            {t.app.pwaInstallTitle}
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
              PWA
            </span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            {t.app.pwaInstallDesc}
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={onInstall}
              className="tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.app.installBtn}</span>
            </button>
            <button
              onClick={onOpenGuide}
              className="tactile-btn px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
            >
              Nasıl Kurulur?
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="tactile-btn px-2.5 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-medium transition-all"
            >
              Daha Sonra
            </button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="tactile-btn p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
