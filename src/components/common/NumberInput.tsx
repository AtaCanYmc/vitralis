/* Hallmark · component: number-input · genre: editorial/atelier · theme: cobalt-atelier
 * states: default · hover · focus-visible · active · disabled
 */

import React from 'react';

interface NumberInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  placeholder,
  disabled = false,
  className = '',
  helpText,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (isNaN(parsed)) {
      onChange(0);
    } else {
      let val = parsed;
      if (min !== undefined && val < min) val = min;
      if (max !== undefined && val > max) val = max;
      onChange(val);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
          <span className="truncate">{label}</span>
          {helpText && <span className="text-[10px] font-normal text-slate-400 font-mono">{helpText}</span>}
        </label>
      )}
      <div className="relative flex items-center rounded-xl overflow-hidden group">
        {prefix && (
          <span className="absolute left-2.5 text-slate-400 text-xs font-mono font-medium pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value === 0 ? '' : value}
          onChange={handleChange}
          placeholder={placeholder || '0'}
          disabled={disabled}
          className={`glass-input w-full py-1.5 rounded-xl font-mono text-xs font-medium ${
            prefix ? 'pl-7' : 'pl-2.5'
          } ${suffix ? 'pr-10' : 'pr-2.5'}`}
        />
        {suffix && (
          <span className="absolute right-2.5 text-slate-400 text-[11px] font-mono font-medium pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
