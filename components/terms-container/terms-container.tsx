'use client'

import { cn } from '@/lib/utils'

interface TermsItem {
  content: string
}

interface TermsContainerProps {
  title: string
  downloadLabel?: string
  onDownloadClick?: () => void
  items: TermsItem[]
  className?: string
}

export function TermsContainer({
  title,
  downloadLabel = 'Download',
  onDownloadClick,
  items,
  className
}: TermsContainerProps) {
  return (
    <div className={cn('w-full rounded-lg bg-gray-100 p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {onDownloadClick && (
          <button
            onClick={onDownloadClick}
            className="text-[#e87722] hover:text-[#d66a1a] font-medium transition-colors"
          >
            {downloadLabel}
          </button>
        )}
      </div>

      {/* Terms items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <div className="shrink-0 mt-1">
              <div className="w-2 h-2 bg-[#e87722] rounded-full"></div>
            </div>
            <p className="text-gray-700 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
