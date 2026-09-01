/* Hallmark · component: custom-select · genre: editorial/atelier · theme: cobalt-atelier
 * states: default · hover · focus-visible · open · disabled · selected
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface CustomSelectProps<T = string | number> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  helpText?: string;
  align?: 'left' | 'right';
}

export function CustomSelect<T extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seçiniz...',
  disabled = false,
  className = '',
  size = 'sm',
  helpText,
  align = 'left',
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const sizeClasses = {
    xs: 'py-1 px-2.5 text-[11px]',
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-3.5 text-sm',
  };

  return (
    <div className={`relative flex flex-col ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span className="truncate">{label}</span>
          {helpText && <span className="text-[10px] font-normal text-slate-400 font-mono">{helpText}</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`tactile-btn w-full flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 font-medium transition-all shadow-sm ${
          sizeClasses[size]
        } ${isOpen ? 'ring-2 ring-indigo-500/40 border-indigo-500 bg-white dark:bg-slate-900' : ''} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180 text-indigo-600 dark:text-indigo-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute z-50 mt-1.5 min-w-full max-h-60 overflow-y-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-2xl shadow-black/20 dark:shadow-black/60 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          style={{ top: '100%' }}
        >
          <div className="space-y-0.5">
            {options.map(option => {
              const isSelected = option.value === value;

              return (
                <button
                  key={String(option.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`tactile-btn w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <div className="truncate">
                      <span className="truncate block">{option.label}</span>
                      {option.sublabel && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                          {option.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {option.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
