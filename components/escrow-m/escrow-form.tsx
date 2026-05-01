'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import EscrowStepOne from './escrow-step-one';
import EscrowStepTwo from './price-plan/escrow-step-two';
import EscrowStepThree from './payment-summary/escrow-step-three';
import EscrowStepFour from './payment-confirmation/escrow-step-four';
import { IconImage } from '../icon-image/icon-image';
import { useVerifyBuyerProperty } from '@/app/apis/mutations/use-property/use-post-veryfy-user';
import { useGetCurrentUser } from '@/app/apis/mutations/use-user/use-get-current-user';
import { useGetPlans } from '@/app/apis/mutations/use-plan/use-get-plan';
import { PricingPlan } from './price-plan/pricing-card';
import { useGetPropertyById } from '@/app/apis/mutations/use-property/use-get-property-by-id';

export interface EscrowFormData {
  fullName: string;
  email: string;
  phone: string;
  nin: string;
  file: File | null;
}

const TOTAL_STEPS = 4;

interface EscrowFormProps {
  id: string;
}

export default function EscrowForm({ id }: EscrowFormProps) {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const { mutate, isPending } = useVerifyBuyerProperty();
  const { data, isLoading, refetch } = useGetCurrentUser();
  const { data: propertyData, error: propertyError } = useGetPropertyById(id);
  const { data: plans, isLoading: isPlansLoading } = useGetPlans();
  const planOptions: PricingPlan[] =
    plans?.data?.map((plan) => ({
      id: plan._id,
      title: plan.name,
      price: plan.amount,
      features: plan.features ?? [],
    })) ?? [];
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const effectiveSelectedPlanId = selectedPlanId ?? planOptions[0]?.id ?? null;

  const currentUser = data?.data?.user;
  const homeSeeker = data?.data?.homeSeeker;
  const agent = data?.data?.agent;

  const isHomeSeeker = currentUser?.roles.includes('Home_Seeker') ?? false;
  const isAgent = currentUser?.roles.includes('Agent') ?? false;

  const ninVerified =
    (isHomeSeeker && homeSeeker?.kycStatus?.ninVerified === true) ||
    (isAgent && agent?.kycStatus?.ninVerified === true);

  const isPlanActive =
    (isHomeSeeker && homeSeeker?.isPlanActive === true) ||
    (isAgent && agent?.isPlanActive === true);

  const [formData, setFormData] = useState<EscrowFormData>({
    fullName: '',
    email: '',
    phone: '',
    nin: '',
    file: null,
  });

  const updateForm = (data: Partial<EscrowFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const selectedPlan = planOptions.find((plan) => plan.id === effectiveSelectedPlanId);
  const property = propertyData?.data;
  const propertyPrice = property?.price ?? 0;
  const agentFee = property?.agentFee ?? 0;
  const verificationFee = isPlanActive ? undefined : selectedPlan?.price;

  // Auto-step rules:
  // 1) If already NIN verified, skip step 1 automatically.
  // 2) If on step 2 and plan is active, skip to step 3 automatically.
  useEffect(() => {
    if (isLoading || isPending) return;

    if (step === 1 && ninVerified) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(2);
      return;
    }

    if (step === 2 && isPlanActive) {
      setStep(3);
    }
  }, [step, ninVerified, isPlanActive, isLoading, isPending]);

  const nextStep = () => {
    if (isLoading || isPending) return;
    if (propertyError) {
      toast.error((propertyError as Error).message);
      return;
    }

    if (step === TOTAL_STEPS) {
      if (isPlanActive) {
        router.push(`/payment/${id}`);
        return;
      }

      if (!effectiveSelectedPlanId) {
        toast.error('Please select a verification plan.');
        return;
      }

      router.push(`/payment/${id}?planId=${encodeURIComponent(effectiveSelectedPlanId)}`);
      return;
    }

    // Step 1 behavior:
    // - verified users are auto-moved by useEffect
    // - unverified users stay on step 1, and verification mutation is triggered
    if (step === 1) {
      if (!ninVerified) {
        const payload = new FormData();
        payload.append('fullName', formData.fullName);
        payload.append('email', formData.email);
        payload.append('phone', formData.phone);
        payload.append('nin', formData.nin);
        if (formData.file) payload.append('ninSlip', formData.file);

        mutate(
          { data: payload, propertyId: id },
          {
            onSuccess: async () => {
              await refetch();
              toast.success('Verification submitted. Complete NIN verification to continue.');
              setStep(1);
            },
          },
        );
        return;
      }

      setStep(2);
      return;
    }

    // Step 2 behavior:
    // - move to step 3 when a plan is selected
    if (step === 2) {
      if (!effectiveSelectedPlanId) {
        toast.error('Please select a verification plan.');
        return;
      }
      setStep(3);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center px-4 md:px-0 py-10 mt-5">
      <div className="w-full max-w-3xl">
        <div className="relative flex items-center justify-center mb-10 h-10">
          <button onClick={prevStep} className="absolute left-0 flex items-center" type="button">
            <IconImage src="/icons/chevron-left.svg" alt="back" width={20} height={20} />
          </button>

          <h1 className="text-lg md:text-xl font-semibold text-center">Escrow Initiation</h1>

          <div className="absolute right-0 text-sm font-medium">
            <span className="text-[#E87722]">{String(step).padStart(2, '0')}</span> of{' '}
            {String(TOTAL_STEPS).padStart(2, '0')}
          </div>
        </div>

        {step === 1 && (
          <EscrowStepOne
            isLoading={isPending}
            formData={formData}
            updateForm={updateForm}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <EscrowStepTwo
            plans={planOptions}
            selectedPlanId={effectiveSelectedPlanId}
            onSelectPlan={setSelectedPlanId}
            isLoading={isPlansLoading}
            onNext={nextStep}
          />
        )}
        {step === 3 && (
          <EscrowStepThree
            onNext={nextStep}
            propertyPrice={propertyPrice}
            agencyFee={agentFee}
            verificationFee={verificationFee}
          />
        )}
        {step === 4 && (
          <EscrowStepFour
            onConfirm={nextStep}
            propertyPrice={propertyPrice}
            agencyFee={agentFee}
            verificationFee={verificationFee}
          />
        )}
      </div>
    </div>
  );
}
