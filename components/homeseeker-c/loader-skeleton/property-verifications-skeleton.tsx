export default function PropertyVerificationsSkeleton() {
  return (
    <section className="space-y-5">
      <div className="h-7 w-56 animate-pulse rounded bg-gray-200" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between gap-3">
              <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
            </div>
            <div className="mt-4 h-4 w-44 animate-pulse rounded bg-gray-200" />
            <div className="mt-5 h-3 w-28 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
