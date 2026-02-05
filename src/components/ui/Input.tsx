// components/ui/Input.tsx

import Image from 'next/image';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  disabled?: boolean;
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
  disabled = false,
}: InputProps) {
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className="w-full mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        {label}
      </label>
      
      {/* Input Container */}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full py-3 px-4 text-sm rounded-md
            bg-[var(--surface-primary)] 
            text-[var(--text-primary)]
            transition-all duration-200
            placeholder:text-[var(--text-tertiary)]
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none
            ${
              error
                ? 'border border-[var(--error)] bg-red-50'
                : 'border border-[var(--border-primary)] focus:border-[var(--primary)]'
            }
            ${showPasswordToggle ? 'pr-12' : ''}
          `}
        />
        
        {/* Password Toggle Icon */}
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? (
              <Image
                src="/assets/icons/eye-off.svg"
                alt="Hide password"
                width={20}
                height={20}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            ) : (
              <Image
                src="/assets/icons/eye.svg"
                alt="Show password"
                width={20}
                height={20}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            )}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="text-xs text-[var(--error)] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}