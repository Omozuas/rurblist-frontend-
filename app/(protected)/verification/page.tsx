import VerificationTrackerClient from '@/components/verification/verification-client';

export default async function VerificationTrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;

  return <VerificationTrackerClient verificationId={params?.id ?? ''} />;
}
