'use client';

import { OrangeButton } from '../button/button';

interface TourCardProps {
  propertyTitle: string;
  agentName: string;
  participantLabel?: string;
  dateTime: string;
  tourType: string;
  message: string;
  status: string;
  onCancel?: () => void;
  loading?: boolean;
}

export default function TourCard({
  propertyTitle,
  agentName,
  participantLabel = 'Agent',
  dateTime,
  tourType,
  onCancel,
  status,
  message,
  loading = false,
}: TourCardProps) {
  return (
    <div className="border rounded-lg p-5 bg-white space-y-3">
      <p className="text-sm text-gray-600">
        Property Info: <span className="font-medium text-gray-900">{propertyTitle}</span>
      </p>

      <p className="text-sm text-gray-600">
        {participantLabel}: <span className="font-medium text-gray-900">{agentName}</span>
      </p>

      <p className="text-sm text-gray-600">
        Requested Date & Time: <span className="font-medium text-gray-900">{dateTime}</span>
      </p>

      <p className="text-sm text-gray-600">
        Tour Type: <span className="font-medium text-gray-900">{tourType}</span>
      </p>

      {message?.trim() && (
        <p className="text-sm text-gray-600">
          message: <span className="font-medium text-gray-900">{message}</span>
        </p>
      )}

      {status !== 'cancelled' && (
        <div className="pt-2">
          <OrangeButton variant="gray" fullWidth onClick={onCancel} loading={loading}>
            Cancel tour
          </OrangeButton>
        </div>
      )}
    </div>
  );
}
