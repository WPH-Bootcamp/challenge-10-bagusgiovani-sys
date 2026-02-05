// components/ui/DropdownItem.tsx
import React from 'react';
import Image from 'next/image';

interface DropdownItemProps {
  onClick: () => void;
  icon?: string;
  children: React.ReactNode;
}

export default function DropdownItem({ onClick, icon, children }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors flex items-center gap-2"
    >
      {icon && (
        <Image
          src={icon}
          alt=""
          width={16}
          height={16}
        />
      )}
      {children}
    </button>
  );
}