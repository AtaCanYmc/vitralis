/* Hallmark · component: header · genre: editorial/atelier · theme: cobalt-atelier
 * states: default · hover · focus · active · disabled
 */

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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-md transition-colors duration-200">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-17">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-900 border border-slate-700/60 p-1 flex items-center justify-center shadow-inner group-hover:border-amber-500/50 transition-all">
                <img src="/favicon.svg" alt="Vitralis Logo" className="w-7 h-7 object-contain drop-shadow" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Vitralis
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    Atelier
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
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
                className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                {project.metadata.pieceCount} {t.projects.pieces}
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Artisan Tools Modal Button */}
            <button
              onClick={onOpenTools}
              className="tactile-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 text-xs font-semibold shadow-sm transition-all"
              title={t.toolsModal.title}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">{t.nav.tools}</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={defaults.currency}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="appearance-none bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold rounded-xl pl-2.5 pr-6 py-1.5 cursor-pointer focus:outline-none focus:border-indigo-500 transition-all"
                title={t.studio.currency}
              >
                {Object.values(CURRENCIES).map(curr => (
                  <option key={curr.code} value={curr.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-2 pointer-events-none text-slate-400 dark:text-slate-500 text-[9px]">
                ▼
              </div>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(defaults.language === 'tr' ? 'en' : 'tr')}
              className="tactile-btn flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
              title="Dili Değiştir"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="uppercase font-mono text-[11px]">{defaults.language}</span>
            </button>

            {/* Theme Toggle (Dark/Light) */}
            <button
              onClick={() => setTheme(defaults.theme === 'dark' ? 'light' : 'dark')}
              className="tactile-btn p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-amber-500 transition-all"
              title={defaults.theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
            >
              {defaults.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Install PWA Button */}
            {isInstallable && (
              <button
                onClick={onInstallPwa}
                className="tactile-btn hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.app.installBtn}</span>
              </button>
            )}

            {/* Quick Save Project Button */}
            <button
              onClick={handleSave}
              className={`tactile-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isSavedRecently
                  ? 'bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40'
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
