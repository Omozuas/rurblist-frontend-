'use client';

import React, { useRef, useState, useEffect } from 'react';
import Input from '@/components/input';
import { IconImage } from '@/components/icon-image/icon-image';
import { OrangeButton } from '@/components/button/button';
import type { EscrowFormData } from '@/components/escrow-m/escrow-form';

interface Props {
  formData: EscrowFormData;
  isLoading: boolean;
  updateForm: (data: Partial<EscrowFormData>) => void;
  onNext: () => void;
}

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(size / 1024, 1).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileLabel(file: File) {
  if (file.type === 'application/pdf') return 'PDF document';

  if (
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'Word document';
  }

  return 'Selected document';
}

export default function EscrowStepOne({ formData, updateForm, isLoading, onNext }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    return () => {
      setUploadProgress(0);
    };
  }, []);

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.file) return 'ID upload is required';
    return null;
  };

  const handleFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, PDF, DOC, or DOCX allowed');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError('File must be less than 5MB');
      return;
    }

    setError(null);
    updateForm({ file });

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    simulateUpload();
  };

  const clearFile = () => {
    updateForm({ file: null });
    setPreview(null);
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center px-4 md:px-6">
      <div className="w-full max-w-3xl space-y-6">
        <Input
          label="Full Name"
          value={formData.fullName}
          className="px-4 bg-white"
          onChange={(e) => updateForm({ fullName: e.target.value })}
        />

        <Input
          label="Email Address"
          type="email"
          className="px-4 bg-white"
          value={formData.email}
          onChange={(e) => updateForm({ email: e.target.value })}
        />

        <Input
          label="Phone Number"
          type="tel"
          className="px-4 bg-white"
          value={formData.phone}
          onChange={(e) => updateForm({ phone: e.target.value })}
        />

        <Input
          label="NIN Number"
          type="tel"
          className="px-4 bg-white"
          value={formData.nin}
          onChange={(e) => updateForm({ nin: e.target.value })}
        />

        {/* Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium">Upload ID</label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer relative hover:border-[#E87722] transition-colors flex flex-col items-center justify-center"
          >
            {!preview && !formData.file && (
              <>
                <IconImage src="/icons/upload-cloud.svg" alt="upload" width={40} height={40} />
                <p className="mt-3 text-sm text-gray-500 text-center">Drag or tap to upload</p>
              </>
            )}

            {preview && formData.file && (
              <div className="relative flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {!preview && formData.file && (
              <div className="relative w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-sm font-semibold text-[#E87722]">
                    {formData.file.type === 'application/pdf' ? 'PDF' : 'DOC'}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {formData.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getFileLabel(formData.file)} • {formatFileSize(formData.file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white"
                >
                  ×
                </button>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4 w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="h-full bg-[#E87722] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/jpeg,image/png,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex justify-center mt-10">
          <OrangeButton
            type="submit"
            variant="orange"
            className="w-full md:w-96 py-3"
            loading={isLoading}
          >
            Next
          </OrangeButton>
        </div>
      </div>
    </form>
  );
}
