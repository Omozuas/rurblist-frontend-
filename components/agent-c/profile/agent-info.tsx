'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { OrangeButton } from '@/components/button/button';
import { IconImage } from '@/components/icon-image/icon-image';
import Textarea from '@/components/text-area';

interface AgentInfoProps {
  name: string;
  agency: string;
  experience: string;
  location: string;
  phone: string;
  email: string;
  about: string;
  image: string;
  onSendMessage?: (message: string) => Promise<void> | void;
}

export default function AgentInfoSection({
  name,
  agency,
  experience,
  location,
  phone,
  email,
  about,
  image,
  onSendMessage,
}: AgentInfoProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#7A3E0A] mb-6">Agent Info Section</h2>

      {/* Agent Card */}
      <div className="border rounded-xl p-4 sm:p-6 flex gap-4 sm:gap-6 items-center mb-8 sm:mb-10">
        {/* Image */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        {/* Info */}
        <div className="space-y-1 min-w-0">
          <h3 className="text-sm sm:text-xl font-semibold truncate">{name}</h3>
          <p className="text-sm sm:text-base text-gray-600">{agency}</p>
          <p className="text-sm sm:text-base text-gray-600">{experience}</p>
          <p className="text-sm sm:text-base text-gray-600">Area of operation: {location}</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        <ContactInfo phone={phone} email={email} onSendMessage={onSendMessage} />

        <AboutAgent about={about} />
      </div>
    </div>
  );
}

function ContactInfo({
  phone,
  email,
  onSendMessage,
}: {
  phone: string;
  email: string;
  onSendMessage?: (message: string) => Promise<void> | void;
}) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    try {
      setError('');
      setLoading(true);

      await onSendMessage?.(message);

      setMessage('');
    } catch {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-[#7A3E0A] mb-4">Contact Info</h3>

      <div className="space-y-4 text-gray-700 mb-5">
        <div className="flex items-center gap-3">
          <IconImage src={'/icons/phone.svg'} alt={'Phone'} height={20} width={20} />
          <p>{phone}</p>
        </div>

        <div className="flex items-center gap-3">
          <IconImage src={'/icons/mail (1).svg'} alt={'Email'} height={20} width={20} />
          <p>{email}</p>
        </div>
      </div>

      {/* Input */}
      <Textarea
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        error={error}
      />

      {/* Button */}
      <OrangeButton
        onClick={handleSend}
        loading={loading}
        iconSrc="/icons/mail.svg"
        iconPosition="left"
        fullWidth
        className="mt-4"
      >
        Send a message
      </OrangeButton>
    </div>
  );
}

function AboutAgent({ about }: { about: string }) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-[#7A3E0A] mb-4">About Agent</h3>

      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{about}</p>
    </div>
  );
}
