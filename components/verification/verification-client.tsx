'use client';

import { useRouter } from 'next/navigation';
import { IconImage } from '@/components/icon-image/icon-image';
import { OrangeButton } from '@/components/button/button';
import { useGetVerificationById } from '@/app/apis/mutations/use-verification/use-get-verification-byid';
import AgentCard from './agent-v-ui';
import CurrentStatusCard from './current-stage-v-ui';
import DocumentStatus from './document-v-ui';
import ActivityTimeline from './activetimeline-v-ui';
import type { ActivityStatus } from './activetimeline-v-ui';
import type { DocumentStatusType } from './document-v-ui';

export default function VerificationTrackerClient({ verificationId }: { verificationId: string }) {
  const router = useRouter();
  const { data, isLoading } = useGetVerificationById(verificationId);
  const verification = data?.data;
  const agentInfo = verification?.agent;
  const agentName =
    [agentInfo?.firstName, agentInfo?.lastName].filter(Boolean).join(' ') || 'Assigned Agent';
  const agentCompany = agentInfo?.companyName || 'Real Estate Agent';
  const agentImage =
    agentInfo?.user?.profileImage?.url || agentInfo?.selfieUrl.url || '/image/profile-image2.jpg';
  const trustScore = agentInfo?.isPlanActive ? 'Verified' : 'Pending';
  const currentStageTitle = verification?.currentStage?.title || 'Verification in progress';
  const currentStageDescription =
    verification?.currentStage?.description || 'Our team is verifying property documents';
  const currentStageEstimate = verification?.currentStage?.estimatedCompletion
    ? `Estimated completion: ${verification.currentStage.estimatedCompletion}`
    : undefined;
  const documents =
    verification?.documents?.map((document) => ({
      label: document.name,
      status: normalizeDocumentStatus(document.status),
    })) ?? [];
  const timeline =
    verification?.timeline?.map((item) => ({
      title: item.title,
      date: item.date,
      status: normalizeTimelineStatus(item.status),
    })) ?? [];

  if (isLoading) {
    return <VerificationTrackerSkeleton onBack={() => router.back()} />;
  }

  return (
    <>
      <header className="w-full bg-white pt-[80px]">
        <div className="relative mx-auto flex min-h-[140px] w-full max-w-6xl flex-col items-center justify-center px-5 pb-6 sm:flex-row sm:px-8">
          <div className="w-full sm:hidden mb-4 flex justify-start">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black hover:bg-gray-100"
            >
              <IconImage
                src="/icons/chevron-left.svg"
                alt="back"
                className="h-6 w-6"
                width={20}
                height={20}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="hidden sm:flex absolute left-5 top-6 h-9 w-9 items-center justify-center rounded-full text-black hover:bg-gray-100 sm:left-8"
          >
            <IconImage
              src="/icons/chevron-left.svg"
              alt="back"
              className="h-6 w-6 sm:h-7 sm:w-7"
              width={20}
              height={20}
            />
          </button>

          <div className="flex flex-col items-center text-center">
            <h1 className="text-[19px] font-semibold text-black sm:text-[22px]">
              Verification Tracker
            </h1>

            <p className="mt-4 text-[17px] font-medium text-black sm:text-[20px]">
              Live status dashboard for your property verification
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        <AgentCard
          name={agentName}
          company={agentCompany}
          imageSrc={agentImage}
          trustScore={trustScore}
          onChat={() => {
            router.push(`/agent/profile/${agentInfo?.user._id}`);
          }}
        />

        <CurrentStatusCard
          title={currentStageTitle}
          description={currentStageDescription}
          estimate={currentStageEstimate}
          iconSrc="/icons/Document.svg"
        />

        <DocumentStatus documents={documents} />

        <ActivityTimeline items={timeline} />
      </div>

      <section className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="mx-auto w-full max-w-3xl">
          <OrangeButton
            fullWidth
            onClick={() => {
              router.push(`/payment/complete/${verificationId}`);
            }}
            className="min-h-[56px] sm:min-h-[60px] text-[15px] sm:text-[17px]"
          >
            View Certificate
          </OrangeButton>
        </div>
      </section>
    </>
  );
}

