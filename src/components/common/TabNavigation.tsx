/* Hallmark · component: tab-navigation · genre: editorial/atelier · theme: cobalt-atelier
 * states: default · hover · focus · active
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
      icon: Calculator,
      badge: null,
    },
    {
      id: 'quote' as const,
      label: t.nav.quote,
      icon: FileText,
      badge: 'PDF',
    },
    {
      id: 'projects' as const,
      label: t.nav.projects,
      icon: FolderKanban,
      badge: null,
    },
    {
      id: 'templates' as const,
      label: t.nav.templates,
      icon: LayoutTemplate,
      badge: null,
    },
    {
      id: 'studio' as const,
      label: t.nav.studio,
      icon: Sliders,
      badge: null,
    },
  ];

  return (
    <nav className="w-full bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`tactile-btn flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap select-none transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1 py-0.2 rounded ${
                      isActive ? 'bg-indigo-900/80 text-indigo-200' : 'bg-slate-800 text-slate-400'
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
  );
};
