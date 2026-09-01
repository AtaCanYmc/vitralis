/* Hallmark · component: glass-card · genre: editorial/atelier · theme: cobalt-atelier
 * states: default · hover · focus · active
 */

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
  glowColor?: 'indigo' | 'amber' | 'emerald' | 'rose' | 'sky' | 'purple' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  badge,
  headerAction,
  collapsible = false,
  defaultExpanded = true,
  isExpanded: controlledExpanded,
  onToggle,
  className = '',
  glowColor = 'indigo',
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (controlledExpanded !== undefined) {
      setInternalExpanded(controlledExpanded);
    }
  }, [controlledExpanded]);

  const isCurrentExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const glowStyles = {
    indigo: 'border-indigo-200 dark:border-indigo-500/20 shadow-indigo-950/5 dark:shadow-indigo-950/20 hover:border-indigo-300 dark:hover:border-indigo-500/40',
    amber: 'border-amber-200 dark:border-amber-500/20 shadow-amber-950/5 dark:shadow-amber-950/20 hover:border-amber-300 dark:hover:border-amber-500/40',
    emerald: 'border-emerald-200 dark:border-emerald-500/20 shadow-emerald-950/5 dark:shadow-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-500/40',
    rose: 'border-rose-200 dark:border-rose-500/20 shadow-rose-950/5 dark:shadow-rose-950/20 hover:border-rose-300 dark:hover:border-rose-500/40',
    sky: 'border-sky-200 dark:border-sky-500/20 shadow-sky-950/5 dark:shadow-sky-950/20 hover:border-sky-300 dark:hover:border-sky-500/40',
    purple: 'border-purple-200 dark:border-purple-500/20 shadow-purple-950/5 dark:shadow-purple-950/20 hover:border-purple-300 dark:hover:border-purple-500/40',
    none: 'border-slate-200 dark:border-slate-700/40 hover:border-slate-300 dark:hover:border-slate-600/50',
  };

  return (
    <div
      className={`relative rounded-2xl bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl border ${glowStyles[glowColor]} shadow-md dark:shadow-xl transition-all duration-200 overflow-hidden ${className}`}
    >
      {(title || headerAction || icon) && (
        <div
          className={`flex items-center justify-between p-4 md:p-5 transition-colors select-none ${
            isCurrentExpanded ? 'border-b border-slate-200 dark:border-slate-800/60' : ''
          } ${collapsible ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40' : ''}`}
          onClick={collapsible ? handleToggle : undefined}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shrink-0">
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {typeof title === 'string' ? (
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base md:text-lg tracking-tight">{title}</h3>
                ) : (
                  title
                )}
                {badge && <div>{badge}</div>}
              </div>
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            {headerAction}
            {collapsible && (
              <button
                type="button"
                onClick={handleToggle}
                className="tactile-btn p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
                aria-label={isCurrentExpanded ? 'Daralt' : 'Genişlet'}
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isCurrentExpanded ? 'transform rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {isCurrentExpanded && (
        <div className="p-4 md:p-5 transition-all duration-200 animate-in fade-in-50">{children}</div>
      )}
    </div>
  );
};
