'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TermsContainer } from '@/components/terms-container/terms-container'
import { OrangeButton } from '@/components/button/button'
import { Footer } from '@/components/footer/footer'
import { IconImage } from '@/components/icon-image/icon-image'
import { cn } from '@/lib/utils'

export default function KYCPage() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState({
    document: false,
    facial: false
  })

  const handleFileUpload = (type: 'document' | 'facial') => {
    const input = document.createElement('input')
    input.type = 'file'
    
    if (type === 'document') {
      input.accept = 'image/*,.pdf,.doc,.docx'
    } else if (type === 'facial') {
      input.accept = 'video/*,image/*'
    }
    
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement | null
      const file = target?.files?.[0]
      if (file) {
        setUploadedFiles(prev => ({ ...prev, [type]: true }))
      }
    }
    
    input.click()
  }

  const termsItems = [
    {
      content:
        'Agents/Sellers must provide complete and accurate details of properties, including ownership documents (e.g., Certificate of Occupancy, Governor\'s Consent, Survey Plan, Deed of Assignment).'
    },
    {
      content:
        'Uploading false or misleading information may result in suspension or permanent removal.'
    },
    {
      content:
        'By listing on Rurblist, Agents consent to Rurblist deducting 20% of agency fee from every successful transaction'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-8 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
             <button 
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <IconImage
              src="/chevron-left.png"
              alt="back"
              width={24}
              height={24}
            />
          </button>
         
          <h1 className="text-2xl font-semibold text-[#000000]">KYC Verification</h1>
          <p className="font-semibold">
            <span className="text-brand-500 font-bold ">01</span>
            <span className="text-[24] font-normal"> of 03</span>
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Upload sections */}
          <div className="space-y-6 mb-8">
            {/* NIN/CAC Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Upload NIN or CAC Document
              </label>
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
                  uploadedFiles.document
                    ? 'border-[#e87722] bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
                onClick={() => handleFileUpload('document')}
              >
                <IconImage
                            src="/upload-cloud.png"
                            alt="back"
                            width={24}
                            height={24}
                            className="mx-auto mb-3"
                          />
               
                <p className="text-gray-600">
                  {uploadedFiles.document ? 'Document uploaded' : 'Click to upload'}
                </p>
              </div>
            </div>

            {/* Facial Verification */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Facial Verification
              </label>
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
                  uploadedFiles.facial
                    ? 'border-[#e87722] bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
                onClick={() => handleFileUpload('facial')}
              > <IconImage
                            src="/solar_camera-outline.png"
                            alt="back"
                            width={24}
                            height={24}
                            className="mx-auto mb-3"
                          />
               
                <p className="text-gray-600">
                  {uploadedFiles.facial ? 'Verified' : 'Click to verify'}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-700">Pending Review</span>
            </div>
          </div>

          {/* Terms container */}
          <div className="mb-8">
            <TermsContainer
              title="Please read carefully before proceeding"
              downloadLabel="Download"
              onDownloadClick={() => console.log('Download clicked')}
              items={termsItems}
            />
          </div>

          {/* Action button */}
          <div className="flex justify-center">
           <Link href="/kyc/add-property"> <OrangeButton fullWidth>Agree & Continue</OrangeButton></Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

