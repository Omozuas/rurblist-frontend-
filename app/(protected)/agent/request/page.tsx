'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useFileUpload } from '@/app/apis/hooks/use-file-upload';
import { useUpdateAgent } from '@/app/apis/mutations/use-agent/post-agent';
import { useGetCurrentUser } from '@/app/apis/mutations/use-user/use-get-current-user';
import { useAgentForm } from '@/app/apis/store/agent-store';
import BackNavbar from '@/components/agent-c/back-navbar';
import { OrangeButton } from '@/components/button/button';
import SelectDropdown from '@/components/dropdown/select-dropdown';
import Input from '@/components/input';
import Textarea from '@/components/text-area';
import { useLayoutStore } from '@/store/layout-store';

export default function AgentRequestFormPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setHideNavbar = useLayoutStore((s) => s.setHideNavbar);
  const { setForm } = useAgentForm();
  const { data: currentUserData, refetch } = useGetCurrentUser();
  const { mutate: updateAgent, isPending: isUpdating } = useUpdateAgent();

  const agent = currentUserData?.data?.agent;
  const isUpdateMode = Boolean(agent?.isAgreement);

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

  useEffect(() => {
    if (!agent) return;

    const timer = window.setTimeout(() => {
      setFirstName(agent.firstName || '');
      setLastName(agent.lastName || '');
      setDateOfBirth(agent.dateOfBirth?.slice(0, 10) || '');
      setCity(agent.city || '');
      setAddress(agent.address || '');
      setNationality(agent.nationality || 'nigeria');
      setNin(agent.nin || '');
      setCacNumber(agent.cacNumber || '');
      setCompanyName(agent.companyName || '');
      setYearsOfExperience(agent.yearsOfExperience || 0);
      setDescription(agent.description || '');
    }, 0);

    return () => window.clearTimeout(timer);
  }, [agent]);

  const isValid = isUpdateMode
    ? true
    : firstName && lastName && nin && yearsOfExperience > 0 && selfieFile && ninFile;

  const handleNext = () => {
    if (!isValid) return;

    if (isUpdateMode) {
      updateAgent(
        {
          city,
          address,
          nationality,
          companyName,
          yearsOfExperience,
          description,
          cacNumber,
          selfie: selfieFile || undefined,
          selfiePublicId: selfieFile ? agent?.selfieUrl?.public_id : undefined,
          cacDoc: cacFile || undefined,
          cacDocPublicId: cacFile ? agent?.cacDocumentUrl?.public_id : undefined,
        },
        {
          onSuccess: async () => {
            toast.success('Agent profile updated successfully');
            await queryClient.invalidateQueries({ queryKey: ['current-user'] });
            await refetch();
          },
        },
      );
      return;
    }

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

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-10 rounded-xl bg-white p-6 text-center shadow">
          <h1 className="font-[Georgia] text-2xl font-bold text-[#833700] sm:text-3xl">
            {isUpdateMode ? 'Update Your Agent Profile' : 'Agent Request Form'}
          </h1>
          <p className="mt-2 text-gray-500">
            {isUpdateMode
              ? 'Update your agent information below.'
              : 'Please fill out your information to become a verified agent'}
          </p>
        </div>

        <h2 className="mb-6 font-[Georgia] text-xl font-bold text-[#833700] sm:text-2xl">
          Personal Information
        </h2>

        <div className="space-y-6">
          <UploadBox
            label={isUpdateMode ? 'Upload New Selfie (Optional)' : 'Upload Selfie'}
            onFile={handleSelfie}
            preview={selfiePreview}
            currentUrl={isUpdateMode ? agent?.selfieUrl?.url : undefined}
            file={selfieFile}
            accept="image/*"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              label="First Name"
              disabled={isUpdateMode}
              className="p-4"
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              label="Last Name"
              disabled={isUpdateMode}
              className="p-4"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              label="Date of Birth"
              disabled={isUpdateMode}
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

          <div className="grid gap-6 md:grid-cols-2">
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
              disabled={isUpdateMode}
              className="p-4"
            />
          </div>

          {!isUpdateMode && (
            <UploadBox
              label="Upload NIN Slip"
              onFile={handleNin}
              preview={ninPreview}
              file={ninFile}
              fileName={ninFileName}
              accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          )}

          {isUpdateMode && <ReadOnlyDocument label="NIN Slip" url={agent?.ninSlipUrl?.url} />}

          <div className="grid gap-6 md:grid-cols-2">
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

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="About Agent"
            className="p-4"
          />

          <div className="mt-12">
            <div className="mb-6 flex items-center gap-3">
              <h2 className="font-[Georgia] text-xl font-bold text-[#833700] sm:text-2xl">
                Business Information
              </h2>

              <span className="rounded-md bg-[#FCE7D6] px-3 py-1 text-xs text-[#7A3E0A]">
                Optional
              </span>
            </div>

            <Input
              value={cacNumber}
              onChange={(e) => setCacNumber(e.target.value)}
              label="CAC Number"
              className="p-4"
            />

            <UploadBox
              label={isUpdateMode ? 'Upload New CAC Slip (Optional)' : 'Upload CAC Slip'}
              onFile={handleCac}
              preview={cacPreview}
              file={cacFile}
              fileName={cacFileName}
              accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            {isUpdateMode && (
              <div className="mt-4">
                <ReadOnlyDocument label="Current CAC Slip" url={agent?.cacDocumentUrl?.url} />
              </div>
            )}
          </div>

          {isUpdateMode && (
            <p className="text-center text-sm text-gray-500">
              To update your first name, last name, date of birth, NIN number, or NIN slip, please
              contact a Rurblist agent.
            </p>
          )}

          <OrangeButton onClick={handleNext} disabled={!isValid} loading={isUpdating} fullWidth>
            {isUpdateMode ? 'Update Profile' : 'Submit Request'}
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}

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

  if (file.type.startsWith('image/')) return 'Image file';

  return 'Selected document';
}

function getFileBadge(file: File) {
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type.startsWith('image/')) return 'IMG';
  return 'DOC';
}

function UploadBox({
  label,
  onFile,
  preview,
  currentUrl,
  file,
  fileName,
  accept,
}: {
  label: string;
  onFile: (file?: File) => void;
  preview?: string | null;
  currentUrl?: string | null;
  file?: File | null;
  fileName?: string | null;
  accept?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-700">{label}</p>

      <label className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-6 transition hover:border-[#e87722]">
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        {preview && file ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="h-20 w-20 rounded-md object-cover" />
        ) : currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt={label} className="h-20 w-20 rounded-md object-cover" />
        ) : file ? (
          <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-sm font-semibold text-[#E87722]">
                {getFileBadge(file)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {fileName || file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {getFileLabel(file)} - {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="text-lg">Upload</span>
            <span>Click to upload your {label.toLowerCase()}</span>
          </div>
        )}
      </label>
    </div>
  );
}

function ReadOnlyDocument({ label, url }: { label: string; url?: string }) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-700">{label}</p>

      <div className="flex w-full items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-100 px-6 py-5 text-sm text-gray-600">
        <span>{url ? 'Current document on file' : 'No document uploaded'}</span>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#833700] hover:text-[#e87722]"
          >
            View
          </a>
        )}
      </div>
    </div>
  );
}
