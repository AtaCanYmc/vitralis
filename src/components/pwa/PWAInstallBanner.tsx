import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Smartphone } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { getTranslation } from '../../i18n';

interface PWAInstallBannerProps {
  deferredPrompt: any;
  onInstall: () => void;
  isInstallable: boolean;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  onInstall,
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
    <div className="no-print fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-40 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-4 shadow-2xl shadow-indigo-950/60 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
            {t.app.pwaInstallTitle}
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
              PWA
            </span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            {t.app.pwaInstallDesc}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={onInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.app.installBtn}</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all"
            >
              Daha Sonra
            </button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
