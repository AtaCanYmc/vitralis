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
    <nav className="w-full bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-800/80 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap select-none ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-950/50 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-indigo-950 text-indigo-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
