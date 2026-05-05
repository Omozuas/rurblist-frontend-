'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { OrangeButton } from '../button/button'
import { IconImage } from '../icon-image/icon-image'
import { cn } from '@/lib/utils'

interface FilterShellProps {
  title: string
  active?: boolean
  children: (close: () => void) => ReactNode
}

export function FilterShell({ title, active, children }: FilterShellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = () => setIsOpen(false)
  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
     const isActive = isOpen || active
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'h-12 px-6 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors bg-white',
          isActive
            ? 'border-[#E87722] text-gray-900'
            : 'border-gray-300 text-gray-700 hover:border-gray-400'
        )}
      >
        {title}
        <IconImage
          src="/icons/chevron-down.svg"
          alt="chevron"
          width={16}
          height={16}
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-3 w-65 bg-white border border-gray-200 rounded-xl shadow-xl p-5 z-50">
          {children(close)}
        </div>
      )}
    </div>
  )
}


const PROPERTY_TYPES = [
  { id: 'all', label: 'All Properties' },
  { id: 'For_Sale', label: 'For sale' },
  { id: 'For_Rent', label: 'For rent' },
  { id: 'Sold', label: 'Sold' }
]


export function ForSaleFilter({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}) {
  const selectedLabel = PROPERTY_TYPES.find(option => option.id === value)?.label || 'For sale'

  return (
    <FilterShell title={selectedLabel} active={!!value && value !== 'all'} >
         {(close) => (
      <div className="space-y-4">
        {PROPERTY_TYPES.slice(1).map(option => (
          <label
            key={option.id}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="radio"
              value={option.label}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="w-4 h-4 accent-[#E87722]"
            />
            <span className="text-sm text-gray-800">
              {option.label}
            </span>
          </label>
        ))}

        <OrangeButton
          fullWidth
          onClick={()=>{close()}}
          className="py-2 text-sm rounded-lg"
        >
          Apply
        </OrangeButton>
      </div>
       )}
    </FilterShell>
  )
}


export function PriceFilter({
  onApply,
}: {
  onApply: (min?: number, max?: number) => void;
}) {
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  return (
    <FilterShell title="Price">
    {(close) => (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            value={min}
            onChange={e => setMin(e.target.value)}
            placeholder="Minimum"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E87722]"
          />
          <span className="text-gray-400">—</span>
          <input
            value={max}
            onChange={e => setMax(e.target.value)}
            placeholder="Maximum"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E87722]"
          />
        </div>

        <OrangeButton
          fullWidth
          onClick={() =>
          {onApply(
              min ? Number(min) : undefined,
              max ? Number(max) : undefined
            );
            close();}
          }
          className="py-2 text-sm rounded-lg"
        >
          Apply
        </OrangeButton>
      </div>

       )}
    </FilterShell>
  )
}


const PROPERTY_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Bedsitter', label: 'Bedsitters' },
  { id: 'Self_contain', label: 'Self contain' },
  { id: 'Flat', label: 'Flats' },
  { id: 'Boys_quarters', label: 'Boys quarters' },
  { id: 'Duplex', label: 'Duplexes' },
  { id: 'Apartment', label: 'Apartment' },
  { id: 'Mansion', label: 'Mansion' },
  { id: 'Commercial', label: 'Commercial' },
  { id: 'Land', label: 'Land' },
]


export function TypeFilter({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}) {
  const selectedLabel = PROPERTY_CATEGORIES.find(option => option.id === value)?.label || 'Type'

  return (
    <FilterShell title={selectedLabel} active={!!value && value !== 'all'} >
      {(close) => (
      <div className="space-y-4">
        {PROPERTY_CATEGORIES.slice(1).map(option => (
          <label
            key={option.id}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="radio"
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="w-4 h-4 accent-[#E87722]"
            />
            <span className="text-sm text-gray-800">
              {option.label}
            </span>
          </label>
        ))}

        <OrangeButton
          fullWidth
          onClick={()=>{
            close();
          }}
          className="py-2 text-sm rounded-lg"
        >
          Apply
        </OrangeButton>
      </div>
       )}
    </FilterShell>
  )
}


export function BedsBathsFilter({
  onApply,
}: {
  onApply: (beds?: number, baths?: number) => void
}) {
  const [beds, setBeds] = useState('')
  const [baths, setBaths] = useState('')

  return (
    <FilterShell title="Beds & Baths">
      {(close) => (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              value={beds}
              onChange={e => setBeds(e.target.value)}
              placeholder="No of bedroom"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E87722]"
            />
            <span className="text-gray-400">—</span>
            <input
              value={baths}
              onChange={e => setBaths(e.target.value)}
              placeholder="No of bathroom"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E87722]"
            />
          </div>

          <OrangeButton
            fullWidth
            onClick={() => {
              onApply(
                beds ? Number(beds) : undefined,
                baths ? Number(baths) : undefined
              )
              close() // ✅ CLOSE MODAL
            }}
            className="py-2 text-sm rounded-lg"
          >
            Apply
          </OrangeButton>
        </div>
      )}
    </FilterShell>
  )
}
