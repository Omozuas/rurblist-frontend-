'use client';

import { OrangeButton } from '@/components/button/button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function SuccessModal({ isOpen, onContinue }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#7A3E0A] flex items-center justify-center">
            <span className="text-2xl text-[#7A3E0A]">✓</span>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-[#7A3E0A] mb-2">Agreement Accepted!</h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 mb-6">
          You have successfully accepted the Rurblist Agent Participation Agreement. Welcome to our
          platform!
        </p>

        {/* BUTTON */}
        <OrangeButton onClick={onContinue} fullWidth>
          Continue
        </OrangeButton>
      </div>
    </div>
  );
}
