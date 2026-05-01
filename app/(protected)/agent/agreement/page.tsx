'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLayoutStore } from '@/store/layout-store';
import BackNavbar from '@/components/agent-c/back-navbar';
import { OrangeButton } from '@/components/button/button';
import { useAgentForm } from '@/app/apis/store/agent-store';
import { useCreateAgent } from '@/app/apis/mutations/use-agent/post-agent';
import { buildAgentPayload } from '@/app/apis/utils/build-agent-payload';
import toast from 'react-hot-toast';
import SuccessModal from '@/components/agent-c/modal/create-success-modal';
import { useGetCurrentUser } from '@/app/apis/mutations/use-user/use-get-current-user';

export default function AgentAgreementPage() {
  const setHideNavbar = useLayoutStore((s) => s.setHideNavbar);
  const router = useRouter();
  const { form, reset } = useAgentForm();
  const { data } = useGetCurrentUser();
  const { mutate, isPending } = useCreateAgent(!!data?.data?.agent);
  const [showSuccess, setShowSuccess] = useState(false);
  const today = new Date().toLocaleDateString('en-GB');
  const [isAgreement, setIsAgreement] = useState(false);
  useEffect(() => {
    document.body.style.overflow = showSuccess ? 'hidden' : 'auto';
  }, [showSuccess]);
  const isValid =
    form.firstName && form.lastName && form.nin && form.selfie && form.ninSlip && isAgreement;

  const handleSubmit = () => {
    if (!isValid) return;

    try {
      const payload = buildAgentPayload(form);
      if (data?.data?.agent != null) {
      }
      mutate(payload, {
        onSuccess: () => {
          toast.success('Agent request submitted successfully!');
          setShowSuccess(true); // done: SHOW MODAL
          reset();
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  return (
    <div>
      <BackNavbar logoSrc="/Rublist.svg" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-6 text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold font-[Georgia] text-[#833700]">
            Agent Participation Agreement
          </h1>
          <p className="text-gray-500 mt-2">
            This Agreement outlines the terms for agents participating on the Rurblist platform.
            Please read carefully before accepting.
          </p>
        </div>
        {/* AGREEMENT CONTENT */}

        {/* DOCUMENT */}
        <div className="bg-white rounded-xl border shadow-sm p-6 sm:p-8 space-y-8">
          <div className="p-6 text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#7A3E0A] font-[Georgia]">
              Rurblist Agent Participation Agreement
            </h1>
          </div>
          {/* INTRO */}
          <div className="bg-[#f3f3f3] border-l-4 border-[#e87722] rounded-md p-4 text-sm">
            <p className="font-semibold mb-2">This Agreement is entered into by and between:</p>

            <p>• Rurblist (&quot;Platform&quot;), and</p>

            <div className="flex items-center flex-wrap gap-2 mt-1">
              <span>•</span>

              <input
                value={`${form.firstName || ''} ${form.lastName || ''}`}
                readOnly
                className="
                  border-b border-gray-400 
                  bg-transparent 
                  outline-none 
                  text-sm 
                  px-1
                  min-w-37.5
                  font-medium text-[#7A3E0A]
                "
              />

              <span>(&quot;Agent&quot;), {today}.</span>
            </div>
          </div>

          {/* SECTIONS */}
          <AgreementSection
            title="1. Platform Participation"
            text="Agent agrees to list properties on Rurblist and will only represent properties they are authorized to offer."
          />

          <AgreementSection
            title="2. Payment Structure"
            text={
              <>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    Agent agrees that Rurblist will collect 100% of the agency fee from users.
                  </li>
                  <li>
                    Rurblist retains 20% as platform commission and disburses 80% to the Agent
                    within 5 working days, after:
                  </li>
                </ul>

                <div className="ml-5 mt-2 text-gray-600 text-sm">
                  <p>Confirmation that the deal is closed,</p>
                  <p>Rating and feedback from the user is submitted.</p>
                </div>
              </>
            }
          />

          <AgreementSection
            title="3. Trust & Performance"
            text={
              <>
                <p className="mb-2">Agents who:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Do not deliver as promised,</li>
                  <li>Receive consistent poor ratings,</li>
                  <li>Or attempt to bypass the platform for direct deals</li>
                </ul>
                <p className="mt-2">...may be suspended or removed without notice.</p>
              </>
            }
          />

          <AgreementSection
            title="4. Media Content"
            text={
              <>
                <p className="mb-2">All property listings must include:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>At least 3 clear pictures of the property.</li>
                  <li>Documents if available (for verification badge).</li>
                </ul>
              </>
            }
          />

          <AgreementSection
            title="5. Acceptance"
            text="By signing this, the Agent agrees to all terms above and affirms intent to operate professionally on Rurblist."
          />
        </div>

        {/* CHECKBOX + BUTTON */}
        <div className="mt-6 space-y-4">
          {/* CHECKBOX */}
          <label className="flex items-center gap-3 border rounded-lg p-4 bg-white">
            <input
              type="checkbox"
              checked={isAgreement}
              onChange={(e) => setIsAgreement(e.target.checked)}
              className="accent-[#e87722] w-4 h-4"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to all terms in this Agent Participation Agreement
            </span>
          </label>

          {/* BUTTON */}
          <OrangeButton
            onClick={handleSubmit}
            loading={isPending}
            disabled={!isValid}
            fullWidth
            className="py-3 text-sm font-medium"
          >
            Accept Agreement
          </OrangeButton>

          {/* SUCCESS MODAL */}
          <SuccessModal
            isOpen={showSuccess}
            onClose={() => setShowSuccess(false)}
            onContinue={() => {
              setShowSuccess(false);
              router.push('/'); // or dashboard
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= SECTION ================= */

function AgreementSection({ title, text }: { title: string; text: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>

      <div className="text-sm text-gray-600 leading-relaxed">{text}</div>
    </div>
  );
}

