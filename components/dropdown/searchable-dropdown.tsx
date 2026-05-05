'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { IconImage } from '@/components/icon-image/icon-image';
import { cn } from '@/lib/utils';

type SearchableDropdownOption = {
  label: string;
  value: string;
};

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  searchPlaceholder?: string;
  options: SearchableDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SearchableDropdown({
  label,
  placeholder,
  searchPlaceholder = 'Search...',
  options,
  value,
  onChange,
  disabled,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return options;

    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={wrapperRef}>
      <label className="mb-2 block text-[16px] text-[#3E3E3E]">{label}</label>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border border-[#808080] px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#e87722] focus:border-transparent',
            disabled && 'cursor-not-allowed bg-gray-100 text-gray-400',
          )}
        >
          <span className={selectedLabel ? 'text-gray-900' : 'text-gray-500'}>
            {selectedLabel || placeholder}
          </span>
          <IconImage
            src="/chevron-down.png"
            alt="dropdown"
            width={24}
            height={24}
            className={cn('transition-transform', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-hidden rounded-lg border border-[#808080] bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full text-sm outline-none"
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={cn(
                      'w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-100',
                      value === option.value && 'bg-orange-50 text-[#e87722]',
                    )}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500">No result found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
