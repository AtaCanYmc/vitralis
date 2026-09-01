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
        <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>{label}</span>
          {helpText && <span className="text-[11px] font-normal text-slate-400">{helpText}</span>}
        </label>
      )}
      <div className="relative flex items-center rounded-xl overflow-hidden group">
        {prefix && (
          <span className="absolute left-3 text-slate-400 text-xs font-medium pointer-events-none select-none">
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
          className={`w-full py-2 bg-slate-900/60 dark:bg-slate-900/70 border border-slate-700/60 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all ${
            prefix ? 'pl-8' : 'pl-3'
          } ${suffix ? 'pr-12' : 'pr-3'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 text-slate-400 text-xs font-medium pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