function normalizeDocumentStatus(status?: string): DocumentStatusType {
  const value = status?.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_');

  if (
    value === 'pending' ||
    value === 'submitted' ||
    value === 'under_review' ||
    value === 'verified' ||
    value === 'rejected'
  ) {
    return value;
  }

  if (value === 'approved' || value === 'completed') return 'verified';
  if (value === 'review' || value === 'in_review') return 'under_review';

  return 'pending';
}

function normalizeTimelineStatus(status?: string): ActivityStatus {
  const value = status?.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_');

  if (value === 'success' || value === 'completed' || value === 'verified') return 'success';
  if (value === 'failed' || value === 'rejected') return 'failed';
  if (value === 'warning' || value === 'pending' || value === 'under_review') return 'warning';

  return 'info';
}

function VerificationTrackerSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <>
      <header className="w-full bg-white pt-[80px]">
        <div className="relative mx-auto flex min-h-[140px] w-full max-w-6xl flex-col items-center justify-center px-5 pb-6 sm:flex-row sm:px-8">
          <div className="w-full sm:hidden mb-4 flex justify-start">
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black hover:bg-gray-100"
            >
              <IconImage
                src="/icons/chevron-left.svg"
                alt="back"
                className="h-6 w-6"
                width={20}
                height={20}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="hidden sm:flex absolute left-5 top-6 h-9 w-9 items-center justify-center rounded-full text-black hover:bg-gray-100 sm:left-8"
          >
            <IconImage
              src="/icons/chevron-left.svg"
              alt="back"
              className="h-6 w-6 sm:h-7 sm:w-7"
              width={20}
              height={20}
            />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="h-6 w-56 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </header>

      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl rounded-2xl bg-[#eeeeee] px-6 py-7 sm:px-10 sm:py-8">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-300" />
            <div className="mt-6 flex items-start gap-4">
              <div className="h-[54px] w-[54px] animate-pulse rounded-full bg-gray-300" />
              <div className="space-y-3">
                <div className="h-5 w-44 animate-pulse rounded bg-gray-300" />
                <div className="h-4 w-36 animate-pulse rounded bg-gray-300" />
                <div className="h-6 w-28 animate-pulse rounded-full bg-gray-300" />
              </div>
            </div>
            <div className="mt-6 grid max-w-[680px] grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-11 animate-pulse rounded-lg bg-gray-300" />
              <div className="h-11 animate-pulse rounded-lg bg-gray-300" />
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="h-7 w-44 animate-pulse rounded bg-gray-200" />
            <div className="mt-9 flex w-full gap-5 rounded-2xl border border-[#ff9f43] bg-[#fff0d8] px-6 py-8 sm:px-28 sm:py-10">
              <div className="h-[58px] w-[58px] shrink-0 animate-pulse rounded bg-orange-200" />
              <div className="w-full space-y-3">
                <div className="h-5 w-56 animate-pulse rounded bg-orange-200" />
                <div className="h-4 w-72 max-w-full animate-pulse rounded bg-orange-200" />
                <div className="h-4 w-64 max-w-full animate-pulse rounded bg-orange-200" />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="h-7 w-44 animate-pulse rounded bg-gray-200" />
            <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl bg-gray-100 px-5 py-5 sm:px-7 sm:py-6"
                >
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="h-7 w-44 animate-pulse rounded bg-gray-200" />
            <div className="mt-8 space-y-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4 sm:gap-6">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                  <div className="space-y-3 pt-1">
                    <div className="h-5 w-64 max-w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto h-[56px] w-full max-w-3xl animate-pulse rounded-md bg-gray-200" />
      </section>
    </>
  );
}
