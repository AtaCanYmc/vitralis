/* Hallmark · component: header · genre: editorial/atelier · theme: cobalt-atelier
 * states: default · hover · focus-visible · active · mobile-drawer-open
 */

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Globe,
  Save,
  Download,
  Wrench,
  CheckCircle2,
  Menu,
  X,
  FileCheck,
  PlusCircle,
  Smartphone,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useProject } from '../../context/ProjectContext';
import { CURRENCIES, LOGO_URL } from '../../constants/defaults';
import type { CurrencyCode, BeforeInstallPromptEvent } from '../../types/studio';
import { getTranslation } from '../../i18n';
import { CustomSelect } from './CustomSelect';

interface HeaderProps {
  onOpenTools: () => void;
  onOpenPwaGuide: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstallPwa: () => void;
  isInstallable: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTools,
  onOpenPwaGuide,
  onInstallPwa,
  isInstallable,
}) => {
  const { defaults, setLanguage, setTheme, setCurrency } = useStudio();
  const { project, updateMetadata, saveActiveProject, createNewProject, setActiveTab } = useProject();
  const t = getTranslation(defaults.language);

  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleSave = () => {
    saveActiveProject();
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 shadow-xs dark:shadow-md transition-colors duration-200 pt-safe sm:pt-0">
        <div className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-16 md:h-17 py-1 sm:py-0">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative group cursor-pointer shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-slate-900 border border-slate-700/60 p-1 flex items-center justify-center shadow-inner group-hover:border-amber-500/50 transition-all">
                  <img src={LOGO_URL} alt="Vitralis Logo" className="w-6 h-6 sm:w-7 sm:h-7 object-contain drop-shadow" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                    Vitralis
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      Atelier
                    </span>
                  </h1>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
                  {t.app.tagline}
                </p>
              </div>
            </div>

            {/* Center Project Title (Desktop Only) */}
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

            {/* Desktop Action Controls (md and above) */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
              
              {/* Quick Artisan Tools Modal Button */}
              <button
                onClick={onOpenTools}
                className="tactile-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 text-xs font-semibold shadow-xs transition-all"
                title={t.toolsModal.title}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.nav.tools}</span>
              </button>

              {/* Currency Selector */}
              <div className="w-24">
                <CustomSelect<CurrencyCode>
                  value={defaults.currency}
                  onChange={val => setCurrency(val)}
                  options={Object.values(CURRENCIES).map(curr => ({
                    value: curr.code,
                    label: `${curr.symbol} ${curr.code}`,
                    sublabel: curr.name,
                  }))}
                  size="sm"
                  align="right"
                />
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

              {/* PWA Install / Guide Button */}
              <button
                onClick={isInstallable ? onInstallPwa : onOpenPwaGuide}
                className="tactile-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold shadow-xs transition-all"
                title="PWA Kurulum Rehberi"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden lg:inline">Uygulama</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">PWA</span>
              </button>

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
                    <span>Kaydedildi</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{t.summary.quickSave}</span>
                  </>
                )}
              </button>

            </div>

            {/* Mobile Header Action Bar (Under 768px) */}
            <div className="flex md:hidden items-center gap-2">
              
              {/* Mobile Quick Save Button */}
              <button
                onClick={handleSave}
                className={`tactile-btn flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isSavedRecently
                    ? 'bg-emerald-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
                title={t.summary.quickSave}
              >
                {isSavedRecently ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="text-[11px]">{isSavedRecently ? 'Kayıt' : 'Kaydet'}</span>
              </button>

              {/* Mobile Hamburger / Studio Drawer Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="tactile-btn p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs"
                aria-label="Menüyü Aç"
              >
                <Menu className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Mobile Studio Drawer / Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 pt-safe pb-safe shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
            
            <div className="space-y-5">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-950 p-0.5 border border-slate-800 flex items-center justify-center">
                    <img src={LOGO_URL} alt="Logo" className="w-5 h-5 object-contain" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Atölye Menüsü</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="tactile-btn p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Mobile Project Title Editor */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                  Aktif Proje Adı
                </label>
                <input
                  type="text"
                  value={project.metadata.title}
                  onChange={e => updateMetadata({ title: e.target.value })}
                  placeholder="Proje Adı..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                  {project.metadata.pieceCount} {t.projects.pieces} • {project.metadata.projectType}
                </span>
              </div>

              {/* 2. Currency Selector */}
              <div className="space-y-1.5">
                <CustomSelect<CurrencyCode>
                  label={t.studio.currency}
                  value={defaults.currency}
                  onChange={val => setCurrency(val)}
                  options={Object.values(CURRENCIES).map(curr => ({
                    value: curr.code,
                    label: `${curr.symbol} ${curr.code}`,
                    sublabel: curr.name,
                  }))}
                  size="md"
                />
              </div>

              {/* 3. Language & Theme Dual Segmented Switcher */}
              <div className="grid grid-cols-2 gap-2">
                
                {/* Language Switch */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                    Dil / Language
                  </label>
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-0.5 border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setLanguage('tr')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        defaults.language === 'tr'
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      TR
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        defaults.language === 'en'
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Theme Switch */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                    Tema Modu
                  </label>
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-0.5 border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        defaults.theme === 'light'
                          ? 'bg-white text-indigo-600 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Sun className="w-3 h-3" />
                      <span>Açık</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        defaults.theme === 'dark'
                          ? 'bg-slate-800 text-amber-400 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Moon className="w-3 h-3" />
                      <span>Koyu</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* 4. Tools & PWA Shortcuts */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                
                {/* Artisan Tools Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenTools();
                  }}
                  className="tactile-btn w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Wrench className="w-4 h-4 text-amber-500" />
                    <span>Usta Hesaplama Araçları</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Lehim/Alan</span>
                </button>

                {/* PWA Guide Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenPwaGuide();
                  }}
                  className="tactile-btn w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-indigo-500" />
                    <span>Uygulamayı Cihaza Yükle</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-bold">
                    PWA
                  </span>
                </button>

              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setActiveTab('quote');
                }}
                className="tactile-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/30"
              >
                <FileCheck className="w-4 h-4" />
                <span>Teklif Çıktısı Al</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  createNewProject();
                }}
                className="tactile-btn w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Yeni Proje Başlat</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
