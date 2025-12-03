import React from 'react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-1">
          {label} {required && <span className="text-danger-400">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger-300">{error}</p>
      )}
    </div>
  );
}
