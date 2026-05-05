import PropertiesClient from '@/components/property-page/properties-client';

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    state?: string;
    status?: string;
    type?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <PropertiesClient
      key={`${params?.search ?? ''}-${params?.state ?? ''}-${params?.status ?? ''}-${params?.type ?? ''}`}
      initialSearch={params?.search ?? ''}
      initialState={params?.state ?? ''}
      initialStatus={params?.status ?? ''}
      initialType={params?.type ?? ''}
    />
  );
}
