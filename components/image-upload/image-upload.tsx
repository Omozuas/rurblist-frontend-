'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IconImage } from '@/components/icon-image/icon-image';

type ImageUploadProps = {
  label: string;
  maxFiles?: number;
  description?: string;
  onUpload?: (files: File[]) => void;
  gridCols?: number;
  isVideo?: boolean;
};

type UploadedFile = {
  file: File;
  previewUrl: string;
};

export default function ImageUpload({
  label,
  maxFiles = 6,
  description,
  onUpload,
  gridCols = 4,
  isVideo = false,
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFilesRef = useRef<UploadedFile[]>([]);

  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  useEffect(() => {
    return () => {
      uploadedFilesRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const emitUpload = (items: UploadedFile[]) => {
    onUpload?.(items.map((item) => item.file));
  };

  const addFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList || []);
    const remainingSlots = maxFiles - uploadedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    const newFiles = [
      ...uploadedFiles,
      ...filesToAdd.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ];

    setUploadedFiles(newFiles);
    emitUpload(newFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const removedFile = uploadedFiles[index];
    const newFiles = uploadedFiles.filter((_, i) => i !== index);

    if (removedFile) {
      URL.revokeObjectURL(removedFile.previewUrl);
    }

    setUploadedFiles(newFiles);
    emitUpload(newFiles);
  };

  const gridColsClass =
    {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    }[gridCols] || 'grid-cols-4';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-[16px] text-[#3E3E3E] font-medium">{label}</label>
        {description && <span className="text-sm text-gray-500">{description}</span>}
      </div>

      <div className={`grid ${gridColsClass} gap-4`}>
        {uploadedFiles.map((item, index) => (
          <div
            key={item.previewUrl}
            className="relative border border-[#808080] rounded-lg overflow-hidden aspect-square bg-gray-50"
          >
            {isVideo ? (
              <video src={item.previewUrl} className="w-full h-full object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.previewUrl}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}

            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              aria-label="Remove upload"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}

        {uploadedFiles.length < maxFiles && (
          <button
            type="button"
            onClick={handleUploadClick}
            className="border-2 border-dashed border-[#808080] rounded-lg aspect-square flex items-center justify-center hover:border-[#e87722] hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <IconImage src="/upload-cloud.png" alt="upload" width={24} height={24} />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={maxFiles > 1}
        accept={isVideo ? 'video/*' : 'image/*'}
        onChange={handleFileSelect}
      />
    </div>
  );
}
