import React from 'react';
import { FormField } from '../data/applicationForm';

export const fieldWrap = "mb-6";
export const labelCls = "block text-[13px] font-[700] text-[var(--ink)] mb-2 leading-snug";
export const helpCls = "text-[11.5px] text-[var(--ink-faint)] mb-2 -mt-1";
export const inputCls = "w-full px-4 py-3 border-[2px] border-[var(--line)] text-[14px] font-[500] outline-none transition-all focus:border-[var(--ink)] bg-white";
export const errorCls = "text-[11.5px] font-[700] text-red-600 mt-1.5";

interface FieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export function ApplicationField({ field, value, onChange, error, disabled }: FieldProps) {
  const isRequired = field.required;

  const label = (
    <label className={labelCls}>
      {field.label}
      {isRequired && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  let control: React.ReactNode;

  switch (field.type) {
    case 'textarea':
      control = (
        <textarea
          className={`${inputCls} resize-y min-h-[110px]`}
          value={value ?? ''}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      );
      break;
    case 'select':
      control = (
        <select className={`${inputCls} cursor-pointer`} value={value ?? ''} disabled={disabled} onChange={e => onChange(e.target.value)}>
          <option value="">Select...</option>
          {(field.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
      break;
    case 'multiselect': {
      const selected: string[] = Array.isArray(value) ? value : [];
      control = (
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map(o => {
            const active = selected.includes(o);
            return (
              <button
                key={o}
                type="button"
                disabled={disabled}
                onClick={() => onChange(active ? selected.filter(s => s !== o) : [...selected, o])}
                className="px-3.5 py-2 text-[12px] font-[700] uppercase tracking-wide border-[2px] transition-all disabled:opacity-60"
                style={active
                  ? { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' }
                  : { background: 'transparent', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
              >
                {o}
              </button>
            );
          })}
        </div>
      );
      break;
    }
    case 'checkbox':
      control = (
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!value}
            disabled={disabled}
            onChange={e => onChange(e.target.checked)}
            className="mt-1 w-[18px] h-[18px] accent-[var(--ink)] shrink-0 cursor-pointer"
          />
          <span className="text-[13.5px] font-[500] text-[var(--ink-soft)] leading-relaxed">
            {field.label}{isRequired && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      );
      return (
        <div className={fieldWrap}>
          {control}
          {error && <div className={errorCls}>{error}</div>}
        </div>
      );
    case 'file':
      control = (
        <div>
          <input
            type="file"
            disabled={disabled}
            onChange={e => {
              const file = e.target.files?.[0];
              if (!file) { onChange(undefined); return; }
              if (file.size > 3 * 1024 * 1024) {
                onChange({ error: 'File too large (max 3MB).' });
                return;
              }
              const reader = new FileReader();
              reader.onload = () => onChange({ name: file.name, size: file.size, dataUrl: reader.result });
              reader.readAsDataURL(file);
            }}
            className="text-[13px] font-[500] text-[var(--ink-soft)] file:mr-4 file:px-4 file:py-2.5 file:border-[2px] file:border-[var(--ink)] file:bg-white file:font-[800] file:text-[11px] file:uppercase file:tracking-wider file:cursor-pointer hover:file:bg-[var(--ink)] hover:file:text-white file:transition-colors"
          />
          {value?.name && <div className="text-[12px] text-[var(--ink-soft)] mt-2">Attached: {value.name}</div>}
          {value?.error && <div className="text-[12px] text-red-600 mt-2">{value.error}</div>}
        </div>
      );
      break;
    case 'number':
      control = (
        <input type="number" className={inputCls} value={value ?? ''} disabled={disabled} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} />
      );
      break;
    case 'email':
      control = (
        <input type="email" className={inputCls} value={value ?? ''} disabled={disabled} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} />
      );
      break;
    default:
      control = (
        <input type="text" className={inputCls} value={value ?? ''} disabled={disabled} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} />
      );
  }

  return (
    <div className={fieldWrap}>
      {label}
      {field.helpText && <div className={helpCls}>{field.helpText}</div>}
      {control}
      {error && <div className={errorCls}>{error}</div>}
    </div>
  );
}
