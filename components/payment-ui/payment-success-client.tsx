'use client';

import { useGetPaymentDeails } from '@/app/apis/mutations/use-payment/use-get-payment';
import PaymentReceipt from '@/components/payment-ui/payment-receipt';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TourSuccessModal from '../popUp/tour-popup';
import { useDownloadReceipt } from '@/app/apis/mutations/use-payment/use-get-download-recipt';
import { useAuth } from '@/components/layout/auth-provider';

function PaymentSuccessSkeleton() {
  return (
    <div
      className="min-h-screen bg-white px-4 py-6 mt-17 animate-pulse"
      aria-busy="true"
      aria-label="Loading payment receipt"
    >
      <div className="max-w-3xl mx-auto mb-4">
        <div className="h-6 w-6 rounded bg-gray-200" />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <div className="mx-auto h-7 w-56 rounded bg-gray-200" />
        <div className="mx-auto mt-3 h-4 w-64 rounded bg-gray-200" />
        <div className="mx-auto mt-2 h-3 w-72 max-w-full rounded bg-gray-200" />

        <div className="mt-6 rounded-xl bg-[#EFEFEF] p-6 md:p-8">
          <div className="mx-auto mb-6 h-5 w-40 rounded bg-gray-200" />

          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between gap-6">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-4 w-36 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          <div className="my-6 h-px bg-gray-200" />

          <div className="flex items-center justify-between gap-6">
            <div className="h-5 w-28 rounded bg-gray-200" />
            <div className="h-5 w-32 rounded bg-gray-200" />
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="h-12 w-full rounded-lg bg-gray-200" />
          <div className="h-12 w-full rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessClient({ reference }: { reference: string }) {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useAuth();

  const { data, isLoading, isError } = useGetPaymentDeails(reference);
  const { mutate: downloadReceipt, isPending } = useDownloadReceipt();

  const info = data?.data;
  const [open, setOpen] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // ✅ CLEANUP (this is what you're missing)
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const formatTransactionId = (paidAt: string, transactionId: string) => {
    const year = new Date(paidAt).getFullYear();
    return `TNX-${year}-${transactionId}`;
  };

  if (isLoading || isUserLoading) {
    return <PaymentSuccessSkeleton />;
  }

  if (isError || !data) {
    return <div className="p-6 text-red-500">Failed to verify payment</div>;
  }
  const handleNext = () => {
    if (info?.paymentFor == 'property') {
      return router.push(`/verification?id=${data.data?.verification}`);
    }
    return setOpen(true);
  };

  const payment = {
    transactionId: formatTransactionId(
      info?.paidAt ?? '',
      info?.transactionId ?? '', // or data.id if you have it
    ),
    paymentMethod: info?.paymentMethod || 'Payment',
    amount: info?.amount ?? 0,
    date: formatDate(info?.paidAt ?? ''),
  };

  return (
    <>
      <PaymentReceipt
        transactionId={payment.transactionId}
        paymentMethod={payment.paymentMethod}
        date={payment.date}
        name={info?.paymentFor ?? ''}
        amount={`₦${payment.amount.toLocaleString()}`}
        onComplete={handleNext}
        isDownloading={isPending}
        onDownload={() => downloadReceipt(info?._id ?? '')}
      />
      <TourSuccessModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onBackToProfile={() => {
          if (user?.user.roles.includes('Home_Seeker')) {
            router.push('/house-seeker/profile');
            return;
          }

          router.push('/agent/private');
        }}
      />
    </>
  );
}
