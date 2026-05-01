'use client'

import { PaymentSummaryCard } from './payment-summary-card'

interface PaymentItem {
  title: string
  amount: number
  icon: string
}

interface PaymentSummarySectionProps {
  items: PaymentItem[]
}

export function PaymentSummarySection({
  items
}: PaymentSummarySectionProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-6">
        Payment Summary
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <PaymentSummaryCard
            key={index}
            title={item.title}
            amount={item.amount}
            icon={item.icon}
            className="min-w-0"
          />
        ))}
      </div>
    </div>
  )
}