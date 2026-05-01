'use client'

import { cn } from '@/lib/utils'

interface AgreementSection {
  title: string
  content: string | string[]
}

interface EscrowAgreementCardProps {
  title: string
  sections: AgreementSection[]
  onDownload?: () => void
  className?: string
}

export function EscrowAgreementCard({
  title,
  sections,
  onDownload,
  className
}: EscrowAgreementCardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-2xl bg-gray-100 p-8',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h3>

        {onDownload && (
          <button
            onClick={onDownload}
            className="text-[#E87722] font-medium hover:underline"
          >
            Download
          </button>
        )}
      </div>

      {/* Sections */}
      <div className="divide-y divide-gray-200">
        {sections.map((section, index) => (
          <div key={index} className="py-6 first:pt-0">
            <div className="flex gap-3">
              {/* Orange diamond */}
              <div className="mt-2 w-2 h-2 rotate-45 bg-[#E87722] shrink-0" />

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">
                  {section.title}
                </h4>

                {Array.isArray(section.content) ? (
                  <ul className="space-y-2 text-gray-700">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
