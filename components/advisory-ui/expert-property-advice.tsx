'use client';

import { useRef, useState } from 'react';
import { Link, MessageCircle, X } from 'lucide-react';
import Input from '@/components/input';
import { OrangeButton } from '@/components/button/button';
import { cn } from '@/lib/utils';

type SelectOption = {
  label: string;
  value: string;
};

interface ExpertPropertyAdviceFormProps {
  propertyTypes: SelectOption[];
  budgetRanges: SelectOption[];
  onSubmit?: (data: {
    propertyType: string;
    location: string;
    budgetRange: string;
    propertyLink: string;
    files: File[];
  }) => void;
  className?: string;
}

export default function ExpertPropertyAdviceForm({
  propertyTypes,
  budgetRanges,
  onSubmit,
  className,
}: ExpertPropertyAdviceFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [propertyLink, setPropertyLink] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const incoming = Array.from(selectedFiles);
    const merged = [...files];

    incoming.forEach((file) => {
      const alreadyExists = merged.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified,
      );

      if (!alreadyExists) {
        merged.push(file);
      }
    });

    setFiles(merged);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit?.({
      propertyType,
      location,
      budgetRange,
      propertyLink,
      files,
    });
  };

  return (
    <section className={cn('w-full px-4 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-[#e0e0e0] bg-[#fafafa] px-5 py-8 sm:px-8 sm:py-10 lg:px-9">
        <div className="text-center">
          <h2 className="text-[18px] font-semibold text-black sm:text-[22px]">
            Get Expert Property Advice
          </h2>
          <p className="mt-2 text-[12px] text-black sm:text-[14px]">
            Tell us about your property needs and we’ll connect you with the right advisor
          </p>
        </div>

        <div className="mt-12 space-y-5 sm:mt-16">
          <SelectField
            label="What are you trying to buy/rent?"
            value={propertyType}
            onChange={setPropertyType}
            placeholder="Select Property Type"
            options={propertyTypes}
          />

          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="E.g enter city, area or Specific location"
            className="px-4 text-[13px]"
          />

          <SelectField
            label="Budget Range"
            value={budgetRange}
            onChange={setBudgetRange}
            placeholder="Select Budget Range"
            options={budgetRanges}
          />

          <div className="pt-10">
            <label className="mb-3 block text-[15px] text-[#3E3E3E] sm:text-[16px]">
              Property Link (Optional)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              className={cn(
                'flex min-h-[190px] w-full flex-col items-center justify-center rounded-md border border-dashed px-5 text-center transition sm:min-h-[235px]',
                isDragging ? 'border-[#e87722] bg-[#fff7f1]' : 'border-[#bdbdbd] bg-white',
              )}
            >
              <Link className="h-9 w-9 text-[#777777] sm:h-11 sm:w-11" strokeWidth={2.8} />

              <p className="mt-5 text-[12px] text-[#565656] sm:text-[13px]">
                <span className="font-semibold text-[#1685ff]">
                  Paste Rulbist Property Link Here
                </span>{' '}
                or drag & drop files here
              </p>

              <p className="mt-1 text-[10px] text-[#777777] sm:text-[11px]">
                Property documents, Images or links
              </p>
            </button>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  >
                    <span className="truncate pr-3 text-gray-700">{file.name}</span>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500"
                      aria-label="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Input
              value={propertyLink}
              onChange={(e) => setPropertyLink(e.target.value)}
              placeholder="https://rulbist.com/property/..."
              className="mt-5 px-4 text-[13px]"
            />
          </div>

          <div className="mx-auto pt-8 sm:max-w-2xl">
            <OrangeButton
              fullWidth
              onClick={handleSubmit}
              iconSrc="/icons/whatsapp.svg"
              iconAlt="whatsapp"
              iconSize={18}
              className="min-h-[50px] rounded-md text-[14px] sm:text-[16px]"
            >
              Talk to Our Team
            </OrangeButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[15px] text-[#3E3E3E] sm:text-[16px]">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#808080] bg-white px-4 py-3 text-[13px] text-[#777777] outline-none focus:border-transparent focus:ring-2 focus:ring-[#e87722]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
