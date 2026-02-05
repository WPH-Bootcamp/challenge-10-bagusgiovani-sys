// components/ui/Dropdown.tsx
'use client';

import { useRef, useEffect } from 'react';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export default function Dropdown({
  isOpen,
  onClose,
  trigger,
  children,
  align = 'right',
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      {trigger}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--border-primary)] py-2 z-20
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}