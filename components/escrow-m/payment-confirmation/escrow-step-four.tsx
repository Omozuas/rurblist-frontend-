'use client'

import { PaymentConfirmationCard } from './payment-confirmation-card'
import { OrangeButton } from '@/components/button/button'

export default function EscrowStepFour({
  onConfirm,
  propertyPrice,
  agencyFee,
  verificationFee
}: {
  onConfirm: () => void
  propertyPrice: number
  agencyFee: number
  verificationFee?: number | null
}) {
  const escrowFee = Math.round(propertyPrice * 0.01)
  const hasVerificationFee = typeof verificationFee === 'number' && Number.isFinite(verificationFee)
  const breakdown = [
    { label: 'Property Price', amount: propertyPrice },
    { label: 'Agency Fee', amount: agencyFee },
    { label: 'Escrow Fee', amount: escrowFee }
  ]

  if (hasVerificationFee) {
    breakdown.push({ label: 'Verification Fee', amount: verificationFee })
  }

  const total = breakdown.reduce(
    (sum, item) => sum + item.amount,
    0
  )

  return (
    <div className="w-full px-4 md:px-6 space-y-10">
      <h2 className="text-lg font-semibold">
        Confirmation
      </h2>

      <PaymentConfirmationCard
        total={total}
        breakdown={breakdown}
      />

      <div className="flex justify-center">
        <OrangeButton
          className="w-full sm:w-80 md:w-96 py-3"
          onClick={onConfirm}
        >
          Confirm
        </OrangeButton>
      </div>
    </div>
  )
}
