'use client';

import { cn } from "@/lib/utils"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

interface RoleCardProps {
  title: string
  description: string
  icon: string | StaticImport
  imageH:number,
  imageW:number
  variant?: "primary" | "secondary"
  selected?: boolean
  onClick?: () => void
  className?: string

}

export function RoleCard({
  title,
  description,
  icon,
  imageH,imageW,
  variant = "secondary",
  selected = false,
  onClick,
  className,

}: RoleCardProps) {
  const isPrimary = variant === "primary"

  return (
    <div
      className={cn(
        "flex flex-col items-center p-6 rounded-lg border transition-all cursor-pointer",
      selected 
          ? "bg-orange-50 border-[#e87722] ring-2 ring-[#e87722]" 
          : isPrimary 
            ? "bg-orange-50/50 border-gray-200" 
            : "bg-white border-gray-200",
        className
      )}
      onClick={onClick}
    >
      <div className="w-full h-40 flex items-center justify-center mb-4">
        <Image
        src={icon}
        alt="key"
        width={imageW}
        height={imageH}
        priority
        
        ></Image>
      </div>

      <h3 className="text-[20px] font-bold text-[#262626] mb-2 text-center">
        {title}
      </h3>

      <p className="text-[#707070] text-[18px] text-center mb-6 leading-relaxed">
        {description}
      </p>

      <button
      
        className={cn(
          "px-8 py-3 rounded-lg font-medium transition-colors",
          selected
            ? "bg-brand-500 hover:bg-[#d66a1a] text-white"
            : "bg-[#7A7A7A] hover:bg-gray-600 text-white"
        )}
      >
        {selected ? "Selected" : "Select"}
      </button>
    </div>
  )
}
