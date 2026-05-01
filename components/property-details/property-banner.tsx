'use client'

import React from 'react'
import Image from 'next/image'
import { OrangeButton } from '../button/button'

interface PropertyBannerProps {
  title: string
  description: string
  imageUrl: string
  onLearnMore?: () => void
}

export default function PropertyBanner({
  title,
  description,
  imageUrl,
  onLearnMore
}: PropertyBannerProps) {
  return (
    <div className="rounded-2xl overflow-hidden mb-8 bg-linear-to-r from-[#E87722] via-[#EB8F47] to-[#F4B183]">
      <div className="flex flex-col md:flex-row items-center md:justify-between px-6 md:px-12 py-8 md:py-12 gap-8 md:gap-10">
        {/* Left Content */}
        <div className="flex-1 text-white text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 md:mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0">
            {description}
          </p>
          <OrangeButton
            variant="white"
            onClick={onLearnMore}
            className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-base font-medium"
          >
            Learn More
          </OrangeButton>
        </div>
        {/* Right Image */}
        <div className="flex-1 relative w-full md:w-auto min-h-50 md:min-h-65">
          <Image
            src={imageUrl}
            alt="banner"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}