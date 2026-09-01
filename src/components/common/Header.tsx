import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Globe,
  Save,
  Download,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useProject } from '../../context/ProjectContext';
import { CURRENCIES } from '../../constants/defaults';
import type { CurrencyCode } from '../../types/studio';
import { getTranslation } from '../../i18n';

interface HeaderProps {
  onOpenTools: () => void;
  deferredPrompt: any;
  onInstallPwa: () => void;
  isInstallable: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTools,
  onInstallPwa,
  isInstallable,
}) => {
  const { defaults, setLanguage, setTheme, setCurrency } = useStudio();
  const { project, updateMetadata, saveActiveProject } = useProject();
  const t = getTranslation(defaults.language);

  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const handleSave = () => {
    saveActiveProject();
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/70 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 p-[2px] shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  <img src="/favicon.svg" alt="Vitralis Logo" className="w-7 h-7 object-contain drop-shadow" />
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-300 pointer-events-none -z-10" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Vitralis
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Studio
                  </span>
                </h1>
              </div>
              <p className="text-[11px] md:text-xs text-slate-400 font-medium hidden sm:block">
                {t.app.tagline}
              </p>
            </div>
          </div>

          {/* Center Project Title (Editable) */}
          <div className="hidden lg:flex items-center gap-2 max-w-sm flex-1 mx-6">
            <div className="w-full relative">
              <input
                type="text"
                value={project.metadata.title}
                onChange={e => updateMetadata({ title: e.target.value })}
                placeholder="Proje Adı..."
                className="w-full bg-slate-900/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-slate-500">
                {project.metadata.pieceCount} {t.projects.pieces}
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Artisan Tools Modal Button */}
            <button
              onClick={onOpenTools}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-indigo-300 hover:text-indigo-200 text-xs font-semibold shadow-sm transition-all"
              title={t.toolsModal.title}
            >
              <Wrench className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">{t.nav.tools}</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={defaults.currency}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="appearance-none bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-semibold rounded-xl pl-2.5 pr-7 py-1.5 cursor-pointer focus:outline-none focus:border-indigo-500 transition-all"
                title={t.studio.currency}
              >
                {Object.values(CURRENCIES).map(curr => (
                  <option key={curr.code} value={curr.code} className="bg-slate-900 text-slate-100">
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-2 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(defaults.language === 'tr' ? 'en' : 'tr')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-all"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase">{defaults.language}</span>
            </button>

            {/* Theme Toggle (Dark/Light) */}
            <button
              onClick={() => setTheme(defaults.theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-amber-300 transition-all"
              title={defaults.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {defaults.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Install PWA Button if prompt available */}
            {isInstallable && (
              <button
                onClick={onInstallPwa}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all animate-pulse"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.app.installBtn}</span>
              </button>
            )}

            {/* Quick Save Project Button */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isSavedRecently
                  ? 'bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40 active:scale-95'
              }`}
              title={t.summary.quickSave}
            >
              {isSavedRecently ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kaydedildi</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.summary.quickSave}</span>
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
