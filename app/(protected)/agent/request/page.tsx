'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLayoutStore } from '@/store/layout-store';
import BackNavbar from '@/components/agent-c/back-navbar';
import Input from '@/components/input';
import Textarea from '@/components/text-area';
import { OrangeButton } from '@/components/button/button';
import SelectDropdown from '@/components/dropdown/select-dropdown';
import { useAgentForm } from '@/app/apis/store/agent-store';
import { useFileUpload } from '@/app/apis/hooks/use-file-upload';

export default function AgentRequestFormPage() {
  const router = useRouter();
  const setHideNavbar = useLayoutStore((s) => s.setHideNavbar);
  const { setForm } = useAgentForm();

  // ✅ FORM STATE
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [nationality, setNationality] = useState('nigeria');
  const [nin, setNin] = useState('');
  const [cacNumber, setCacNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [description, setDescription] = useState('');

  // ✅ FILES
  const { file: selfieFile, preview: selfiePreview, handleFile: handleSelfie } = useFileUpload();
  const {
    file: ninFile,
    preview: ninPreview,
    fileName: ninFileName,
    handleFile: handleNin,
  } = useFileUpload();

  const {
    file: cacFile,
    preview: cacPreview,
    fileName: cacFileName,
    handleFile: handleCac,
  } = useFileUpload();

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  // ✅ VALIDATION
  const isValid = firstName && lastName && nin && yearsOfExperience > 0 && selfieFile && ninFile;

  // ✅ NEXT STEP
  const handleNext = () => {
    if (!isValid) return;

    setForm({
      firstName,
      lastName,
      dateOfBirth,
      city,
      address,
      nationality,
      nin,
      cacNumber,
      companyName,
      yearsOfExperience,
      description,
      selfie: selfieFile!,
      ninSlip: ninFile!,
      cacDoc: cacFile || undefined,
    });

    router.push('/agent/agreement');
  };

  return (
    <div>
      <BackNavbar logoSrc="/Rublist.svg" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-6 text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold font-[Georgia] text-[#833700]">
            Agent Request Form
          </h1>
          <p className="text-gray-500 mt-2">
            Please fill out your information to become a verified agent
          </p>
        </div>
        {/* ================= PERSONAL ================= */}
        <h2 className="text-xl sm:text-2xl font-bold font-[Georgia] text-[#833700] mb-6">
          Personal Information
        </h2>

        {/* FORM */}
        <div className="space-y-6">
          {/* SELFIE */}
          <UploadBox label="Upload Selfie" onFile={handleSelfie} preview={selfiePreview} />

          {/* NAMES */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              label="First Name"
              className="p-4"
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              label="Last Name"
              className="p-4"
            />
          </div>

          {/* DOB + CITY */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              label="Date of Birth"
              className="p-4"
            />
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              label="City"
              className="p-4"
            />
          </div>

          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            label="Address"
            className="p-4"
          />

          {/* NATIONALITY */}
          <div className="grid md:grid-cols-2 gap-6">
            <SelectDropdown
              label="Nationality"
              value={nationality}
              onChange={setNationality}
              options={[
                { label: 'Nigeria', value: 'nigeria' },
                { label: 'United States', value: 'usa' },
                { label: 'Japan', value: 'japan' },
                { label: 'Ghana', value: 'ghana' },
              ]}
            />

            <Input
              value={nin}
              onChange={(e) => setNin(e.target.value)}
              label="NIN Number"
              className="p-4"
            />
          </div>

          {/* NIN */}
          <UploadBox
            label="Upload NIN Slip"
            onFile={handleNin}
            preview={ninPreview}
            fileName={ninFileName}
          />

          {/* COMPANY */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              label="Company Name"
              className="p-4"
            />
            <Input
              type="number"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              label="Years of Experience"
              className="p-4"
            />
          </div>

          {/* BIO */}
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="About Agent"
            className="p-4"
          />
          {/* ================= BUSINESS ================= */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold font-[Georgia] text-[#833700]">
                Business Information
              </h2>

              <span className="text-xs bg-[#FCE7D6] text-[#7A3E0A] px-3 py-1 rounded-md">
                Optional
              </span>
            </div>
            {/* CAC */}
            <Input
              value={cacNumber}
              onChange={(e) => setCacNumber(e.target.value)}
              label="CAC Number"
              className="p-4"
            />

            <UploadBox
              label="Upload CAC Slip"
              onFile={handleCac}
              preview={cacPreview}
              fileName={cacFileName}
            />
          </div>
          {/* BUTTON */}
          <OrangeButton onClick={handleNext} disabled={!isValid} fullWidth>
            Submit Request
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}

/* UPLOAD */
function UploadBox({
  label,
  onFile,
  preview,
  fileName,
}: {
  label: string;
  onFile: (file?: File) => void;
  preview?: string | null;
  fileName?: string | null;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-700">{label}</p>

      <label className="w-full border-2 border-dashed border-gray-300 rounded-lg px-6 py-6 flex items-center justify-center cursor-pointer hover:border-[#e87722] transition">
        <input type="file" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

        {/* IMAGE */}
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="h-20 w-20 object-cover rounded-md" />
        ) : fileName ? (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>📄</span>
            <span className="truncate max-w-50">{fileName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <span className="text-lg">📷</span>
            <span>Click to upload your {label.toLowerCase()}</span>
          </div>
        )}
      </label>
    </div>
  );
}
