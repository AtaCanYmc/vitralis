/* Hallmark · component: tab-navigation · genre: editorial/atelier · theme: cobalt-atelier
 * states: default · hover · focus · active · mobile-bottom-bar
 */

import React from 'react';
import {
  Calculator,
  FolderKanban,
  LayoutTemplate,
  FileText,
  Sliders,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useStudio } from '../../context/StudioContext';
import { getTranslation } from '../../i18n';

export const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useProject();
  const { defaults } = useStudio();
  const t = getTranslation(defaults.language);

  const navItems = [
    {
      id: 'calculator' as const,
      label: t.nav.calculator,
      shortLabel: 'Hesapla',
      icon: Calculator,
      badge: null,
    },
    {
      id: 'quote' as const,
      label: t.nav.quote,
      shortLabel: 'Teklif',
      icon: FileText,
      badge: 'PDF',
    },
    {
      id: 'projects' as const,
      label: t.nav.projects,
      shortLabel: 'Projeler',
      icon: FolderKanban,
      badge: null,
    },
    {
      id: 'templates' as const,
      label: t.nav.templates,
      shortLabel: 'Şablon',
      icon: LayoutTemplate,
      badge: null,
    },
    {
      id: 'studio' as const,
      label: t.nav.studio,
      shortLabel: 'Ayarlar',
      icon: Sliders,
      badge: null,
    },
  ];

  return (
    <>
      {/* 1. Desktop & Tablet Top Segmented Ribbon (md and above) */}
      <nav className="hidden md:block w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 py-2 px-4 sm:px-6 transition-colors duration-200 sticky top-15 sm:top-16 md:top-17 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs dark:shadow-inner">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`tactile-btn flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap select-none transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/30 border border-indigo-500/50'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-1 py-0.2 rounded ${
                        isActive ? 'bg-indigo-900/80 text-indigo-200' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. Mobile Native Bottom Navigation Bar (<md / Smartphones) */}
      <nav className="no-print md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.4)] pb-safe transition-colors">
        <div className="grid grid-cols-5 items-center h-15 px-1 max-w-lg mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`tactile-btn flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                {/* Active Top Accent Pill */}
                {isActive && (
                  <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}

                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                  {item.shortLabel}
                </span>

                {item.badge && !isActive && (
                  <span className="absolute top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
